from __future__ import annotations

import logging
import re
from difflib import get_close_matches
from typing import Optional, List, Dict

from django.contrib.auth import get_user_model

from apps.core.email_utils import send_contact_notification
from apps.core.models import ContactMessage
from apps.packages.models import Package
from apps.services.models import Service
from .dialogue import DialogueResult, handle_no_ctx, handle_yes_like, detect_intent, SMALL_TALK
from .models import Conversation

logger = logging.getLogger(__name__)
User = get_user_model()

_CTX_MARK = "\u2063"
_BIT0 = "\u200b"
_BIT1 = "\u200c"

YES_LIKE = {"نعم", "اي", "ايه", "ايوه", "أجل", "تمام", "اوكي", "أوكي", "ok", "okay", "yes", "تمام"}
NO_LIKE = {"لا", "مو", "ما أبي", "الغ", "وقف", "no", "not", "ما ابغى", "ما ابغ", "ما أبي"}

SUPPORT_HINTS = ["دعم", "مشكلة", "خلل", "صيانة", "تقني", "bug", "support"]
PACKAGE_HINTS = ["باقة", "باقات", "بكج", "اشتراك"]
SERVICE_HINTS = ["خدمة", "خدمات", "تطوير", "برمجة", "تصميم", "تسويق", "هوية"]

HUMAN_HANDOVER = [
    "ابغى اكلم موظف",
    "ابي اكلم موظف",
    "ابي انسان",
    "ابغى انسان",
    "ابغى دعم بشري",
    "ابي دعم بشري",
    "موظف دعم",
    "اكلم بشر",
    "تواصل مع موظف",
    "support agent",
    "real person",
]

EMAIL_RE = re.compile(r"[\w.\-+]+@[\w\-.]+\.\w+")
PHONE_RE = re.compile(r"(?:\+?966|0)?5\d{8}")


def _sanitize_ctx_value(value: object) -> str:
    text = str(value)
    return text.replace("|", "/").replace(";", ",").replace("=", ":")


def _encode_ctx(stage: str, data: dict) -> str:
    payload = stage + "|" + ";".join(f"{k}={v}" for k, v in data.items())
    bits = "".join(f"{b:08b}" for b in payload.encode("utf-8"))
    hidden = "".join(_BIT0 if bit == "0" else _BIT1 for bit in bits)
    return f"{_CTX_MARK}{hidden}{_CTX_MARK}"


def _decode_ctx(text: str) -> Optional[dict]:
    if not text:
        return None
    start = text.find(_CTX_MARK)
    if start == -1:
        return None
    end = text.find(_CTX_MARK, start + 1)
    if end == -1:
        return None
    hidden = text[start + 1 : end]
    bits = []
    for ch in hidden:
        if ch == _BIT0:
            bits.append("0")
        elif ch == _BIT1:
            bits.append("1")
    if not bits or len(bits) % 8 != 0:
        return None
    try:
        data_bytes = bytes(int("".join(bits[i : i + 8]), 2) for i in range(0, len(bits), 8))
        payload = data_bytes.decode("utf-8")
    except Exception:
        return None
    if "|" not in payload:
        return None
    stage, rest = payload.split("|", 1)
    data = {}
    for part in rest.split(";"):
        if "=" in part:
            k, v = part.split("=", 1)
            data[k] = v
    return {"stage": stage, "data": data}


def _mark_reply(text: str, stage: Optional[str] = None, **data) -> str:
    if not stage:
        return text
    safe_data = {k: _sanitize_ctx_value(v) for k, v in data.items() if v is not None}
    return f"{text}{_encode_ctx(stage, safe_data)}"


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def _extract_int(text: str) -> Optional[int]:
    m = re.search(r"\d+", text or "")
    if not m:
        return None
    try:
        return int(m.group(0))
    except ValueError:
        return None


def _extract_budget(text: str) -> Optional[int]:
    nums = re.findall(r"\d+", text or "")
    if not nums:
        return None
    try:
        return int(nums[0])
    except ValueError:
        return None


def _is_yes(text: str) -> bool:
    lower = (text or "").lower()
    return any(word in lower for word in YES_LIKE)


