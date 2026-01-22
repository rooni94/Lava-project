from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ServiceCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120, verbose_name="الفئة")),
                ("slug", models.SlugField(unique=True)),
                ("description", models.TextField(blank=True, verbose_name="الوصف")),
                ("order", models.PositiveIntegerField(default=0)),
            ],
            options={
                "verbose_name": "فئة خدمة",
                "verbose_name_plural": "فئات الخدمات",
                "ordering": ("order", "name"),
            },
        ),
        migrations.AddField(
            model_name="service",
            name="category",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="services", to="services.servicecategory"),
        ),
    ]
