from __future__ import annotations

from pathlib import Path

from django.db import migrations
from django.utils.text import slugify


def seed_user_projects(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    Technology = apps.get_model("portfolio", "Technology")

    from django.conf import settings
    from django.core.files.base import ContentFile
    from django.core.files.storage import default_storage

    def get_tech(name: str):
        slug = slugify(name) or name.lower().replace(" ", "-")
        obj, _ = Technology.objects.get_or_create(name=name, defaults={"slug": slug})
        return obj

    def _read_placeholder(asset_slug: str, filename: str) -> bytes | None:
        path = Path(settings.BASE_DIR) / "static" / "portfolio" / asset_slug / filename
        try:
            return path.read_bytes()
        except Exception:
            return None

    def _ensure_media_file(storage_path: str, data: bytes) -> None:
        if not default_storage.exists(storage_path):
            default_storage.save(storage_path, ContentFile(data))

    projects = [
        {
            "asset_slug": "masej-store",
            "title": "متجر مسج (Masej Store)",
            "title_en": "Masej Store",
            "description": "بنية أولية لمنصة متجر إلكتروني متعددة القنوات تشمل لوحة إدارة وواجهة ويب وتطبيق جوال، مع باك-إند REST جاهز للتوسّع.",
            "description_en": "Scaffolding for a multi-channel e-commerce platform (admin, web, and mobile) with an extensible REST backend.",
            "summary": "المشروع يوفّر أساس قوي للمتجر: حسابات وتوثيق JWT، كتالوج منتجات، سلة، طلبات، مدفوعات، محتوى وتسويق، ودعم محادثات، مع Docker وNginx لتجهيز النشر.",
            "summary_en": "A strong e-commerce foundation: JWT auth, product catalog, cart, orders, payments module, content/marketing, and support chat, with Docker + Nginx for deployment.",
            "goals": "• تقليل وقت إطلاق متجر جديد عبر بنية جاهزة.\n• توحيد الويب + تطبيق الجوال على نفس الـ API.\n• فصل الوحدات (Catalog/Cart/Orders/Payments/Support) لتسهيل التطوير.",
            "goals_en": "• Reduce time-to-launch with a ready scaffolding.\n• Unify web + mobile on the same API.\n• Modularize (Catalog/Cart/Orders/Payments/Support) to scale development.",
            "challenges": "• بناء بنية قابلة للتوسّع مع وحدات متعددة منذ اليوم الأول.\n• ضمان جاهزية النشر (reverse proxy, media, env configs).\n• دعم واجهات RTL عربية أولاً.",
            "challenges_en": "• Designing an extensible multi-app architecture from day one.\n• Production readiness (reverse proxy, media, env configs).\n• Arabic-first RTL UI considerations.",
            "solution": "• Django REST + JWT مع تطبيقات: catalog, carts, orders, payments, contenthub, marketing, support.\n• Frontend React + Vite (TypeScript) مع React Query وZustand وTailwind.\n• Mobile Expo React Native (TypeScript) مع التنقل وReact Query.\n• دعم محادثات (Channels/WebSockets) + Celery + Redis.\n• Docker Compose + Nginx لتجميع الخدمات.",
            "solution_en": "• Django REST + JWT with apps: catalog, carts, orders, payments, contenthub, marketing, support.\n• React + Vite (TypeScript) frontend using React Query, Zustand, Tailwind.\n• Expo React Native (TypeScript) mobile starter with navigation + React Query.\n• Support chat (Channels/WebSockets) + Celery + Redis.\n• Docker Compose + Nginx for service orchestration.",
            "results": "• جاهزية لتطوير تدفقات المتجر (التصفح/السلة/الطلبات) بسرعة.\n• بنية نشر واضحة وقابلة للتكرار.\n• أساس تقني مناسب لتوسعة المدفوعات والرسائل والتقارير.",
            "results_en": "• Faster iteration on storefront flows (browse/cart/orders).\n• Clear, repeatable deployment baseline.\n• A solid base to expand payments, messaging, and reporting.",
            "scope": "Backend API + Web frontend + Mobile app + Docker/Nginx",
            "scope_en": "Backend API + Web frontend + Mobile app + Docker/Nginx",
            "category": "web",
            "client": "Internal / Template",
            "client_en": "Internal / Template",
            "status": "done",
            "is_active": True,
            "technologies": [
                "Python",
                "Django",
                "Django REST Framework",
                "JWT",
                "PostgreSQL",
                "Redis",
                "Celery",
                "Channels",
                "Docker",
                "Nginx",
                "TypeScript",
                "React",
                "Vite",
                "Tailwind CSS",
                "Framer Motion",
                "React Query",
                "Zustand",
                "React Native",
                "Expo",
            ],
        },
        {
            "asset_slug": "dev-portfolio-fullstack",
            "title": "موقع بورتفوليو ثنائي اللغة + لوحة تحكم (Dev Portfolio Fullstack)",
            "title_en": "Dev Portfolio Fullstack (Bilingual + Dashboard)",
            "description": "قالب جاهز لبورتفوليو عربي/إنجليزي مع لوحة تحكم لإدارة الأعمال والوسائط والروابط.",
            "description_en": "A bilingual (AR/EN) portfolio template with a dashboard to manage projects, media, and links.",
            "summary": "يشمل واجهة عامة مع عرض الأعمال وتفاصيلها، ولوحة تحكم لتعديل المشاريع وإدارة الوسائط والروابط مع ترتيب Drag & Drop ووضع غلاف للمشروع.",
            "summary_en": "Includes a public portfolio with project browsing/details, plus a dashboard for editing projects, managing media/links with drag & drop ordering and cover selection.",
            "goals": "• توفير نقطة انطلاق لبورتفوليو احترافي بواجهتين عربي/إنجليزي.\n• تسريع إدارة المحتوى عبر لوحة تحكم.\n• دعم وسائط وروابط متعددة لكل مشروع.",
            "goals_en": "• Provide a professional bilingual portfolio starter.\n• Speed up content management via dashboard.\n• Support multiple media and links per project.",
            "challenges": "• تجربة RTL نظيفة مع i18n.\n• إدارة وسائط متعددة وترتيبها بدون تعقيد.\n• حماية عرض الـ demo ضمن iframe.",
            "challenges_en": "• Clean RTL experience with i18n.\n• Managing ordered media and links without complexity.\n• Securing demo display inside an iframe.",
            "solution": "• Django REST + JWT + نماذج Projects/Media/Links.\n• واجهة React + Vite + Tailwind + Framer Motion + i18next.\n• لوحة تحكم: ترتيب Drag & Drop للروابط والوسائط + اختيار Cover.\n• حماية iframe بـ sandbox + allowlist للنطاقات.",
            "solution_en": "• Django REST + JWT with Projects/Media/Links models.\n• React + Vite + Tailwind + Framer Motion + i18next frontend.\n• Dashboard: drag & drop ordering for links/media + cover selection.\n• Safe demo iframe via sandbox + domain allowlist.",
            "results": "• قالب جاهز لإضافة أعمال بسرعة.\n• واجهة عامة وتجربة لوحة تحكم مستقرة.\n• أساس مناسب للتخصيص والنشر.",
            "results_en": "• A ready template to add projects quickly.\n• Stable public UI and dashboard experience.\n• A solid base for customization and deployment.",
            "scope": "Backend API + Dashboard + Public portfolio",
            "scope_en": "Backend API + Dashboard + Public portfolio",
            "category": "web",
            "client": "Internal / Template",
            "client_en": "Internal / Template",
            "status": "done",
            "is_active": True,
            "technologies": [
                "Python",
                "Django",
                "Django REST Framework",
                "JWT",
                "TypeScript",
                "React",
                "Vite",
                "Tailwind CSS",
                "Framer Motion",
                "i18next",
                "PostgreSQL",
            ],
        },
        {
            "asset_slug": "shilat",
            "title": "شيلات — تحويل القصائد إلى شيلة (Shilat)",
            "title_en": "Shilat — Poem-to-Shilah Converter",
            "description": "تطبيق ويب يحوّل القصائد العربية إلى شيلات عبر مزوّدي صوت (ElevenLabs/Google TTS) مع مدارس وإيقاعات وقاموس لهجات.",
            "description_en": "A web app that converts Arabic poems into shilah-style audio using voice providers (ElevenLabs/Google TTS), with schools/rhythms and a dialect lexicon.",
            "summary": "يدعم اختيار مدرسة الشيلات والإيقاع، معاينة الإيقاع (metronome/waveform)، جلب الأصوات من ElevenLabs، وتوليد الصوت في مهام خلفية مع تتبع الحالة والتنزيل.",
            "summary_en": "Supports selecting shilah school/rhythm, rhythm preview (metronome/waveform), fetching voices from ElevenLabs, and generating audio via background jobs with status tracking and download.",
            "goals": "• تحويل نص عربي إلى صوت منسق بحسب مدرسة/إيقاع.\n• تقليل أخطاء النطق عبر قاموس لهجات (Alias replacements).\n• معالجة التوليد بالمهام الخلفية لتجربة سلسة.",
            "goals_en": "• Convert Arabic text into styled audio based on school/rhythm.\n• Improve pronunciation via dialect lexicon (alias replacements).\n• Offload generation to background jobs for a smooth UX.",
            "challenges": "• دعم لهجات ونطق عربي صحيح.\n• تكامل آمن مع مزود الصوت وإدارة المفاتيح.\n• معالجة الصوت والقصّ/الدمج وتصدير ملفات جاهزة.",
            "challenges_en": "• Handling Arabic pronunciation and dialect nuances.\n• Secure integration with voice providers and key management.\n• Audio post-processing and exporting ready files.",
            "solution": "• Django REST API + Celery + Redis لمعالجة التوليد.\n• مزودين للصوت: ElevenLabs + Google Cloud Text-to-Speech.\n• Endpoints: submit/generate/job-status/download + إدارة styles/schools/rhythms.\n• واجهة React + Vite + Tailwind مع نماذج إدخال واضحة.",
            "solution_en": "• Django REST API + Celery + Redis for generation jobs.\n• Voice providers: ElevenLabs + Google Cloud Text-to-Speech.\n• Endpoints: submit/generate/job-status/download + styles/schools/rhythms.\n• React + Vite + Tailwind frontend with clear input flows.",
            "results": "• تجربة MVP++ قريبة للواقع مع خيارات متعددة.\n• بنية قابلة لتوسعة مدارس/إيقاعات ومزودين.\n• توليد صوت عبر مهام خلفية مع تنزيل مباشر.",
            "results_en": "• A more realistic MVP++ experience with multiple options.\n• Extensible architecture for more schools/rhythms/providers.\n• Background audio generation with direct download.",
            "scope": "Backend API + Background jobs + Web UI",
            "scope_en": "Backend API + Background jobs + Web UI",
            "category": "web",
            "client": "Shilat",
            "client_en": "Shilat",
            "status": "done",
            "is_active": True,
            "technologies": [
                "Python",
                "Django",
                "Django REST Framework",
                "Celery",
                "Redis",
                "PostgreSQL",
                "TypeScript",
                "React",
                "Vite",
                "Tailwind CSS",
                "ElevenLabs",
                "Google Cloud Text-to-Speech",
            ],
        },
    ]

    for item in projects:
        asset_slug = item.pop("asset_slug")
        tech_objs = [get_tech(t) for t in item.pop("technologies", [])]
        title = item["title"]
        defaults = {k: v for k, v in item.items() if k != "title"}
        project, created = Project.objects.get_or_create(title=title, defaults=defaults)

        if not created:
            update_fields = []
            for field, value in defaults.items():
                if value is None:
                    continue
                current = getattr(project, field, None)
                # Only fill missing fields; don't overwrite user edits.
                if (current is None or current == "" or current == [] or current == {}) and value not in ("", None, [], {}):
                    setattr(project, field, value)
                    update_fields.append(field)
            if update_fields:
                project.save(update_fields=update_fields)

        # Seed placeholder cover + gallery into MEDIA (works with nginx /media and avoids hashed static paths).
        cover_bytes = _read_placeholder(asset_slug, "cover.webp")
        if cover_bytes and not getattr(project, "cover_image", ""):
            project.cover_image.save(f"seed/{asset_slug}/cover.webp", ContentFile(cover_bytes), save=False)

        if not (project.gallery or []):
            gallery = []
            for i in range(1, 4):
                data = _read_placeholder(asset_slug, f"{i:02d}.webp")
                if not data:
                    continue
                storage_path = f"projects/seed/{asset_slug}/{i:02d}.webp"
                _ensure_media_file(storage_path, data)
                gallery.append(f"projects/seed/{asset_slug}/{i:02d}.webp")
            if gallery:
                project.gallery = gallery

        if (cover_bytes and getattr(project.cover_image, "name", "")) or (project.gallery or []):
            project.save()

        if tech_objs and (created or not project.technologies.exists()):
            project.technologies.set(tech_objs)


def unseed_user_projects(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    titles = [
        "متجر مسج (Masej Store)",
        "موقع بورتفوليو ثنائي اللغة + لوحة تحكم (Dev Portfolio Fullstack)",
        "شيلات — تحويل القصائد إلى شيلة (Shilat)",
    ]
    Project.objects.filter(title__in=titles).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0011_add_project_is_active"),
    ]

    operations = [
        migrations.RunPython(seed_user_projects, unseed_user_projects),
    ]
