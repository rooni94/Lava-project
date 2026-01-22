from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactmessage",
            name="status",
            field=models.CharField(
                choices=[("new", "جديد"), ("replied", "تم الرد"), ("resolved", "مغلق")], default="new", max_length=20
            ),
        ),
        migrations.AddField(
            model_name="page",
            name="status",
            field=models.CharField(choices=[("draft", "مسودة"), ("published", "منشورة")], default="published", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="analytics_codes",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="email_templates",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="meta_keywords",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="meta_description",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="og_image",
            field=models.ImageField(blank=True, null=True, upload_to="branding/"),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="seo_title",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="subscriber",
            name="tags",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.CreateModel(
            name="MediaFile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("file", models.FileField(upload_to="media-library/")),
                ("media_type", models.CharField(choices=[("image", "صورة"), ("document", "ملف"), ("video", "فيديو")], default="image", max_length=20)),
                ("title", models.CharField(blank=True, max_length=200)),
                ("alt_text", models.CharField(blank=True, max_length=200)),
                ("category", models.CharField(blank=True, max_length=100)),
            ],
            options={
                "verbose_name": "وسائط",
                "verbose_name_plural": "مكتبة الوسائط",
                "ordering": ("-created_at",),
            },
        ),
    ]
