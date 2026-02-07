from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0002_servicecategory_service_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="service",
            name="title_en",
            field=models.CharField(blank=True, default="", max_length=150, verbose_name="Title (EN)"),
        ),
        migrations.AddField(
            model_name="service",
            name="description_en",
            field=models.TextField(blank=True, default="", verbose_name="Description (EN)"),
        ),
        migrations.AddField(
            model_name="service",
            name="features_en",
            field=models.JSONField(blank=True, default=list, verbose_name="Features (EN)"),
        ),
    ]
