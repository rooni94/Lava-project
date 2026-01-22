from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="BlogCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=100, verbose_name="الفئة")),
                ("slug", models.SlugField(unique=True)),
            ],
            options={
                "verbose_name": "فئة المقال",
                "verbose_name_plural": "فئات المقالات",
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="BlogPost",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=200, verbose_name="العنوان")),
                ("slug", models.SlugField(unique=True)),
                ("content", models.TextField(verbose_name="المحتوى")),
                ("excerpt", models.TextField(blank=True, verbose_name="الملخص")),
                ("tags", models.JSONField(blank=True, default=list)),
                ("featured_image", models.ImageField(blank=True, null=True, upload_to="blog/")),
                ("is_published", models.BooleanField(default=False)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                (
                    "author",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="posts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "category",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="posts",
                        to="blog.blogcategory",
                    ),
                ),
            ],
            options={
                "verbose_name": "مقال",
                "verbose_name_plural": "المقالات",
                "ordering": ("-published_at", "-created_at"),
            },
        ),
    ]
