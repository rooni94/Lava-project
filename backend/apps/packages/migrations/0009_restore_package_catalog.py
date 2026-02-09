from django.db import migrations

CATEGORIES = {
    "react-sites": {
        "name_ar": "برمجة مواقع خاصة (React/Next.js)",
        "name_en": "Custom web (React/Next.js)",
    },
    "react-native-apps": {
        "name_ar": "تطبيقات الجوال (React Native)",
        "name_en": "Mobile apps (React Native)",
    },
    "wordpress-sites": {
        "name_ar": "برمجة مواقع ووردبريس",
        "name_en": "WordPress sites",
    },
    "marketing": {
        "name_ar": "باقات التسويق",
        "name_en": "Marketing packages",
    },
}

PACKAGES = {
    "react-landing-mvp": {
        "title_ar": "باقة MVP - مواقع خاصة",
        "title_en": "MVP - Custom Site",
        "short_description_ar": "صفحة واحدة أو صفحة هبوط، React + Tailwind، أداء سريع.",
        "short_description_en": "Single landing page, React + Tailwind, fast performance.",
        "description_ar": "React + Tailwind\nأداء سريع\nمناسبة لاختبار فكرة المشروع",
        "description_en": "React + Tailwind\nFast performance\nIdeal for validating a product idea",
        "price_note": "من 4,000 ريال",
        "price_note_en": "From SAR 4,000",
        "featured": False,
        "category": "react-sites",
    },
    "react-company": {
        "title_ar": "باقة شركة - مواقع خاصة",
        "title_en": "Company site",
        "short_description_ar": "موقع متعدد الصفحات + API + لوحة تحكم خفيفة.",
        "short_description_en": "Multi-page site + API + light CMS.",
        "description_ar": "موقع متعدد الصفحات:\nReact + API\nلوحة تحكم خفيفة\nتهيئة SEO تقنية",
        "description_en": "Multi-page React site + API\nLight admin panel\nTechnical SEO setup",
        "price_note": "من 8,000 ريال",
        "price_note_en": "From SAR 8,000",
        "featured": True,
        "category": "react-sites",
    },
    "react-full-system": {
        "title_ar": "باقة نظام متكامل - مواقع خاصة",
        "title_en": "Full system",
        "short_description_ar": "واجهة React + Backend مخصص، حسابات وصلاحيات.",
        "short_description_en": "React frontend + custom backend, auth & roles.",
        "description_ar": "واجهة React + Backend مخصص:\nحسابات وصلاحيات\nلوحة تحكم متقدمة\nأساس قابل للتوسع",
        "description_en": "React frontend + custom backend\nUser accounts & roles\nAdvanced dashboard\nScalable foundation",
        "price_note": "من 15,000 ريال",
        "price_note_en": "From SAR 15,000",
        "featured": False,
        "category": "react-sites",
    },
    "rn-mvp": {
        "title_ar": "باقة MVP - تطبيقات الجوال",
        "title_en": "MVP - Mobile app",
        "short_description_ar": "تطبيق Android أو iOS، شاشات أساسية، ربط API.",
        "short_description_en": "Android or iOS app, core screens, API integration.",
        "description_ar": "تطبيق Android أو iOS:\nشاشات أساسية\nربط API\nواجهة بسيطة",
        "description_en": "Android or iOS app\nCore screens\nAPI integration\nClean UI",
        "price_note": "من 8,000 ريال",
        "price_note_en": "From SAR 8,000",
        "featured": False,
        "category": "react-native-apps",
    },
    "rn-pro": {
        "title_ar": "باقة متقدمة - تطبيقات الجوال",
        "title_en": "Advanced mobile",
        "short_description_ar": "Android + iOS، تسجيل دخول، إشعارات، أداء قوي.",
        "short_description_en": "Android + iOS, auth, push, solid performance.",
        "description_ar": "Android + iOS:\nنظام تسجيل دخول\nإشعارات\nأداء قوي",
        "description_en": "Android + iOS\nAuthentication system\nPush notifications\nSolid performance",
        "price_note": "من 15,000 ريال",
        "price_note_en": "From SAR 15,000",
        "featured": True,
        "category": "react-native-apps",
    },
    "rn-startup": {
        "title_ar": "باقة ستارت أب - تطبيقات الجوال",
        "title_en": "Startup bundle",
        "short_description_ar": "تصميم تجربة كاملة + Backend + لوحة تحكم + نشر المتاجر.",
        "short_description_en": "Full UX + backend + admin + store deployment.",
        "description_ar": "تصميم تجربة مستخدم كاملة:\nBackend متكامل\nلوحة تحكم\nالنشر على المتاجر",
        "description_en": "Full UI/UX design\nIntegrated backend\nAdmin dashboard\nApp store publishing",
        "price_note": "من 25,000 ريال",
        "price_note_en": "From SAR 25,000",
        "featured": False,
        "category": "react-native-apps",
    },
    "wp-starter": {
        "title_ar": "باقة البداية - ووردبريس",
        "title_en": "Starter WordPress",
        "short_description_ar": "موقع تعريفي حتى 5 صفحات + متجاوب + أساسيات SEO.",
        "short_description_en": "Up to 5 pages, responsive, SEO basics.",
        "description_ar": "مناسبة للشركات الصغيرة والأفراد:\nموقع تعريفي حتى 5 صفحات\nتصميم مميز باستخدام قالب مناسب\nمتجاوب مع الجوال\nلوحة تحكم سهلة\nأساسيات SEO",
        "description_en": "For small businesses:\nUp to 5 pages\nProfessional template\nMobile responsive\nEasy admin\nSEO basics",
        "price_note": "1500 – 2000 ريال",
        "price_note_en": "SAR 1,500-2,000",
        "featured": False,
        "category": "wordpress-sites",
    },
    "wp-business": {
        "title_ar": "باقة الأعمال - ووردبريس",
        "title_en": "Business WordPress",
        "short_description_ar": "موقع حتى 10 صفحات + تصميم مخصص + أمان ونسخ احتياطي.",
        "short_description_en": "Up to 10 pages, custom design, security & backups.",
        "description_ar": "للشركات والمتاجر الصغيرة:\nموقع حتى 10 صفحات\nتصميم مخصص وسرعة وأداء محسن\nإضافات أمان + نسخ احتياطي\nSEO متقدم\nدعم لغتين (عربي / إنجليزي)",
        "description_en": "For SMEs:\nUp to 10 pages\nCustom design + performance\nSecurity & backups\nAdvanced SEO\nArabic/English",
        "price_note": "3500 – 5000 ريال",
        "price_note_en": "SAR 3,500-5,000",
        "featured": True,
        "category": "wordpress-sites",
    },
    "wp-pro": {
        "title_ar": "باقة متقدمة - ووردبريس",
        "title_en": "Advanced WordPress",
        "short_description_ar": "تصميم UI/UX مخصص، صفحات غير محدودة، تكاملات، تدريب كامل.",
        "short_description_en": "Custom UI/UX, unlimited pages, integrations, training.",
        "description_ar": "للشركات المتقدمة:\nتصميم UI/UX مخصص بالكامل\nعدد صفحات غير محدود\nلوحة تحكم مخصصة\nأمان عالي وحماية\nتكامل مع أنظمة خارجية",
        "description_en": "For advanced teams:\nFully custom UI/UX\nUnlimited pages\nCustom admin\nHigh security\nThird-party integrations",
        "price_note": "يبدأ من 7,000 ريال",
        "price_note_en": "From SAR 7,000",
        "featured": False,
        "category": "wordpress-sites",
    },
    "ignite-marketing": {
        "title_ar": "باقة الإطلاق – Ignite",
        "title_en": "Ignite Package",
        "short_description_ar": "مناسبة للأفراد والشركات الناشئة لبناء حضور رقمي واضح.",
        "short_description_en": "For startups and individuals to establish a solid digital presence.",
        "description_ar": "استراتيجية محتوى أساسية\n8 منشورات + 8 تصاميم شهريًا\nإدارة منصة واحدة\nتحسين الهوية البصرية\nتقرير أداء شهري مبسّط",
        "description_en": "Basic content strategy\n8 posts + 8 designs per month\nManage 1 social platform\nVisual identity polish\nMonthly performance summary",
        "price_note": "من 1,500 ريال",
        "price_note_en": "From SAR 1,500",
        "featured": False,
        "category": "marketing",
    },
    "growth-marketing": {
        "title_ar": "باقة النمو – Growth",
        "title_en": "Growth Package",
        "short_description_ar": "مناسبة للشركات الصغيرة والمتوسطة لزيادة التفاعل وبناء جمهور.",
        "short_description_en": "For SMBs to boost engagement and build audience.",
        "description_ar": "استراتيجية تسويق شهرية\n12 منشور + 12 تصميم\nإدارة منصتين\nفيديو قصير/موشن شهريًا\nإدارة الحملات (ميزانية الإعلان غير مشمولة)\nتقرير وتحليل شهري",
        "description_en": "Monthly marketing strategy\n12 posts + 12 designs\nManage 2 platforms\n1 short video/motion monthly\nAd management (budget excluded)\nMonthly report & insights",
        "price_note": "من 3,000 ريال",
        "price_note_en": "From SAR 3,000",
        "featured": False,
        "category": "marketing",
    },
    "impact-marketing": {
        "title_ar": "باقة التأثير – Impact",
        "title_en": "Impact Package",
        "short_description_ar": "للعلامات المتوسعة لتعزيز العلامة وزيادة التحويلات.",
        "short_description_en": "For scaling brands to strengthen presence and conversions.",
        "description_ar": "استراتيجية متقدمة\nمحتوى وتصميم متقدم\nإدارة 3 منصات\n2 فيديو موشن شهريًا\nتحسين وإدارة الحملات\nتطوير Landing Page\nتقارير تفصيلية وتحسين مستمر",
        "description_en": "Advanced strategy\nFull content & advanced design\nManage 3 platforms\n2 motion videos monthly\nAd optimization\nLanding page development\nDetailed reports + continuous improvements",
        "price_note": "من 5,500 ريال",
        "price_note_en": "From SAR 5,500",
        "featured": True,
        "category": "marketing",
    },
    "authority-marketing": {
        "title_ar": "باقة السيطرة – Authority",
        "title_en": "Authority Package",
        "short_description_ar": "للشركات الكبيرة لبناء سلطة رقمية وقيادة السوق.",
        "short_description_en": "For enterprises to lead the market with strong digital authority.",
        "description_ar": "إدارة تسويق متكاملة\nفريق مخصص\nمحتوى وتصميم عالي الحجم\nفيديوهات عالية الجودة\nإدارة جميع المنصات\nحملات متعددة القنوات\nتطوير موقع/نظام مخصص\nتقارير استراتيجية واجتماعات دورية",
        "description_en": "Full marketing management\nDedicated project team\nHigh-volume content & design\nHigh-quality video production\nAll-platform management\nMulti-channel campaigns\nCustom website/system\nStrategic reports + regular meetings",
        "price_note": "من 9,000 ريال",
        "price_note_en": "From SAR 9,000",
        "featured": True,
        "category": "marketing",
    },
    "smart-custom-marketing": {
        "title_ar": "الباقة الذكية – Smart Custom",
        "title_en": "Smart Custom Package",
        "short_description_ar": "مصممة خصيصًا حسب النشاط والأهداف والميزانية.",
        "short_description_en": "Tailored to your business, goals, market, and budget.",
        "description_ar": "تحليل نشاطك وأهدافك وحجم السوق\nتصميم باقة مخصصة من المحتوى، التصميم، الإعلانات، والتطوير التقني\nمرونة تامة في البنود والحجم",
        "description_en": "Assess your business, goals, and market size\nDesign a bespoke mix of content, design, ads, and tech\nFull flexibility on scope and scale",
        "price_note": "تسعير حسب النطاق",
        "price_note_en": "Custom pricing",
        "featured": False,
        "category": "marketing",
    },
}


