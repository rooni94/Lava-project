"""
منطق النوايا والحوارات العامة (تحية، أسئلة، ترشيحات، دعم).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Callable

INTENT_KEYWORDS = {
    "greeting": ["هلا", "مرحبا", "يا هلا", "اهلا", "السلام عليكم", "سلام"],
    "smalltalk_howareyou": ["كيف حالك", "كيفك", "شلونك", "ايش اخبارك", "وش اخبارك"],
    "smalltalk_thanks": ["شكرا", "شكرًا", "يسلمو", "يعطيك العافية", "مشكور"],
    "smalltalk_goodbye": ["مع السلامة", "باي", "وداع", "أشوفك"],
    "ask_services": ["خدمات", "خدمة", "تطوير", "برمجة", "تصميم", "تسويق", "هوية"],
    "ask_packages": ["باقة", "باقات", "بكج", "اشتراك", "باقاتكم"],
    "pricing": ["سعر", "اسعار", "تكلفة", "كم يكلف", "ميزانية", "budget", "price"],
    "purchase": ["أبغى اشتري", "ابي اشتري", "أبغى باقة", "ابي باقة", "أبغى أتعاقد", "اتعاقد", "اشترك", "احجز"],
    "support": ["دعم", "مشكلة", "خلل", "صيانة", "bug", "support", "تقني"],
    "contact": ["تواصل", "اتصل", "رقم", "واتساب", "بريد"],
}

SMALL_TALK = {
    "greeting": "هلا والله 👋 أنا مساعد لافا. تبي استفسار عن الباقات أو الخدمات؟ أو عندك دعم فني؟",
    "smalltalk_howareyou": "تمام الحمدلله 🌿 وانت كيفك؟ وش ودك نسوي لك اليوم؟",
    "smalltalk_thanks": "العفو يا بعدي 🌟 أي استفسار أنا حاضر.",
    "smalltalk_goodbye": "في أمان الله 👋 إذا احتجت أي شيء رجع لي.",
}


@dataclass
class DialogueResult:
    reply: str
    stage: Optional[str] = None
    data: Optional[dict] = None


def detect_intent(text: str) -> Optional[str]:
    lower = (text or "").lower()
    for intent, words in INTENT_KEYWORDS.items():
        if any(w in lower for w in words):
            return intent
    return None


def handle_no_ctx(
    text: str,
    services_hint: Callable[[], str],
    packages_hint: Callable[[], str],
    fallback_reply: str,
) -> Optional[DialogueResult]:
    intent = detect_intent(text)
    if intent in ("greeting", "smalltalk_howareyou", "smalltalk_thanks", "smalltalk_goodbye"):
        return DialogueResult(SMALL_TALK.get(intent, SMALL_TALK["greeting"]), stage="ASK_INTENT", data={})
    if intent == "ask_services":
        return DialogueResult(services_hint(), stage="ASK_SERVICE", data={})
    if intent == "ask_packages":
        return DialogueResult(packages_hint(), stage="ASK_PACKAGE", data={})
    if intent == "pricing":
        return DialogueResult("تمام، كم الميزانية التقريبية بالريال؟", stage="ASK_BUDGET", data={})
    if intent == "purchase":
        return DialogueResult("حلو! تبي باقة جاهزة ولا خدمة مخصصة؟", stage="ASK_INTENT", data={"topic": "sales"})
    if intent == "support":
        return DialogueResult("أبشر، اكتب لي وصف المشكلة التقنية بشكل مختصر.", stage="ASK_SUPPORT_BRIEF", data={"topic": "support"})
    if intent == "contact":
        return DialogueResult("أكيد. عطني اسمك وبريدك عشان نتواصل معك.", stage="ASK_CONTACT_NAME", data={"topic": "sales"})
    return DialogueResult(fallback_reply)


def handle_yes_like(last_stage: Optional[str]) -> Optional[DialogueResult]:
    if not last_stage:
        return DialogueResult("أبشر، نعم على أي خيار بالضبط؟ باقة، خدمة، ولا دعم فني؟", stage="ASK_INTENT")
    if last_stage == "ASK_INTENT":
        return DialogueResult("تمام. تبي باقة جاهزة ولا خدمة مخصصة؟", stage="ASK_INTENT")
    if last_stage == "ASK_PACKAGE":
        return DialogueResult("اكتب اسم الباقة اللي تبغاها أو ميزانيتك.", stage="ASK_PACKAGE")
    if last_stage == "ASK_SERVICE":
        return DialogueResult("اكتب اسم الخدمة أو وصف مختصر للي تحتاجه.", stage="ASK_SERVICE")
    if last_stage == "ASK_BUDGET":
        return DialogueResult("كم الميزانية التقريبية بالريال؟", stage="ASK_BUDGET")
    if last_stage in ("ASK_SUPPORT_BRIEF", "ASK_BRIEF"):
        return DialogueResult("اكتب التفاصيل باختصار، وبعدها أخذ بياناتك للتواصل.", stage=last_stage)
    return DialogueResult("وضح لي أكثر وش تبغى بالضبط؟")
