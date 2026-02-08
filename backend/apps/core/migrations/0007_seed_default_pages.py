from django.db import migrations


DEFAULT_PAGES = [
    {"slug": "home", "name": "الرئيسية", "title": "الرئيسية"},
    {"slug": "about", "name": "من نحن", "title": "من نحن"},
    {"slug": "services", "name": "الخدمات", "title": "الخدمات"},
    {"slug": "packages", "name": "الباقات", "title": "الباقات"},
    {"slug": "portfolio", "name": "الأعمال", "title": "الأعمال"},
    {"slug": "blog", "name": "المدونة", "title": "المدونة"},
    {"slug": "careers", "name": "الوظائف", "title": "الوظائف"},
    {"slug": "contact", "name": "تواصل معنا", "title": "تواصل معنا"},
]


def seed_pages(apps, schema_editor):
    Page = apps.get_model("core", "Page")
    for item in DEFAULT_PAGES:
        Page.objects.get_or_create(
            slug=item["slug"],
            defaults={
                "name": item["name"],
                "title": item["title"],
                "status": "published",
            },
        )


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0006_add_contactmessage_topic_language"),
    ]

    operations = [
        migrations.RunPython(seed_pages, reverse_code=migrations.RunPython.noop),
    ]
