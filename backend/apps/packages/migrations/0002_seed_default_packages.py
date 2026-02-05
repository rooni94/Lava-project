from __future__ import annotations

from decimal import Decimal

from django.db import migrations


def seed_packages(apps, schema_editor):
    PackageCategory = apps.get_model("packages", "PackageCategory")
    Package = apps.get_model("packages", "Package")

    categories = [
        {"slug": "react-sites", "name_ar": "برمجة مواقع خاصة (React/Next.js)", "name_en": "Custom web (React/Next.js)"},
        {"slug": "react-native-apps", "name_ar": "تطبيقات الجوال (React Native)", "name_en": "Mobile apps (React Native)"},
        {"slug": "wordpress-sites", "name_ar": "برمجة مواقع ووردبريس", "name_en": "WordPress sites"},
    ]

    cats = {}
    for cat in categories:
        obj, _ = PackageCategory.objects.get_or_create(slug=cat["slug"], defaults=cat)
        cats[cat["slug"]] = obj

    packages = [
        {
            "slug": "react-landing-mvp",
            "category": cats["react-sites"],
            "title_ar": "باقة MVP - مواقع خاصة",
            "title_en": "MVP – Custom site",
            "short_description_ar": "صفحة واحدة أو Landing، React + Tailwind، أداء عالي.",
            "short_description_en": "Single landing page, React + Tailwind, high performance.",
            "description_ar": "React + Tailwind\nأداء عالي\nمناسب لاختبار فكرة مشروع",
            "description_en": "React + Tailwind\nHigh performance\nGreat for validating a product idea",
            "price": Decimal("4000.00"),
            "price_note": "من 4,000 ريال",
            "currency": "SAR",
            "featured": False,
        },
        {
            "slug": "react-company",
            "category": cats["react-sites"],
            "title_ar": "باقة شركة - مواقع خاصة",
            "title_en": "Company site",
            "short_description_ar": "موقع متعدد الصفحات + API + لوحة تحكم بسيطة.",
            "short_description_en": "Multi-page site + API + light CMS.",
            "description_ar": "موقع متعدد الصفحات:\nReact + API\nلوحة تحكم بسيطة\nSEO تقني",
            "description_en": "Multi-page React site with API\nLight admin panel\nTechnical SEO in place",
            "price": Decimal("8000.00"),
            "price_note": "من 8,000 ريال",
            "currency": "SAR",
            "featured": True,
        },
        {
            "slug": "react-full-system",
            "category": cats["react-sites"],
            "title_ar": "باقة نظام متكامل - مواقع خاصة",
            "title_en": "Full system",
            "short_description_ar": "Frontend React + Backend مخصص، نظام مستخدمين وصلاحيات.",
            "short_description_en": "React frontend + custom backend, auth & roles.",
            "description_ar": "Frontend React + Backend مخصص:\nنظام مستخدمين\nصلاحيات\nDashboard احترافي\nقابل للتوسع",
            "description_en": "React frontend + custom backend\nUsers & roles\nPro dashboard\nScalable foundation",
            "price": Decimal("15000.00"),
            "price_note": "من 15,000 ريال",
            "currency": "SAR",
            "featured": False,
        },
        {
            "slug": "rn-mvp",
            "category": cats["react-native-apps"],
            "title_ar": "باقة MVP - تطبيقات الجوال",
            "title_en": "MVP – Mobile app",
            "short_description_ar": "تطبيق Android أو iOS، شاشات أساسية، ربط API.",
            "short_description_en": "Android or iOS app, core screens, API hookup.",
            "description_ar": "تطبيق Android أو iOS:\nشاشات أساسية\nربط API\nتصميم بسيط",
            "description_en": "Android or iOS\nCore screens\nAPI integration\nSimple UI",
            "price": Decimal("8000.00"),
            "price_note": "من 8,000 ريال",
            "currency": "SAR",
            "featured": False,
        },
        {
            "slug": "rn-pro",
            "category": cats["react-native-apps"],
            "title_ar": "باقة احترافية - تطبيقات الجوال",
            "title_en": "Pro mobile",
            "short_description_ar": "Android + iOS، تسجيل دخول، إشعارات، أداء عالي.",
            "short_description_en": "Android + iOS, auth, push, high performance.",
            "description_ar": "Android + iOS:\nنظام تسجيل دخول\nإشعارات\nأداء عالي",
            "description_en": "Android + iOS\nAuthentication\nPush notifications\nHigh performance",
            "price": Decimal("15000.00"),
            "price_note": "من 15,000 ريال",
            "currency": "SAR",
            "featured": True,
        },
        {
            "slug": "rn-startup",
            "category": cats["react-native-apps"],
            "title_ar": "باقة ستارت أب - تطبيقات الجوال",
            "title_en": "Startup bundle",
            "short_description_ar": "تصميم UI/UX كامل + Backend + لوحة تحكم + نشر المتاجر.",
            "short_description_en": "Full UI/UX + backend + admin + store deployment.",
            "description_ar": "تصميم UI/UX كامل:\nBackend متكامل\nلوحة تحكم\nنشر على المتاجر",
            "description_en": "Full UI/UX design\nIntegrated backend\nAdmin dashboard\nApp store publishing",
            "price": Decimal("25000.00"),
            "price_note": "من 25,000 ريال",
            "currency": "SAR",
            "featured": False,
        },
        {
            "slug": "wp-starter",
            "category": cats["wordpress-sites"],
            "title_ar": "باقة البداية - ووردبريس",
            "title_en": "Starter WordPress",
            "short_description_ar": "موقع تعريفي حتى 5 صفحات + متجاوب + أساسيات SEO.",
            "short_description_en": "Up to 5-page corporate site, responsive, SEO basics.",
            "description_ar": "مناسبة للشركات الصغيرة والأفراد:\nموقع تعريفي حتى 5 صفحات\nتصميم احترافي باستخدام قالب مميز\nمتجاوب مع الجوال\nلوحة تحكم سهلة\nأساسيات SEO",
            "description_en": "For small businesses:\nUp to 5 pages\nPro template\nResponsive\nEasy admin\nSEO basics",
            "price": Decimal("1500.00"),
            "price_note": "1500 – 2000 ريال",
            "currency": "SAR",
            "featured": False,
        },
        {
            "slug": "wp-business",
            "category": cats["wordpress-sites"],
            "title_ar": "باقة الأعمال - ووردبريس",
            "title_en": "Business WordPress",
            "short_description_ar": "موقع حتى 10 صفحات + تصميم مخصص + أمان ونسخ احتياطي.",
            "short_description_en": "Up to 10 pages, custom design, security & backup.",
            "description_ar": "للشركات والمتاجر الصغيرة:\nموقع حتى 10 صفحات\nتصميم مخصص وسرعة وأداء محسن\nإضافات أمان + نسخ احتياطي\nSEO متقدم\nدعم لغتين (عربي / إنجليزي)",
            "description_en": "For SMEs:\nUp to 10 pages\nCustom design + performance\nSecurity & backups\nAdvanced SEO\nArabic/English",
            "price": Decimal("3500.00"),
            "price_note": "3500 – 5000 ريال",
            "currency": "SAR",
            "featured": True,
        },
        {
            "slug": "wp-pro",
            "category": cats["wordpress-sites"],
            "title_ar": "باقة الاحتراف - ووردبريس",
            "title_en": "Pro WordPress",
            "short_description_ar": "تصميم UI/UX مخصص، صفحات غير محدودة، تكاملات، تدريب كامل.",
            "short_description_en": "Custom UI/UX, unlimited pages, integrations, training.",
            "description_ar": "للشركات المتقدمة:\nتصميم UI/UX مخصص 100%\nعدد صفحات غير محدود\nلوحة تحكم مخصصة\nأمان عالي وحماية\nتكامل مع أنظمة خارجية",
            "description_en": "For advanced teams:\nFully custom UI/UX\nUnlimited pages\nCustom admin\nHigh security\nIntegrations",
            "price": Decimal("7000.00"),
            "price_note": "يبدأ من 7,000 ريال",
            "currency": "SAR",
            "featured": False,
        },
    ]

    for pkg in packages:
        Package.objects.update_or_create(slug=pkg["slug"], defaults=pkg)


def unseed_packages(apps, schema_editor):
    Package = apps.get_model("packages", "Package")
    PackageCategory = apps.get_model("packages", "PackageCategory")
    slugs = [
        "react-landing-mvp",
        "react-company",
        "react-full-system",
        "rn-mvp",
        "rn-pro",
        "rn-startup",
        "wp-starter",
        "wp-business",
        "wp-pro",
    ]
    Package.objects.filter(slug__in=slugs).delete()
    PackageCategory.objects.filter(slug__in=["react-sites", "react-native-apps", "wordpress-sites"]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("packages", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_packages, reverse_code=unseed_packages),
    ]
