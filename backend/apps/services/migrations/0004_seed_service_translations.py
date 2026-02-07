from django.db import migrations


def seed_service_translations(apps, schema_editor):
    Service = apps.get_model("services", "Service")

    translations = {
        "تطوير تطبيقات الويب المتقدمة": {
            "title_en": "Advanced web app development",
            "description_en": "Fast, secure, and scalable web apps built with modern stacks like React and Django.",
            "features_en": [
                "Single-page applications",
                "Interactive interfaces",
                "Payment integrations",
                "Performance optimization",
            ],
        },
        "تطوير تطبيقات الجوال": {
            "title_en": "Mobile app development",
            "description_en": "iOS and Android apps built with React Native or Flutter.",
            "features_en": [
                "Hybrid or native builds",
                "Custom user experience",
                "App store publishing",
                "Ongoing maintenance",
            ],
        },
        "حلول المؤسسات ERP/CRM": {
            "title_en": "ERP/CRM enterprise solutions",
            "description_en": "Integrated systems for managing resources, operations, and customer data.",
            "features_en": [
                "Reports and dashboards",
                "Integration with existing systems",
            ],
        },
        "الاستشارات التقنية": {
            "title_en": "Technical consulting",
            "description_en": "Feasibility studies, infrastructure planning, and technology strategy.",
            "features_en": [
                "Requirements analysis",
                "Technical recommendations",
                "Audit of existing systems",
            ],
        },
        "الأمن السيبراني": {
            "title_en": "Cybersecurity",
            "description_en": "Protect applications and data with clear response plans.",
            "features_en": [
                "Vulnerability assessment",
                "Continuous monitoring",
                "Team training",
            ],
        },
        "الذكاء الاصطناعي وتحليل البيانات": {
            "title_en": "AI & data analytics",
            "description_en": "Predictive models, chatbots, and interactive insights.",
            "features_en": [
                "Big data analysis",
                "Predictive models",
                "Interactive dashboards",
            ],
        },
        "التعهيد التقني": {
            "title_en": "Technical outsourcing",
            "description_en": "Dedicated technical teams that work as an extension of yours.",
            "features_en": [
                "Specialized engineers",
                "Project management",
                "Flexible engagement",
            ],
        },
    }

    for ar_title, data in translations.items():
        for svc in Service.objects.filter(title=ar_title):
            update_fields = []
            if not svc.title_en:
                svc.title_en = data["title_en"]
                update_fields.append("title_en")
            if not svc.description_en:
                svc.description_en = data["description_en"]
                update_fields.append("description_en")
            if not svc.features_en:
                svc.features_en = data["features_en"]
                update_fields.append("features_en")
            if update_fields:
                svc.save(update_fields=update_fields)


def unseed_service_translations(apps, schema_editor):
    Service = apps.get_model("services", "Service")
    Service.objects.filter(title_en__isnull=False).update(
        title_en="",
        description_en="",
        features_en=[],
    )


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0003_add_service_translations"),
    ]

    operations = [
        migrations.RunPython(seed_service_translations, unseed_service_translations),
    ]
