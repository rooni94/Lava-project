from __future__ import annotations

from django.db import migrations


def fix_service_translations(apps, schema_editor):
    Service = apps.get_model("services", "Service")

    updates = {
        "تطوير تطبيقات الويب المتقدمة": {
            "title_en": ("Advanced web app development", "Advanced web application development"),
            "description_en": (
                [
                    "Fast, secure, and scalable web apps built with modern stacks like React and Django.",
                    "Fast, secure, and scalable web apps built with React and Django.",
                ],
                "Fast, secure, and scalable web applications built with React and Django.",
            ),
            "features_en": (
                ["Single-page applications", "Interactive interfaces", "Payment integrations", "Performance optimization"],
                ["Single-page web apps", "Interactive interfaces", "Payment integrations", "Performance optimization"],
            ),
        },
        "تطوير تطبيقات الجوال": {
            "title_en": ("Mobile app development", "Mobile application development"),
            "description_en": (
                "iOS and Android apps built with React Native or Flutter.",
                "iOS and Android apps built with React Native or Flutter.",
            ),
            "features_en": (
                ["Hybrid or native builds", "Custom user experience", "App store publishing", "Ongoing maintenance"],
                ["Hybrid or native builds", "Custom user experience", "App Store publishing", "Ongoing maintenance"],
            ),
        },
        "حلول المؤسسات ERP/CRM": {
            "title_en": ("ERP/CRM enterprise solutions", "Enterprise ERP/CRM solutions"),
            "description_en": (
                [
                    "Integrated systems for managing resources, operations, and customer data.",
                    "Integrated systems for managing resources and customers.",
                ],
                "Integrated systems to manage operations, resources, and customer data.",
            ),
            "features_en": (
                ["Reports and dashboards", "Integration with existing systems"],
                ["Reports and dashboards", "Integration with existing systems"],
            ),
        },
        "الاستشارات التقنية": {
            "title_en": ("Technical consulting", "Technology consulting"),
            "description_en": (
                "Feasibility studies, infrastructure planning, and technology strategy.",
                "Feasibility studies, architecture planning, and technology strategy.",
            ),
            "features_en": (
                ["Requirements analysis", "Technical recommendations", "Audit of existing systems"],
                ["Requirements analysis", "Technical recommendations", "Audit of existing systems"],
            ),
        },
        "الأمن السيبراني": {
            "title_en": ("Cybersecurity", "Cybersecurity"),
            "description_en": (
                [
                    "Protect applications and data with clear response plans.",
                    "Protect applications and data with incident response plans.",
                ],
                "Protect applications and data with prevention, monitoring, and incident response.",
            ),
            "features_en": (
                ["Vulnerability assessment", "Continuous monitoring", "Team training"],
                ["Vulnerability assessment", "Continuous monitoring", "Team training"],
            ),
        },
        "الذكاء الاصطناعي وتحليل البيانات": {
            "title_en": ("AI & data analytics", "AI & data analytics"),
            "description_en": (
                [
                    "Predictive models, chatbots, and interactive insights.",
                    "Predictive models, chatbots, and interactive dashboards.",
                ],
                "Predictive models, chatbots, and insight dashboards.",
            ),
            "features_en": (
                ["Big data analysis", "Predictive models", "Interactive dashboards"],
                ["Big data analysis", "Predictive models", "Interactive dashboards"],
            ),
        },
        "التعهيد التقني": {
            "title_en": ("Technical outsourcing", "Technical outsourcing"),
            "description_en": (
                "Dedicated technical teams that work as an extension of yours.",
                "Dedicated engineering teams that work as an extension of yours.",
            ),
            "features_en": (
                ["Specialized engineers", "Project management", "Flexible engagement"],
                ["Specialized engineers", "Project management", "Flexible engagement"],
            ),
        },
    }

    for ar_title, fields in updates.items():
        for svc in Service.objects.filter(title=ar_title):
            update_fields = []
            for field, (old_value, new_value) in fields.items():
                current = getattr(svc, field, "")
                match_old = current == old_value
                if isinstance(old_value, (list, tuple, set)):
                    match_old = current in old_value
                if current in ("", None) or match_old:
                    setattr(svc, field, new_value)
                    update_fields.append(field)
            if update_fields:
                svc.save(update_fields=update_fields)


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0004_seed_service_translations"),
    ]

    operations = [
        migrations.RunPython(fix_service_translations, reverse_code=migrations.RunPython.noop),
    ]
