from django.db import migrations
from django.utils import timezone


def seed_projects(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    Technology = apps.get_model("portfolio", "Technology")

    showcase = [
        {
            "title": "Sefir Trading | إنتاج وتحميص وبيع المكسرات الفاخرة",
            "description": "موقع ووردبريس متكامل يعرض منتجات المكسرات وخطوات التحميص والجودة مع تواصل مباشر.",
            "summary": "منصة لعرض منتجات Sefir Trading مع إبراز الجودة والتحميص، وتجربة تواصل سهلة.",
            "goals": "عرض المنتجات، سرد عملية التحميص والمعايير، وتسهيل استفسارات الطلبات.",
            "challenges": "إبراز الهوية الغذائية بصريًا مع وضوح الفئات وتبسيط التواصل.",
            "solution": "قالب مخصص متجاوب، أقسام منتجات ومعايير الجودة، ونموذج تواصل محمي.",
            "results": "موقع سهل الاستخدام أبرز جودة المكسرات وزاد موثوقية العلامة لدى العملاء.",
            "category": "web",
            "technologies": ["WordPress", "Elementor", "SEO"],
        },
        {
            "title": "VibesMillions | منصة حجز تذاكر رياضية",
            "description": "موقع ووردبريس لبيع تذاكر الفعاليات الرياضية مع عدّ تنازلي وتجربة شراء سلسة.",
            "summary": "واجهة عصرية لعرض وبيع تذاكر الرياضة، مع إدارة محتوى ديناميكية.",
            "goals": "تيسير اكتشاف الفعاليات، الشراء الآمن، وزيادة التفاعل قبل المباريات.",
            "challenges": "تجربة موحدة للهاتف والويب مع عناصر تفاعلية وأداء سريع.",
            "solution": "قالب مخصص، مؤقّتات عد تنازلي، WooCommerce/بوابات دفع، وتحسين سرعة.",
            "results": "منصة احترافية دعمت رحلة المستخدم من الاكتشاف حتى شراء التذكرة بسهولة.",
            "category": "web",
            "technologies": ["WordPress", "WooCommerce", "JavaScript"],
        },
        {
            "title": "منصة إدارة ابتكار الأغذية | كسر كونسبت",
            "description": "منصة WordPress + Elementor Pro مع مدفوعات إلكترونية لرفع التفاعل 40٪.",
            "summary": "لوحة تحكم مرنة لإدارة المنتجات والمدفوعات في قطاع الأغذية.",
            "goals": "تحسين تجربة المستخدم وتبسيط المعاملات عبر الدفع الإلكتروني.",
            "challenges": "دمج المدفوعات مع الحفاظ على الأداء والمرونة التحريرية.",
            "solution": "تصميم Elementor Pro مخصص، تكامل دفع، وتحسين تدفق المستخدم.",
            "results": "زيادة التفاعل 40٪ بفضل سهولة الدفع وإدارة المحتوى.",
            "category": "web",
            "technologies": ["WordPress", "Elementor Pro", "Payments"],
        },
        {
            "title": "صفحات هبوط جامعات (آيدن/يني يوزيل) | المستقبل للاستشارات",
            "description": "مجموعة صفحات هبوط تفاعلية متعددة الأقسام للقبولات الجامعية.",
            "summary": "تصميم عصري بألوان مؤسسية يعرض التخصصات والرسوم والنماذج التفاعلية.",
            "goals": "تسهيل استكشاف الجامعات والتقديم عبر نماذج متقدمة وتكامل CRM.",
            "challenges": "تنظيم بيانات كثيرة (تخصصات/رسوم) مع تجربة سريعة ومتجاوبة.",
            "solution": "Bootstrap + JS لبطاقات تفاعلية، معارض، أسئلة شائعة، وتكامل CRM.",
            "results": "صفحات عربية احترافية بسير قبول مبسط وزيادة تحويلات الطلاب المحتملين.",
            "category": "web",
            "technologies": ["HTML5", "CSS3", "Bootstrap", "JavaScript"],
        },
        {
            "title": "ContractApp | مولّد مستندات آلي بـ JavaFX",
            "description": "تطبيق سطح مكتب ينشئ مستندات تأشيرة وهوية وعقد من نموذج واحد.",
            "summary": "أتمتة إنشاء 3 ملفات Word باستخدام Spire.Doc وعلامات مرجعية.",
            "goals": "تجميع بيانات العقد مرة واحدة وإخراج مستندات جاهزة للطباعة.",
            "challenges": "إدارة قوالب Word وعلاماتها مع تشغيل متعدد البيئات.",
            "solution": "JavaFX واجهة كاملة، مسارات نسبية، Spire.Doc لاستبدال العلامات.",
            "results": "تسريع إنشاء العقود وتقليل الأخطاء بواجهة بسيطة دون FXML.",
            "category": "other",
            "technologies": ["Java", "JavaFX", "Spire.Doc"],
        },
        {
            "title": "T-Movers.de | موقع حجز نقل أثاث بألمانيا",
            "description": "موقع متجاوب مع نظام حجز متقدم وتحسينات سرعة وSEO.",
            "summary": "زيادة الحجوزات عبر دمج نموذج حجز وتحسين الأداء.",
            "goals": "رفع الحجوزات أونلاين وتحسين الترتيب العضوي وتجربة المستخدم.",
            "challenges": "حجز سلس مع أداء مرتفع وتقارير تحليلات دقيقة.",
            "solution": "Elementor Pro للحجز، تحسين سرعة/تحليلات، إستراتيجيات SEO.",
            "results": "زيادة الحجوزات 40٪، نمو الزيارات العضوية 35٪، وتحسن التفاعل 50٪.",
            "category": "web",
            "technologies": ["WordPress", "Elementor Pro", "Analytics", "SEO"],
        },
    ]

    for item in showcase:
        tech_objs = []
        for tech in item.pop("technologies", []):
            obj, _ = Technology.objects.get_or_create(name=tech, defaults={"slug": tech.lower().replace(" ", "-")})
            tech_objs.append(obj)

        project, created = Project.objects.get_or_create(
            title=item["title"],
            defaults={
                "description": item["description"],
                "summary": item["summary"],
                "goals": item["goals"],
                "challenges": item["challenges"],
                "solution": item["solution"],
                "results": item["results"],
                "category": item["category"],
                "status": "done",
            },
        )
        if created and tech_objs:
            project.technologies.set(tech_objs)


def unseed_projects(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    titles = [
        "Sefir Trading | إنتاج وتحميص وبيع المكسرات الفاخرة",
        "VibesMillions | منصة حجز تذاكر رياضية",
        "منصة إدارة ابتكار الأغذية | كسر كونسبت",
        "صفحات هبوط جامعات (آيدن/يني يوزيل) | المستقبل للاستشارات",
        "ContractApp | مولّد مستندات آلي بـ JavaFX",
        "T-Movers.de | موقع حجز نقل أثاث بألمانيا",
    ]
    Project.objects.filter(title__in=titles).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0004_alter_project_options_alter_projectimage_options_and_more"),
    ]

    operations = [
        migrations.RunPython(seed_projects, unseed_projects),
    ]
