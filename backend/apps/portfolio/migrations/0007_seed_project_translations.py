from django.db import migrations


def seed_project_translations(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")

    translations = {
        "منصة التعليم الإلكتروني معرفة": {
            "title_en": "Maaref eLearning Platform",
            "description_en": "An LMS serving 50,000 learners with virtual classrooms.",
            "summary_en": "A scalable e-learning platform built for large cohorts.",
            "client_en": "Maaref",
        },
        "تطبيق توصيل سريع": {
            "title_en": "Saree Delivery App",
            "description_en": "Optimized delivery routes and boosted sales by 40%.",
            "client_en": "Saree",
        },
        "Sefir Trading | إنتاج وتحميص وبيع المكسرات الفاخرة": {
            "title_en": "Sefir Trading | Premium Nuts Production & Roasting",
            "description_en": "A full WordPress site showcasing premium nuts, roasting steps, and quality standards with direct inquiries.",
            "summary_en": "A product showcase platform highlighting quality and roasting expertise with an easy contact journey.",
            "goals_en": "Showcase products, tell the roasting process and standards, and streamline order inquiries.",
            "challenges_en": "Communicating the food brand identity visually while keeping categories clear and communication simple.",
            "solution_en": "Custom responsive WordPress theme with product sections, quality standards, and a protected contact form.",
            "results_en": "A user-friendly site that elevated product quality perception and strengthened brand trust.",
        },
        "VibesMillions | منصة حجز تذاكر رياضية": {
            "title_en": "VibesMillions | Sports Ticket Booking Platform",
            "description_en": "A WordPress site for selling sports event tickets with countdowns and a smooth purchase flow.",
            "summary_en": "A modern storefront for discovering and buying sports tickets with dynamic content management.",
            "goals_en": "Simplify event discovery, enable secure checkout, and increase pre-event engagement.",
            "challenges_en": "A unified web/mobile experience with interactive elements and fast performance.",
            "solution_en": "Custom theme with countdown timers, WooCommerce payments, and speed optimizations.",
            "results_en": "A professional platform that supports the full journey from discovery to purchase.",
        },
        "منصة إدارة ابتكار الأغذية | كسر كونسبت": {
            "title_en": "Food Innovation Management Platform | Kasr Concept",
            "description_en": "WordPress + Elementor Pro platform with online payments that lifted engagement by 40%.",
            "summary_en": "A flexible admin dashboard to manage products and payments in the food sector.",
            "goals_en": "Improve user experience and streamline electronic payments.",
            "challenges_en": "Integrating payments while maintaining performance and editing flexibility.",
            "solution_en": "Custom Elementor Pro design, payment integration, and optimized user flow.",
            "results_en": "40% higher engagement thanks to easier payments and content management.",
        },
        "صفحات هبوط جامعات (آيدن/يني يوزيل) | المستقبل للاستشارات": {
            "title_en": "University Landing Pages (Aydin / Yeni Yuzil) | Al-Mostaqbal Consulting",
            "description_en": "A set of multi-section interactive landing pages for university admissions.",
            "summary_en": "Modern pages presenting majors, fees, and interactive forms.",
            "goals_en": "Make university discovery and application easier with advanced forms and CRM integration.",
            "challenges_en": "Structuring large program data with a fast, responsive experience.",
            "solution_en": "Bootstrap + JS interactive cards, galleries, FAQs, and CRM integration.",
            "results_en": "Professional Arabic landing pages that simplified admissions and improved conversions.",
        },
        "ContractApp | مولّد مستندات آلي بـ JavaFX": {
            "title_en": "ContractApp | Automated Document Generator (JavaFX)",
            "description_en": "Desktop app that generates visa, ID, and contract documents from a single form.",
            "summary_en": "Automated creation of three Word documents using Spire.Doc and dynamic placeholders.",
            "goals_en": "Capture contract data once and generate print-ready documents.",
            "challenges_en": "Managing Word templates and placeholders across environments.",
            "solution_en": "JavaFX UI, relative paths, and Spire.Doc placeholder replacement.",
            "results_en": "Faster contract generation with fewer errors via a simple desktop interface.",
        },
        "T-Movers.de | موقع حجز نقل أثاث بألمانيا": {
            "title_en": "T-Movers.de | Furniture Moving Booking Site (Germany)",
            "description_en": "Responsive site with an advanced booking form, performance improvements, and SEO.",
            "summary_en": "More bookings through form integration and speed optimization.",
            "goals_en": "Increase online bookings, improve organic ranking, and enhance UX.",
            "challenges_en": "Smooth booking with high performance and precise analytics.",
            "solution_en": "Elementor Pro booking flow, performance & analytics tuning, and SEO strategy.",
            "results_en": "40% booking growth, 35% organic traffic increase, and 50% higher engagement.",
        },
    }

    for ar_title, data in translations.items():
        for project in Project.objects.filter(title=ar_title):
            update_fields = []
            for field, value in data.items():
                if not getattr(project, field, ""):
                    setattr(project, field, value)
                    update_fields.append(field)
            if update_fields:
                project.save(update_fields=update_fields)


def unseed_project_translations(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")
    Project.objects.update(
        title_en="",
        description_en="",
        summary_en="",
        goals_en="",
        challenges_en="",
        solution_en="",
        results_en="",
        scope_en="",
        duration_en="",
        team_size_en="",
        budget_en="",
        client_en="",
    )


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0006_add_project_translations"),
    ]

    operations = [
        migrations.RunPython(seed_project_translations, unseed_project_translations),
    ]