def _is_no(text: str) -> bool:
    lower = (text or "").lower()
    return any(word in lower for word in NO_LIKE)


def _extract_email(text: str) -> Optional[str]:
    match = EMAIL_RE.search(text or "")
    return match.group(0) if match else None


def _extract_phone(text: str) -> Optional[str]:
    match = PHONE_RE.search(text or "")
    if not match:
        return None
    phone = match.group(0)
    return phone


def _wants_package(text: str) -> bool:
    lower = (text or "").lower()
    return any(k in lower for k in PACKAGE_HINTS)


def _wants_service(text: str) -> bool:
    lower = (text or "").lower()
    return any(k in lower for k in SERVICE_HINTS)


def _wants_support(text: str) -> bool:
    lower = (text or "").lower()
    return any(k in lower for k in SUPPORT_HINTS)


def _is_compare_request(lower: str) -> bool:
    return any(k in lower for k in ["فرق", "مقارنة", "قارن", "difference", "difference between", "وش الفرق", "ايش الفرق"])


def _is_price_request(lower: str) -> bool:
    return any(k in lower for k in ["سعر", "اسعار", "الاسعار", "الأسعار", "كم سعر", "كم اسعار", "price"])


def _is_ref_to_previous(lower: str) -> bool:
    return any(k in lower for k in ["بينهم", "بينها", "بينهن", "بينهم", "اسعارهم", "أسعارهم"])


def _best_service(query: str) -> Optional[Service]:
    query_norm = _normalize(query).lower()
    if not query_norm:
        return None
    services = list(Service.objects.filter(is_active=True))
    if not services:
        return None
    names = []
    for s in services:
        names.append((s.title or "", s.title_en or ""))
    for idx, (ar, en) in enumerate(names):
        if query_norm in (ar or "").lower() or (en and query_norm in en.lower()):
            return services[idx]
    flat = [f"{ar} {en}".strip().lower() for ar, en in names]
    close = get_close_matches(query_norm, flat, n=1, cutoff=0.55)
    if close:
        return services[flat.index(close[0])]
    return None


def _best_package(query: str) -> Optional[Package]:
    query_norm = _normalize(query).lower()
    if not query_norm:
        return None
    packages = list(Package.objects.filter(is_active=True))
    if not packages:
        return None
    names = []
    for p in packages:
        names.append((p.title_ar or "", p.title_en or "", p.slug or ""))
    for idx, (ar, en, slug) in enumerate(names):
        if query_norm in (ar or "").lower() or (en and query_norm in en.lower()) or query_norm in (slug or "").lower():
            return packages[idx]
    flat = [f"{ar} {en} {slug}".strip().lower() for ar, en, slug in names]
    close = get_close_matches(query_norm, flat, n=1, cutoff=0.55)
    if close:
        return packages[flat.index(close[0])]
    return None


def _recommend_package_by_budget(budget: Optional[int]) -> Optional[Package]:
    packages = list(Package.objects.filter(is_active=True))
    if not packages:
        return None
    if budget is None:
        return packages[0]
    filtered = [p for p in packages if getattr(p, "price", None) is not None and float(p.price) <= budget]
    if not filtered:
        return None
    filtered.sort(key=lambda x: float(x.price), reverse=True)
    return filtered[0]


def _top_services(limit: int = 3) -> List[str]:
    services = list(Service.objects.filter(is_active=True).order_by("order"))
    return [s.title for s in services[:limit] if s.title][:limit]


def _top_packages(limit: int = 3) -> List[str]:
    packages = list(Package.objects.filter(is_active=True).order_by("-featured", "-created_at"))
    titles = [p.title_ar or p.title_en for p in packages if (p.title_ar or p.title_en)]
    return titles[:limit]


def _packages_by_ids(ids: List[int]) -> List[Package]:
    if not ids:
        return []
    items = list(Package.objects.filter(is_active=True, id__in=ids))
    by_id = {p.id: p for p in items}
    return [by_id[i] for i in ids if i in by_id]


def _get_compare_packages(state: Dict[str, str], limit: int = 6) -> List[Package]:
    ids_raw = state.get("last_packages")
    if ids_raw:
        try:
            ids = [int(x) for x in ids_raw.split(",") if x.strip().isdigit()]
            picked = _packages_by_ids(ids)
            if picked:
                return picked
        except Exception:
            pass
    packages = list(Package.objects.filter(is_active=True).order_by("-featured", "-created_at"))
    return packages[:limit]


