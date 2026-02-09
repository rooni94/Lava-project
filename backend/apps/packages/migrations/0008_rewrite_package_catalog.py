from django.db import migrations

CATEGORIES = {
    "react-sites": {
        "name_ar": "منصات ويب مرنة",
        "name_en": "Custom web platforms",
    },
    "wordpress-sites": {
        "name_ar": "مواقع سريعة الإطلاق",
        "name_en": "Fast-launch sites",
    },
    "react-native-apps": {
        "name_ar": "تطبيقات الجوال",
        "name_en": "Mobile apps",
    },
    "marketing": {
        "name_ar": "النمو والتسويق",
        "name_en": "Growth & marketing",
    },
}

PACKAGES = {
    "react-landing-mvp": {
        "title_ar": "صفحة هبوط سريعة",
        "title_en": "Landing Sprint",
        "short_description_ar": "صفحة واحدة مركزة على عرضك مع نموذج تواصل سريع.",
        "short_description_en": "Single-page launch focused on your offer with fast lead capture.",
        "description_ar": "تصميم متجاوب\nبنية أقسام تسويقية واضحة\nنموذج طلب مرتبط بالبريد\nتهيئة سرعة وأساسية لمحركات البحث\nجاهزة للتوسعة لاحقاً",
        "description_en": "Responsive layout\nStructured marketing sections\nLead form connected to email\nPerformance + basic SEO setup\nReady to extend later",
        "price_note": "المدة حسب المحتوى المطلوب.",
        "price_note_en": "Timeline depends on content readiness.",
        "category": "react-sites",
    },
    "react-company": {
        "title_ar": "موقع شركة بطابع واضح",
        "title_en": "Company Presence",
        "short_description_ar": "موقع متعدد الصفحات يعرض خدماتك وأعمالك ورسالتك.",
        "short_description_en": "Multi-page site that presents services, work, and brand story.",
        "description_ar": "صفحات تعريفية كاملة\nلوحة إدارة محتوى سهلة\nنموذج تواصل + خرائط\nتهيئة أساسية للبحث\nدعم لغتين",
        "description_en": "Complete company pages\nEasy content management\nContact form + maps\nBasic SEO setup\nBilingual support",
        "price_note": "إضافات الصفحات حسب الحاجة.",
        "price_note_en": "Extra pages available on request.",
        "category": "react-sites",
    },
    "react-full-system": {
        "title_ar": "منصة ويب متكاملة",
        "title_en": "Web Platform",
        "short_description_ar": "تجربة ويب كاملة مع لوحات تحكم وتكاملات.",
        "short_description_en": "Full web experience with dashboards and integrations.",
        "description_ar": "واجهة عامة + لوحة تحكم\nأدوار وصلاحيات\nتقارير ولوحات مؤشرات\nتكاملات الدفع والبريد والإشعارات\nقابلية توسع لاحقة",
        "description_en": "Public site + admin dashboard\nRoles and permissions\nReports and KPI views\nPayments, email, and notification integrations\nBuilt to scale",
        "price_note": "النطاق يحدد بدقة بعد جلسة قصيرة.",
        "price_note_en": "Scope is refined after a short discovery call.",
        "category": "react-sites",
    },
    "wp-starter": {
        "title_ar": "موقع إطلاق سريع",
        "title_en": "Quick Start Site",
        "short_description_ar": "موقع بسيط يتم تجهيزه بسرعة مع الصفحات الأساسية.",
        "short_description_en": "Simple site launched quickly with core pages.",
        "description_ar": "قالب جاهز مخصص\nحتى 5 صفحات\nنموذج تواصل\nربط تحليلات\nتدريب بسيط على الإدارة",
        "description_en": "Customized ready template\nUp to 5 pages\nContact form\nAnalytics setup\nQuick admin training",
        "price_note": "يناسب المشاريع الناشئة.",
        "price_note_en": "Best fit for early-stage teams.",
        "category": "wordpress-sites",
    },
    "wp-business": {
        "title_ar": "موقع أعمال قابل للتوسع",
        "title_en": "Business Site",
        "short_description_ar": "موقع أكبر مع صفحات متعددة وإدارة محتوى مرنة.",
        "short_description_en": "Bigger site with flexible content management.",
        "description_ar": "تصميم مخصص على ووردبريس\nحتى 10 صفحات\nأقسام خدمات وأعمال\nتحسينات أداء وأمان\nدعم لغتين",
        "description_en": "Custom WordPress design\nUp to 10 pages\nServices + portfolio sections\nPerformance and security tuning\nBilingual support",
        "price_note": "يتضمن إعدادات أمان أساسية.",
        "price_note_en": "Includes baseline security setup.",
        "category": "wordpress-sites",
    },
    "wp-pro": {
        "title_ar": "واجهة محتوى متقدمة",
        "title_en": "Content Hub",
        "short_description_ar": "موقع غني بالمحتوى مع تنظيم للأقسام والمقالات.",
        "short_description_en": "Content-first site with structured sections and blog.",
        "description_ar": "تخطيط محتوى متقدم\nمدونة وأقسام تصنيف\nتحسين بحث داخلي\nضغط صور وتحسين أداء\nنسخ احتياطي أساسي",
        "description_en": "Advanced content layout\nBlog with categories\nImproved internal search\nImage optimization + performance\nBasic backups",
        "price_note": "مناسب للمنصات الإعلامية والشركات.",
        "price_note_en": "Great for editorial and knowledge sites.",
        "category": "wordpress-sites",
    },
    "rn-mvp": {
        "title_ar": "نسخة أولى للجوال",
        "title_en": "Mobile MVP",
        "short_description_ar": "إطلاق سريع لفكرة التطبيق بأقل مجموعة مزايا.",
        "short_description_en": "Fast first release to validate the app idea.",
        "description_ar": "واجهات أساسية\nتسجيل ودخول\nربط API\nإشعارات أولية\nإرشادات رفع المتاجر",
        "description_en": "Core screens\nAuth flow\nAPI integration\nBasic notifications\nStore submission guidance",
        "price_note": "الميزات الإضافية تُسعّر حسب الحاجة.",
        "price_note_en": "Extra features are scoped separately.",
        "category": "react-native-apps",
    },
    "rn-pro": {
        "title_ar": "تطبيق جاهز للإطلاق",
        "title_en": "Launch-Ready App",
        "short_description_ar": "تجربة كاملة للمستخدم مع تتبع أداء وتحليلات.",
        "short_description_en": "Complete user flow with performance tracking.",
        "description_ar": "تصميم تجربة مستخدم كاملة\nملفات مستخدم ومحتوى ديناميكي\nإشعارات مخصصة\nتحليلات استخدام\nدعم متجرين",
        "description_en": "Full UX flow\nUser profiles and dynamic content\nCustom notifications\nUsage analytics\nBoth app stores",
        "price_note": "يشمل جلسة تدريب عند الإطلاق.",
        "price_note_en": "Includes a launch handover session.",
        "category": "react-native-apps",
    },
    "rn-startup": {
        "title_ar": "تطبيق نمو متكامل",
        "title_en": "Scale App",
        "short_description_ar": "تطبيق جوال مع لوحة تحكم وتكاملات نمو.",
        "short_description_en": "Mobile app plus admin tools and growth integrations.",
        "description_ar": "تطبيق + لوحة تحكم إدارة\nأدوار وصلاحيات\nتكاملات دفع/خرائط/رسائل\nخطة إصدارات مستقبلية\nقابلية توسع",
        "description_en": "App + admin dashboard\nRoles and permissions\nPayments, maps, messaging integrations\nRelease roadmap\nScalable architecture",
        "price_note": "يتطلب جلسة تحديد نطاق أولية.",
        "price_note_en": "Requires a discovery session to lock scope.",
        "category": "react-native-apps",
    },
    "ignite-marketing": {
        "title_ar": "إشعال الظهور",
        "title_en": "Launch Signal",
        "short_description_ar": "بداية منظمة للحملات والإعلانات مع ضبط الأساسيات.",
        "short_description_en": "Starter plan for ads and visibility with the essentials set up.",
        "description_ar": "بحث سريع للكلمات والجمهور\nإعداد الحملات الإعلانية\nصفحة هبوط بسيطة\nتقارير أسبوعية\nتحسينات خفيفة مستمرة",
        "description_en": "Keyword + audience quick research\nAd campaign setup\nSimple landing page\nWeekly reporting\nLight ongoing optimizations",
        "price_note": "لا تشمل الميزانية الإعلانية.",
        "price_note_en": "Ad spend not included.",
        "category": "marketing",
    },
    "growth-marketing": {
        "title_ar": "تسارع النمو",
        "title_en": "Growth Pulse",
        "short_description_ar": "حملات منظمة + محتوى موجه لزيادة الطلب.",
        "short_description_en": "Structured campaigns with content focused on demand.",
        "description_ar": "استراتيجية محتوى شهرية\nإدارة حملات إعلانية\nتحسين صفحات التحويل\nلوحات قياس الأداء\nجلسات مراجعة دورية",
        "description_en": "Monthly content plan\nAd campaign management\nConversion page optimization\nPerformance dashboards\nRegular review sessions",
        "price_note": "أفضل عند توفر مواد تسويقية أساسية.",
        "price_note_en": "Works best with baseline marketing assets.",
        "category": "marketing",
    },
    "impact-marketing": {
        "title_ar": "أثر واضح",
        "title_en": "Impact Wave",
        "short_description_ar": "تركيز على النتائج مع تجارب وتحسينات أسبوعية.",
        "short_description_en": "Optimization-heavy plan to raise measurable results.",
        "description_ar": "اختبارات A/B\nتحسين القنوات الإعلانية\nإعادة استهداف\nتقارير تفصيلية\nتحسين الرسائل التسويقية",
        "description_en": "A/B testing\nChannel optimization\nRetargeting\nDetailed reporting\nMessaging improvements",
        "price_note": "يتطلب بيانات أولية لقياس الأداء.",
        "price_note_en": "Requires baseline data for measurement.",
        "category": "marketing",
    },
    "authority-marketing": {
        "title_ar": "حضور موثوق",
        "title_en": "Authority Presence",
        "short_description_ar": "بناء الثقة عبر محتوى وأفكار قيادية.",
        "short_description_en": "Thought leadership and trust-building content.",
        "description_ar": "استراتيجية محتوى قيادي\nإدارة قنوات التواصل\nحملات علاقات عامة\nصفحات هبوط للحملات\nتقارير شهرية",
        "description_en": "Thought leadership content plan\nSocial channel management\nPR campaigns\nCampaign landing pages\nMonthly reports",
        "price_note": "مناسب للعلامات التي تبني سمعة طويلة.",
        "price_note_en": "Ideal for brands building long-term credibility.",
        "category": "marketing",
    },
    "smart-custom-marketing": {
        "title_ar": "خطة نمو حسب الطلب",
        "title_en": "Custom Growth Plan",
        "short_description_ar": "خطة مفصلة مبنية على أهدافك وقنواتك.",
        "short_description_en": "Tailored plan built around your goals and channels.",
        "description_ar": "ورشة تحديد الأهداف\nتوزيع الميزانية على القنوات\nخطة محتوى وإعلانات مخصصة\nتحسين أسبوعي\nمدير حساب مخصص",
        "description_en": "Goal-setting workshop\nChannel budget allocation\nCustom content + ads plan\nWeekly optimization\nDedicated account manager",
        "price_note": "يتم التسعير بعد تحديد النطاق.",
        "price_note_en": "Pricing after scope definition.",
        "category": "marketing",
    },
}


def rewrite_packages(apps, schema_editor):
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
        category = categories_by_slug.get(values.get("category"))
        if category:
            pkg.category = category
        pkg.save()


class Migration(migrations.Migration):
    dependencies = [
        ("packages", "0007_set_package_currency_sar"),
    ]

    operations = [
        migrations.RunPython(rewrite_packages, reverse_code=migrations.RunPython.noop),
    ]
