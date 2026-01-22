from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="status",
            field=models.CharField(
                choices=[("draft", "مسودة"), ("in_progress", "قيد التنفيذ"), ("done", "منجز")], default="done", max_length=20
            ),
        ),
        migrations.CreateModel(
            name="ProjectImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("image", models.ImageField(upload_to="projects/gallery/")),
                ("caption", models.CharField(blank=True, max_length=200)),
                ("order", models.PositiveIntegerField(default=0)),
                ("project", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="images", to="portfolio.project")),
            ],
            options={
                "verbose_name": "صورة مشروع",
                "verbose_name_plural": "صور المشاريع",
                "ordering": ("order",),
            },
        ),
    ]
