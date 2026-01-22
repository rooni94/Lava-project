from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="TeamMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120, verbose_name="الاسم")),
                ("position", models.CharField(max_length=150, verbose_name="المسمى الوظيفي")),
                ("bio", models.TextField(blank=True, verbose_name="نبذة")),
                ("image", models.ImageField(blank=True, null=True, upload_to="team/")),
                ("social_links", models.JSONField(blank=True, default=dict)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "عضو الفريق",
                "verbose_name_plural": "الفريق",
                "ordering": ("order",),
            },
        ),
    ]
