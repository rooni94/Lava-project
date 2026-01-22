from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Technology",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=100, unique=True, verbose_name="التقنية")),
                ("slug", models.SlugField(unique=True)),
            ],
            options={
                "verbose_name": "تقنية",
                "verbose_name_plural": "التقنيات",
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=200, verbose_name="العنوان")),
                ("description", models.TextField(verbose_name="الوصف")),
                (
                    "category",
                    models.CharField(
                        choices=[("web", "تطبيق ويب"), ("mobile", "تطبيق جوال"), ("erp", "نظام مؤسسي"), ("branding", "هوية بصرية"), ("other", "أخرى")],
                        default="web",
                        max_length=50,
                    ),
                ),
                ("client", models.CharField(blank=True, max_length=150, verbose_name="العميل")),
                ("cover_image", models.ImageField(blank=True, null=True, upload_to="projects/")),
                ("gallery", models.JSONField(blank=True, default=list)),
                ("live_url", models.URLField(blank=True)),
                ("github_url", models.URLField(blank=True)),
                ("is_featured", models.BooleanField(default=False)),
                ("technologies", models.ManyToManyField(blank=True, related_name="projects", to="portfolio.technology")),
            ],
            options={
                "verbose_name": "مشروع",
                "verbose_name_plural": "المشاريع",
                "ordering": ("-created_at",),
            },
        ),
    ]
