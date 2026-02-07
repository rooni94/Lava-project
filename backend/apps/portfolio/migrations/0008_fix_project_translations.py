from __future__ import annotations

from django.db import migrations


def fix_project_translations(apps, schema_editor):
    Project = apps.get_model("portfolio", "Project")

    updates = {
        "Sefir Trading | إنتاج وتحميص وبيع المكسرات الفاخرة": {
            "title_en": ("Sefir Trading | Premium Nuts Production & Roasting", "Sefir Trading | Premium Nuts Production, Roasting & Sales"),
            "description_en": (
                "A full WordPress site showcasing premium nuts, roasting steps, and quality standards with direct inquiries.",
                "A WordPress site showcasing premium nuts, roasting steps, and sales inquiries.",
            ),
            "summary_en": (
                "A product showcase platform highlighting quality and roasting expertise with an easy contact journey.",
                "A product showcase platform highlighting quality and roasting expertise with a streamlined inquiry flow.",
            ),
            "goals_en": (
                "Showcase products, tell the roasting process and standards, and streamline order inquiries.",
                "Showcase products, present roasting standards, and streamline sales inquiries.",
            ),
            "challenges_en": (
                "Communicating the food brand identity visually while keeping categories clear and communication simple.",
                "Communicating a premium food brand visually while keeping categories clear and inquiries simple.",
            ),
            "solution_en": (
                "Custom responsive WordPress theme with product sections, quality standards, and a protected contact form.",
                "Custom responsive WordPress theme with product sections, quality standards, and protected inquiry forms.",
            ),
            "results_en": (
                "A user-friendly site that elevated product quality perception and strengthened brand trust.",
                "A user-friendly site that elevated perceived quality and strengthened brand trust.",
            ),
        },
        "VibesMillions | منصة حجز تذاكر رياضية": {
            "description_en": (
                "A WordPress site for selling sports event tickets with countdowns and a smooth purchase flow.",
                "A WordPress site for selling sports tickets with countdowns and a smooth purchase flow.",
            ),
        },
        "منصة إدارة ابتكار الأغذية | كسر كونسبت": {
            "description_en": (
                "WordPress + Elementor Pro platform with online payments that lifted engagement by 40%.",
                "WordPress + Elementor Pro platform with online payments that increased engagement by 40%.",
            ),
        },
        "صفحات هبوط جامعات (آيدن/يني يوزيل) | المستقبل للاستشارات": {
            "description_en": (
                "A set of multi-section interactive landing pages for university admissions.",
                "A set of multi-section landing pages for university admissions.",
            ),
        },
        "ContractApp | مولّد مستندات آلي بـ JavaFX": {
            "description_en": (
                "Desktop app that generates visa, ID, and contract documents from a single form.",
                "Desktop app that generates visa, ID, and contract documents from one form.",
            ),
        },
        "T-Movers.de | موقع حجز نقل أثاث بألمانيا": {
            "description_en": (
                "Responsive site with an advanced booking form, performance improvements, and SEO.",
                "Responsive site with an advanced booking form, performance optimization, and SEO.",
            ),
        },
    }

    for ar_title, fields in updates.items():
        for project in Project.objects.filter(title=ar_title):
            update_fields = []
            for field, (old_value, new_value) in fields.items():
                current = getattr(project, field, "")
                if current in ("", None) or current == old_value:
                    setattr(project, field, new_value)
                    update_fields.append(field)
            if update_fields:
                project.save(update_fields=update_fields)


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0007_seed_project_translations"),
    ]

    operations = [
        migrations.RunPython(fix_project_translations, reverse_code=migrations.RunPython.noop),
    ]
