from __future__ import annotations

from decimal import Decimal

from django.db import migrations


def seed_marketing(apps, schema_editor):
    PackageCategory = apps.get_model("packages", "PackageCategory")
    Package = apps.get_model("packages", "Package")

    marketing_cat, _ = PackageCategory.objects.get_or_create(
        slug="marketing", defaults={"name_ar": "باقات التسويق", "name_en": "Marketing packages"}
    )

    packages = [
        {
            "slug": "ignite-marketing",
            "title_ar": "باقة الإطلاق – Ignite",
            "title_en": "Ignite Package",
            "short_description_ar": "مناسبة للأفراد والشركات الناشئة لبناء حضور رقمي واضح.",
            "short_description_en": "For startups and individuals to establish a solid digital presence.",
            "description_ar": "استراتيجية محتوى أساسية\n8 منشورات + 8 تصاميم شهريًا\nإدارة منصة واحدة\nتحسين الهوية البصرية\nتقرير أداء شهري مبسّط",
            "description_en": "Basic content strategy\n8 posts + 8 designs / month\nManage 1 social platform\nVisual identity polish\nMonthly performance summary",
            "price": Decimal("1500.00"),
            "price_note": "$1,500",
            "currency": "USD",
            "featured": False,
        },
        {
            "slug": "growth-marketing",
            "title_ar": "باقة النمو – Growth",
            "title_en": "Growth Package",
            "short_description_ar": "مناسبة للشركات الصغيرة والمتوسطة لزيادة التفاعل وبناء جمهور.",
            "short_description_en": "For SMBs to boost engagement and build audience.",
            "description_ar": "استراتيجية تسويق شهرية\n12 منشور + 12 تصميم\nإدارة منصتين\nفيديو قصير/موشن شهريًا\nإدارة الحملات (ميزانية الإعلان غير مشمولة)\nتقرير وتحليل شهري",
            "description_en": "Monthly marketing strategy\n12 posts + 12 designs\nManage 2 platforms\n1 short video/motion monthly\nAd management (budget excluded)\nMonthly report & insights",
            "price": Decimal("3000.00"),
            "price_note": "$3,000",
            "currency": "USD",
            "featured": False,
        },
        {
            "slug": "impact-marketing",
            "title_ar": "باقة التأثير – Impact",
            "title_en": "Impact Package",
            "short_description_ar": "للعلامات المتوسعة لتعزيز العلامة وزيادة التحويلات.",
            "short_description_en": "For scaling brands to strengthen presence and conversions.",
            "description_ar": "استراتيجية متقدمة\nمحتوى وتصميم متقدم\nإدارة 3 منصات\n2 فيديو موشن شهريًا\nتحسين وإدارة الحملات\nتطوير Landing Page\nتقارير تفصيلية وتحسين مستمر",
            "description_en": "Advanced strategy\nFull content & advanced design\nManage 3 platforms\n2 motion videos monthly\nAd optimization\nLanding page development\nDetailed reports + continuous improvements",
            "price": Decimal("5500.00"),
            "price_note": "$5,500",
            "currency": "USD",
            "featured": True,
        },
        {
            "slug": "authority-marketing",
            "title_ar": "باقة السيطرة – Authority",
            "title_en": "Authority Package",
            "short_description_ar": "للشركات الكبيرة لبناء سلطة رقمية وقيادة السوق.",
            "short_description_en": "For enterprises to lead the market with strong digital authority.",
            "description_ar": "إدارة تسويق متكاملة\nفريق مخصص\nمحتوى وتصميم عالي الحجم\nفيديوهات احترافية\nإدارة جميع المنصات\nحملات متعددة القنوات\nتطوير موقع/نظام مخصص\nتقارير استراتيجية واجتماعات دورية",
            "description_en": "Full marketing management\nDedicated project team\nHigh-volume content & design\nPro video production\nAll-platform management\nMulti-channel campaigns\nCustom website/system\nStrategic reports + regular meetings",
            "price": Decimal("9000.00"),
            "price_note": "$9,000",
            "currency": "USD",
            "featured": True,
        },
        {
            "slug": "smart-custom-marketing",
            "title_ar": "الباقة الذكية – Smart Custom",
            "title_en": "Smart Custom Package",
            "short_description_ar": "مصممة خصيصًا حسب النشاط والأهداف والميزانية.",
            "short_description_en": "Tailored to your business, goals, market, and budget.",
            "description_ar": "تحليل نشاطك وأهدافك وحجم السوق\nتصميم باقة مخصصة من المحتوى، التصميم، الإعلانات، والتطوير التقني\nمرونة تامة في البنود والحجم",
            "description_en": "Assess your business, goals, and market size\nDesign a bespoke mix of content, design, ads, and tech\nFull flexibility on scope and scale",
            "price": Decimal("0.00"),
            "price_note": "Custom",
            "currency": "USD",
            "featured": False,
        },
    ]

    for pkg in packages:
        Package.objects.update_or_create(slug=pkg["slug"], defaults={**pkg, "category": marketing_cat, "product_type": "service"})


def unseed_marketing(apps, schema_editor):
    Package = apps.get_model("packages", "Package")
    PackageCategory = apps.get_model("packages", "PackageCategory")
    slugs = [
        "ignite-marketing",
        "growth-marketing",
        "impact-marketing",
        "authority-marketing",
        "smart-custom-marketing",
    ]
    Package.objects.filter(slug__in=slugs).delete()
    PackageCategory.objects.filter(slug="marketing").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("packages", "0002_seed_default_packages"),
    ]

    operations = [
        migrations.RunPython(seed_marketing, reverse_code=unseed_marketing),
    ]
