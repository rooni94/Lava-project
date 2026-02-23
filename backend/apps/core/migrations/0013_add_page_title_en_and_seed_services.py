from django.db import migrations, models


def seed_services_page(apps, schema_editor):
    Page = apps.get_model("core", "Page")
    Section = apps.get_model("core", "Section")

    page, _ = Page.objects.get_or_create(
        slug="services",
        defaults={
            "name": "خدمات",
            "title": "خدمات LAVA",
            "title_en": "LAVA Services",
            "meta_description": "حلول متكاملة تجمع تطوير البرمجيات والتسويق الرقمي ضمن فريق واحد.",
            "meta_description_en": "Integrated software and digital marketing services delivered by one coordinated team.",
            "status": "published",
        },
    )

    if not page.title_en:
        page.title_en = "LAVA Services"
        page.meta_description_en = "Integrated software and digital marketing services delivered by one coordinated team."
        page.save()

    sections_data = [
        {
            "title": "قسم الهيرو",
            "title_en": "Hero Section",
            "content": "هندسة برمجيات + تسويق أداء في منظومة واحدة",
            "extra": {
                "title_en": "Software engineering + performance marketing in one system",
                "subtitle_ar": "نصمم المنتجات ونبنيها ونسوقها ضمن فريق واحد، لذلك لا يوجد تعارض بين الإطلاق التقني والأهداف التسويقية.",
                "subtitle_en": "We design, build, and scale products with one integrated team so technical launches and growth goals move together.",
                "badge_ar": "مسارين في نظام واحد",
                "badge_en": "Dual-track execution",
            },
            "section_type": "hero",
            "order": 0,
        },
        {
            "title": "المرحلة 1: استكشاف",
            "title_en": "Step 1: Discovery",
            "content": "تحليل الهدف التجاري واحتياج المستخدم والنطاق الفني.",
            "extra": {
                "content_en": "Analyze business goals, user needs, and technical constraints.",
                "step_number": 1,
            },
            "section_type": "process_step",
            "order": 1,
        },
        {
            "title": "المرحلة 2: تصميم الحل",
            "title_en": "Step 2: Solution design",
            "content": "بناء تصور المنتج والرسالة التسويقية في مسار موحد.",
            "extra": {
                "content_en": "Shape product direction and campaign narrative as one system.",
                "step_number": 2,
            },
            "section_type": "process_step",
            "order": 2,
        },
        {
            "title": "المرحلة 3: التنفيذ",
            "title_en": "Step 3: Build",
            "content": "تطوير + إنتاج + حملات بإيقاع أسبوعي واضح.",
            "extra": {
                "content_en": "Ship engineering, production, and campaigns in weekly cycles.",
                "step_number": 3,
            },
            "section_type": "process_step",
            "order": 3,
        },
        {
            "title": "المرحلة 4: التحسين",
            "title_en": "Step 4: Optimize",
            "content": "قراءة النتائج وتحسين التجربة والعائد بشكل مستمر.",
            "extra": {
                "content_en": "Use real performance data to refine both product and growth.",
                "step_number": 4,
            },
            "section_type": "process_step",
            "order": 4,
        },
        {
            "title": "خدمات التطوير البرمجي",
            "title_en": "Software development services",
            "content": "منصات ويب وتطبيقات وأنظمة أعمال مبنية للاستقرار والتوسع.",
            "extra": {
                "content_en": "Web platforms, apps, and business systems built for long-term scale.",
            },
            "section_type": "section_title",
            "order": 10,
        },
        {
            "title": "خدمات التسويق الرقمي",
            "title_en": "Digital marketing services",
            "content": "محتوى وإنتاج مرئي وحملات أداء مرتبطة ببيانات حقيقية.",
            "extra": {
                "content_en": "Content, production, and performance campaigns tied to measurable outcomes.",
            },
            "section_type": "section_title",
            "order": 20,
        },
    ]

    for section_data in sections_data:
        Section.objects.get_or_create(
            page=page,
            section_type=section_data["section_type"],
            order=section_data["order"],
            defaults={
                "title": section_data["title"],
                "content": section_data["content"],
                "extra": section_data["extra"],
            },
        )


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0012_update_domain_references_to_lava_sa"),
    ]

    operations = [
        migrations.AddField(
            model_name="page",
            name="title_en",
            field=models.CharField(blank=True, max_length=200, verbose_name="العنوان بالإنجليزية"),
        ),
        migrations.AddField(
            model_name="page",
            name="meta_description_en",
            field=models.TextField(blank=True, verbose_name="وصف ميتا بالإنجليزية"),
        ),
        migrations.RunPython(seed_services_page, migrations.RunPython.noop),
    ]