def _package_type_label(pkg: Package) -> str:
    if getattr(pkg, "product_type", "") == "bundle":
        return "باقة"
    return "خدمة"

def _format_currency(amount, currency: str | None) -> str:
    code = (currency or "").upper()
    label = "ريال" if code in {"SAR", "RIAL", "RIYAL"} else code or ""
    try:
        value = float(amount)
        if value.is_integer():
            value_str = f"{int(value):,}"
        else:
            value_str = f"{value:,.2f}"
    except Exception:
        value_str = str(amount)
    if label:
        return f"{value_str} {label}"
    return value_str



def _format_package_line(pkg: Package) -> str:
    title = pkg.title_ar or pkg.title_en
    note = pkg.price_note or pkg.price_note_en
    price = note or _format_currency(pkg.price, pkg.currency)
    desc = pkg.short_description_ar or pkg.short_description_en or ""
    desc_part = f" — {desc}" if desc else ""
    return f"- {title} ({_package_type_label(pkg)}){desc_part}\n  السعر: {price}"


def _compare_packages_reply(packages: List[Package]) -> str:
    lines = "\n".join(_format_package_line(p) for p in packages)
    return (
        "هذا الفرق المختصر بين الباقات وأسعارها:\n"
        f"{lines}\n"
        "تبغى تفاصيل أكثر عن باقة معيّنة؟"
    )


def _format_package(pkg: Package) -> str:
    title = pkg.title_ar or pkg.title_en
    note = pkg.price_note or pkg.price_note_en
    price = note or _format_currency(pkg.price, pkg.currency)
    desc = pkg.short_description_ar or pkg.short_description_en or ""
    desc_part = f" — {desc}" if desc else ""
    return f"{title}{desc_part}\nالسعر: {price}"


def _format_service(service: Service) -> str:
    title = service.title or service.title_en
    desc = service.description or service.description_en or ""
    desc = desc[:140] + "…" if len(desc) > 140 else desc
    return f"{title}\n{desc}" if desc else title


def _get_user_conversation(user: Optional[User], conversation: Optional[Conversation] = None) -> Optional[Conversation]:
    if conversation:
        return conversation
    if not user or not getattr(user, "is_authenticated", False):
        return None
    return (
        Conversation.objects.filter(customer=user, is_deleted=False, is_closed=False)
        .order_by("-created_at")
        .first()
    )


def _last_bot_ctx(conv: Optional[Conversation]) -> Optional[dict]:
    if not conv:
        return None
    last_bot = conv.messages.filter(sender_type="bot").order_by("-created_at").first()
    if not last_bot:
        return None
    return _decode_ctx(last_bot.content)


def _get_state(conv: Optional[Conversation]) -> Dict[str, str]:
    if not conv:
        return {}
    return dict(conv.bot_state or {})


def _save_state(conv: Optional[Conversation], data: Dict[str, str]) -> None:
    if not conv:
        return
    conv.bot_state = data
    conv.save(update_fields=["bot_state"])


def _reply_with_state(conv: Optional[Conversation], text: str, stage: str, data: Dict[str, str]) -> str:
    _save_state(conv, data)
    return _mark_reply(text, stage)


def _default_reply() -> str:
    services = ", ".join(_top_services())
    packages = ", ".join(_top_packages())
    return (
        "أقدر أساعدك في الباقات والخدمات والدعم الفني. "
        f"من خدماتنا: {services or 'تطوير منصات ومواقع وتطبيقات'}. "
        f"ومن باقاتنا: {packages or 'باقات جاهزة حسب احتياجك'}. "
        "وش تحب تبدأ به؟"
    )


def _guess_service_type(text: str) -> str:
    lower = (text or "").lower()
    if any(k in lower for k in ["جوال", "تطبيق", "ios", "android", "mobile"]):
        return "mobile"
    if any(k in lower for k in ["erp", "crm", "نظام", "أنظمة", "مخزون", "مبيعات"]):
        return "erp"
    if any(k in lower for k in ["ويب", "موقع", "متجر", "ecommerce", "website"]):
        return "web"
    return "other"


