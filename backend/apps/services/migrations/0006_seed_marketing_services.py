from __future__ import annotations

from django.db import migrations


def seed_marketing_services(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    ServiceCategory = apps.get_model("services", "ServiceCategory")

    category, _ = ServiceCategory.objects.get_or_create(slug="default", defaults={"name": "الخدمات", "description": ""})

    services = [
        {
            "title": "كتابة المحتوى وصناعة الرسائل",
            "title_en": "Content & messaging",
            "description": "نكتب لنؤثر: محتوى ومفاهيم ورسائل تمس جمهورك وتدعم حملاتك.",
            "description_en": "Words that move people and fuel campaigns.",
            "features": ["محتوى المواقع", "محتوى السوشيال", "مقالات ومدونات", "نصوص إعلانية وVideo scripts", "هوية لفظية (Tone of Voice)"],
            "features_en": ["Website copy", "Social content", "Articles & blogs", "Ad copy & video scripts", "Verbal identity / TOV"],
            "icon": "content",
            "order": 10,
        },
        {
            "title": "التصميم والهوية البصرية",
            "title_en": "Design & brand identity",
            "description": "هوية متكاملة تخدم الهدف التجاري وتُحفظ في الذاكرة.",
            "description_en": "Memorable visuals built for business impact.",
            "features": ["شعارات وأدلة هوية", "تصاميم سوشيال وإعلانات", "UI/UX للمواقع والتطبيقات"],
            "features_en": ["Logos & brand systems", "Social & ad creatives", "UI/UX for web & apps"],
            "icon": "design",
            "order": 11,
        },
        {
            "title": "إنتاج الفيديو والموشن جرافيك",
            "title_en": "Video & motion graphics",
            "description": "فيديو يشرح ويقنع ويترك أثراً، من فكرة النص حتى المونتاج.",
            "description_en": "Story-driven video that explains, convinces, and sticks.",
            "features": ["فيديوهات تسويقية", "موشن جرافيك", "Reels & Shorts", "فيديوهات تعريفية", "مونتاج احترافي"],
            "features_en": ["Marketing videos", "Motion graphics", "Reels & Shorts", "Corporate explainers", "Professional editing"],
            "icon": "video",
            "order": 12,
        },
        {
            "title": "إدارة التسويق الرقمي والإعلانات",
            "title_en": "Digital marketing & ads",
            "description": "نستثمر الميزانية ولا نصرفها، مع تحليل وتحسين مستمر.",
            "description_en": "We invest budgets with measurable returns.",
            "features": ["حملات Google Ads", "إعلانات Meta", "استراتيجيات نمو", "تحسين الأداء والتحليل", "تقارير دورية واضحة"],
            "features_en": ["Google Ads management", "Meta (FB/IG) ads", "Growth strategies", "Performance optimization", "Clear periodic reporting"],
            "icon": "ads",
            "order": 13,
        },
        {
            "title": "برمجة المواقع والتطبيقات والأنظمة",
            "title_en": "Web, apps, and systems",
            "description": "مواقع وتطبيقات ولوحات تحكم قابلة للتوسع تدعم حملاتك وتسويقك.",
            "description_en": "Scalable sites, apps, and dashboards that power campaigns.",
            "features": ["مواقع احترافية ومتاجر", "تطبيقات ويب وموبايل", "أنظمة ولوحات تحكم مخصصة", "تكاملات وواجهات API"],
            "features_en": ["Professional sites & eCommerce", "Web & mobile apps", "Custom systems & dashboards", "APIs and integrations"],
            "icon": "code",
            "order": 14,
        },
    ]

    for svc in services:
        Service.objects.update_or_create(
            title=svc["title"],
            defaults={**svc, "category": category, "is_active": True},
        )


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0005_fix_service_translations"),
    ]

    operations = [
        migrations.RunPython(seed_marketing_services, reverse_code=migrations.RunPython.noop),
    ]
