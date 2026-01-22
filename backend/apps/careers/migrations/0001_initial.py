from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="JobOpening",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=200, verbose_name="المسمى الوظيفي")),
                ("department", models.CharField(blank=True, max_length=150)),
                ("location", models.CharField(blank=True, max_length=150)),
                ("employment_type", models.CharField(choices=[("full_time", "دوام كامل"), ("part_time", "دوام جزئي"), ("contract", "متعاقد"), ("intern", "تدريب")], default="full_time", max_length=50)),
                ("description", models.TextField(verbose_name="الوصف")),
                ("requirements", models.JSONField(blank=True, default=list)),
                ("benefits", models.JSONField(blank=True, default=list)),
                ("is_active", models.BooleanField(default=True)),
                ("apply_url", models.URLField(blank=True)),
            ],
            options={
                "verbose_name": "وظيفة",
                "verbose_name_plural": "الوظائف",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="JobApplication",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("full_name", models.CharField(max_length=150)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=50)),
                ("resume", models.FileField(upload_to="careers/resumes/")),
                ("cover_letter", models.TextField(blank=True)),
                ("status", models.CharField(choices=[("new", "جديد"), ("review", "قيد المراجعة"), ("interview", "مقابلة"), ("hired", "تم التعيين"), ("rejected", "مرفوض")], default="new", max_length=20)),
                ("notes", models.TextField(blank=True)),
                ("job", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="applications", to="careers.jobopening")),
            ],
            options={
                "verbose_name": "طلب توظيف",
                "verbose_name_plural": "طلبات التوظيف",
                "ordering": ("-created_at",),
            },
        ),
    ]