def _create_contact_message(data: Dict[str, str]) -> Optional[ContactMessage]:
    try:
        msg = ContactMessage.objects.create(
            name=data.get("name", "عميل"),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            message=data.get("brief", ""),
            service_type=data.get("service_type", "other"),
        )
        topic = data.get("topic", "sales")
        send_contact_notification(msg, topic=topic)
        return msg
    except Exception:
        logger.exception("Failed to create contact message from support bot")
        return None


def generate_bot_reply(user: Optional[User], content: str, conversation: Optional[Conversation] = None) -> str:
    original = content or ""
    text = _normalize(original)
    lower = text.lower()

    conv = _get_user_conversation(user, conversation)
    ctx = _last_bot_ctx(conv)
    ctx_stage = ctx.get("stage") if ctx else None
    state: Dict[str, str] = _get_state(conv)

    if (_is_compare_request(lower) or _is_price_request(lower) or _is_ref_to_previous(lower)) and (
        _wants_package(text) or "باقات" in lower or "باقة" in lower or state.get("last_packages")
    ):
        packages = _get_compare_packages(state)
        if not packages:
            return _mark_reply("حالياً ما عندنا باقات منشورة. تبي خدمة مخصصة؟", "ASK_INTENT")
        state["last_packages"] = ",".join(str(p.id) for p in packages)
        reply = _compare_packages_reply(packages)
        return _reply_with_state(conv, reply, "ASK_PACKAGE", state)

    if any(k in text for k in ["السلام عليكم", "سلام", "مرحبا", "هلا"]):
        reply = "هلا والله 👋 أنا مساعد لافا. تبي باقة، خدمة مخصصة، أو دعم فني؟"
        if ctx_stage:
            return _mark_reply(reply, ctx_stage)
        return _reply_with_state(conv, reply, "ASK_INTENT", {**state, "topic": state.get("topic", "sales")})

    if ctx_stage:
        intent = detect_intent(text)
        if intent in ("greeting", "smalltalk_howareyou", "smalltalk_thanks", "smalltalk_goodbye"):
            reply = SMALL_TALK.get(intent, SMALL_TALK["greeting"])
            if intent == "smalltalk_goodbye":
                return reply
            return _mark_reply(reply, ctx_stage)

    # ====== سياق سابق ======
    if ctx_stage:
        data = dict(state)

        if ctx_stage == "ASK_INTENT":
            if (_is_compare_request(lower) or _is_price_request(lower) or _is_ref_to_previous(lower)) and (
                "باقات" in lower or "باقة" in lower or state.get("last_packages")
            ):
                packages = _get_compare_packages(state)
                if packages:
                    data.update({"last_packages": ",".join(str(p.id) for p in packages)})
                    return _reply_with_state(conv, _compare_packages_reply(packages), "ASK_PACKAGE", data)
            if _wants_support(text):
                data.update({"topic": "support"})
                return _reply_with_state(conv, "أبشر، اكتب لي وصف المشكلة التقنية بشكل مختصر.", "ASK_SUPPORT_BRIEF", data)
            if _wants_package(text):
                data.update({"topic": data.get("topic", "sales"), "interest": "package"})
                packages_list = _get_compare_packages(data, limit=3)
                data["last_packages"] = ",".join(str(p.id) for p in packages_list)
                packages = ", ".join([p.title_ar or p.title_en for p in packages_list if (p.title_ar or p.title_en)])
                hint = f"عندنا باقات مثل: {packages}. اكتب اسم الباقة اللي تبغاها أو ميزانيتك."
                return _reply_with_state(conv, hint, "ASK_PACKAGE", data)
            if _wants_service(text):
                data.update({"topic": data.get("topic", "sales"), "interest": "service"})
                services = ", ".join(_top_services())
                hint = f"خدماتنا تشمل: {services}. اكتب الخدمة اللي تحتاجها أو وصف مختصر."
                return _reply_with_state(conv, hint, "ASK_SERVICE", data)
            if _is_yes(text):
                res = handle_yes_like(ctx_stage)
                return _mark_reply(res.reply, res.stage or ctx_stage)
            return _mark_reply("تقدر تقول: باقة، خدمة، أو دعم فني.", "ASK_INTENT")

        if ctx_stage == "ASK_PACKAGE":
            if _is_compare_request(lower) or _is_price_request(lower) or _is_ref_to_previous(lower):
                packages = _get_compare_packages(data)
                if packages:
                    data["last_packages"] = ",".join(str(p.id) for p in packages)
                    return _reply_with_state(conv, _compare_packages_reply(packages), "ASK_PACKAGE", data)
            pkg = _best_package(text)
            budget = _extract_budget(text)
            if not pkg and budget:
                pkg = _recommend_package_by_budget(budget)
                if pkg:
                    data.update({"interest": "package", "item_id": str(pkg.id), "item_name": pkg.title_ar or pkg.title_en, "budget": str(budget)})
                    return _reply_with_state(
                        conv,
                        f"حسب ميزانيتك أقترح لك:\n{_format_package(pkg)}\nتبغى نبدأ الطلب؟ عطيني اسمك وبريدك.",
                        "ASK_CONTACT_NAME",
                        data,
                    )
            if not pkg:
                service_match = _best_service(text)
                if service_match:
                    data.update({"interest": "service", "item_id": str(service_match.id), "item_name": service_match.title})
                    return _reply_with_state(
                        conv,
                        f"يبدو إن هذا اسم خدمة أكثر من كونه باقة:\n{_format_service(service_match)}\nتبغى نكمل طلب الخدمة؟",
                        "ASK_CONTACT_NAME",
                        data,
                    )
                packages = ", ".join(_top_packages())
                return _mark_reply(
                    f"ما لقيت الباقة. جرّب اسم باقة محدد أو ميزانيتك. أمثلة: {packages}.",
                    "ASK_PACKAGE",
                )
            data.update({"interest": "package", "item_id": str(pkg.id), "item_name": pkg.title_ar or pkg.title_en})
            return _reply_with_state(
                conv,
                f"هذه تفاصيل الباقة:\n{_format_package(pkg)}\nتبغى نكمل ونسجل طلبك؟",
                "ASK_CONTACT_NAME",
                data,
            )

        if ctx_stage == "ASK_SERVICE":
            service = _best_service(text)
            if not service:
                services = ", ".join(_top_services())
                return _mark_reply(
                    f"ما لقيت الخدمة بالاسم. اكتب وصف مختصر أو اختر من: {services}.",
                    "ASK_SERVICE",
                )
            data.update({"interest": "service", "item_id": str(service.id), "item_name": service.title})
            return _reply_with_state(
                conv,
                f"ممتاز، هذه لمحة عن الخدمة:\n{_format_service(service)}\nتبغى نكمل ونسجل طلبك؟",
                "ASK_CONTACT_NAME",
                data,
            )

        if ctx_stage == "ASK_BUDGET":
            budget = _extract_budget(text)
            if not budget:
                return _mark_reply("كم الميزانية التقريبية بالريال؟", "ASK_BUDGET")
            data.update({"budget": str(budget)})
            pkg = _recommend_package_by_budget(budget)
            if pkg:
                data.update({"interest": "package", "item_id": str(pkg.id), "item_name": pkg.title_ar or pkg.title_en})
                return _reply_with_state(
                    conv,
                    f"حسب الميزانية أقترح:\n{_format_package(pkg)}\nتبغى نكمل الطلب؟ عطيني اسمك وبريدك.",
                    "ASK_CONTACT_NAME",
                    data,
                )
            return _reply_with_state(conv, "تمام، عطيني اسمك وبريدك عشان نكمل الطلب.", "ASK_CONTACT_NAME", data)

        if ctx_stage == "ASK_SUPPORT_BRIEF":
            brief = text
            data.update({"topic": "support"})
            _save_state(conv, data)
            return _mark_reply("تمام، عطيني اسمك الكامل.", "ASK_CONTACT_NAME")

        if ctx_stage == "ASK_CONTACT_NAME":
            name = text.strip()
            if not name:
                return _mark_reply("عطني اسمك الكامل عشان نكمل.", "ASK_CONTACT_NAME")
            data.update({"name": name})
            return _reply_with_state(conv, "ممتاز. اكتب بريدك الإلكتروني للتواصل.", "ASK_CONTACT_EMAIL", data)

        if ctx_stage == "ASK_CONTACT_EMAIL":
            email = _extract_email(text)
            if not email:
                return _mark_reply("اكتب بريد صحيح مثل: name@email.com", "ASK_CONTACT_EMAIL")
            data.update({"email": email})
            return _reply_with_state(conv, "لو تقدر، اكتب رقم جوالك (اختياري).", "ASK_CONTACT_PHONE", data)

        if ctx_stage == "ASK_CONTACT_PHONE":
            phone = _extract_phone(text)
            if phone:
                data.update({"phone": phone})
            else:
                lower_text = (text or "").lower()
                if any(k in lower_text for k in ["بدون", "ما عندي", "مو لازم", "لا"]):
                    data.update({"phone": ""})
                else:
                    return _mark_reply("اكتب رقم جوالك بصيغة 05xxxxxxxx أو قل بدون.", "ASK_CONTACT_PHONE")
            return _reply_with_state(conv, "اكتب نبذة مختصرة عن طلبك أو المشكلة.", "ASK_BRIEF", data)

        if ctx_stage == "ASK_BRIEF":
            brief = text.strip()
            if not brief:
                return _mark_reply("اكتب نبذة مختصرة عن طلبك أو المشكلة.", "ASK_BRIEF")

            service_type = _guess_service_type(f"{data.get('item_name', '')} {brief}")
            payload = {**data, "brief": brief, "service_type": service_type}
            msg = _create_contact_message(payload)
            if msg:
                return _reply_with_state(
                    conv,
                    "تم استلام طلبك ✅ بنعاود التواصل خلال 24–48 ساعة عمل. إذا تحتاج تعديل أو إضافة قل لي.",
                    "ASK_NEXT",
                    data,
                )
            return _mark_reply("حاولت أسجل طلبك لكن صار خطأ. تقدر ترسل لنا عبر صفحة تواصل معنا.", None)

        if ctx_stage == "ASK_NEXT":
            if _is_yes(text):
                return _mark_reply("تمام، وش الإضافة أو التعديل اللي تبيه؟", "ASK_BRIEF")
            if _is_no(text):
                _save_state(conv, {})
                return _mark_reply("تمام، إذا احتجت شيء لاحقًا أنا حاضر.", None)
            if _wants_support(text):
                return _mark_reply("اكتب وصف المشكلة التقنية.", "ASK_SUPPORT_BRIEF")
            return _mark_reply("أقدر أضيف ملاحظة أو نعدل الطلب. وش تحب؟", "ASK_NEXT")

    # ====== بدون سياق سابق ======
    def services_hint() -> str:
        services = ", ".join(_top_services())
        return f"خدمات لافا تشمل: {services}. اكتب الخدمة اللي تحتاجها أو وصف مختصر."

    def packages_hint() -> str:
        packages_list = _get_compare_packages(state, limit=3)
        names = ", ".join([p.title_ar or p.title_en for p in packages_list if (p.title_ar or p.title_en)])
        return f"باقاتنا الحالية: {names}. اكتب اسم الباقة أو ميزانيتك."

    dialogue_result: Optional[DialogueResult] = handle_no_ctx(
        text,
        services_hint=services_hint,
        packages_hint=packages_hint,
        fallback_reply=_default_reply(),
    )
    if dialogue_result:
        if dialogue_result.stage:
            new_state = {**state, **(dialogue_result.data or {})}
            if dialogue_result.stage == "ASK_PACKAGE" and not new_state.get("last_packages"):
                pkgs = _get_compare_packages(new_state, limit=3)
                if pkgs:
                    new_state["last_packages"] = ",".join(str(p.id) for p in pkgs)
            return _reply_with_state(conv, dialogue_result.reply, dialogue_result.stage, new_state)
        return dialogue_result.reply

    if _is_yes(text):
        res = handle_yes_like(ctx_stage)
        if res:
            if res.stage:
                return _mark_reply(res.reply, res.stage)
            return res.reply

    return _default_reply()


def should_handover_to_human(content: str) -> bool:
    text = (content or "").strip().lower()
    return any(p in text for p in HUMAN_HANDOVER)
