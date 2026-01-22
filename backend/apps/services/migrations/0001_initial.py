from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Service",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=150, verbose_name="العنوان")),
                ("description", models.TextField(verbose_name="الوصف")),
                ("icon", models.CharField(blank=True, max_length=100, verbose_name="الأيقونة")),
                ("image", models.ImageField(blank=True, null=True, upload_to="services/")),
                ("features", models.JSONField(blank=True, default=list)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "خدمة",
                "verbose_name_plural": "الخدمات",
                "ordering": ("order",),
            },
        ),
    ]