def restore_packages(apps, schema_editor):
    Package = apps.get_model("packages", "Package")
    PackageCategory = apps.get_model("packages", "PackageCategory")

    for slug, values in CATEGORIES.items():
        cat = PackageCategory.objects.filter(slug=slug).first()
        if cat:
            cat.name_ar = values["name_ar"]
            cat.name_en = values["name_en"]
            cat.save(update_fields=["name_ar", "name_en"])

    categories_by_slug = {c.slug: c for c in PackageCategory.objects.all()}

    for slug, values in PACKAGES.items():
        pkg = Package.objects.filter(slug=slug).first()
        if not pkg:
            continue
        pkg.title_ar = values["title_ar"]
        pkg.title_en = values["title_en"]
        pkg.short_description_ar = values["short_description_ar"]
        pkg.short_description_en = values["short_description_en"]
        pkg.description_ar = values["description_ar"]
        pkg.description_en = values["description_en"]
        pkg.price_note = values["price_note"]
        pkg.price_note_en = values["price_note_en"]
        pkg.featured = values["featured"]
        category = categories_by_slug.get(values.get("category"))
        if category:
            pkg.category = category
        pkg.save()


class Migration(migrations.Migration):
    dependencies = [
        ("packages", "0008_rewrite_package_catalog"),
    ]

    operations = [
        migrations.RunPython(restore_packages, reverse_code=migrations.RunPython.noop),
    ]
