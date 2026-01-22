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
            name="SiteSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("site_name", models.CharField(max_length=150, verbose_name="اسم الموقع")),
                ("tagline", models.CharField(blank=True, max_length=255, verbose_name="سطر الوصف")),
                ("primary_color", models.CharField(default="#580213", max_length=20)),
                ("secondary_color", models.CharField(default="#222222", max_length=20)),
                ("accent_color", models.CharField(default="#CCCCCC", max_length=20)),
                ("address", models.CharField(blank=True, max_length=255, verbose_name="العنوان")),
                ("phone", models.CharField(blank=True, max_length=50, verbose_name="الهاتف")),
                ("email", models.EmailField(blank=True, max_length=254, verbose_name="البريد الإلكتروني")),
                ("hero_title", models.CharField(blank=True, max_length=200, verbose_name="عنوان البطل")),
                ("hero_subtitle", models.TextField(blank=True, verbose_name="وصف البطل")),
                ("hero_background", models.ImageField(blank=True, null=True, upload_to="hero/")),
                ("logo", models.ImageField(blank=True, null=True, upload_to="branding/")),
                ("favicon", models.ImageField(blank=True, null=True, upload_to="branding/")),
                ("social_links", models.JSONField(blank=True, default=dict)),
            ],
            options={
                "verbose_name": "إعدادات الموقع",
                "verbose_name_plural": "إعدادات الموقع",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="ContactInfo",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("location", models.CharField(blank=True, max_length=255, verbose_name="الموقع")),
                ("phone", models.CharField(blank=True, max_length=50, verbose_name="الهاتف")),
                ("email", models.EmailField(blank=True, max_length=254, verbose_name="البريد الإلكتروني")),
                ("map_embed", models.TextField(blank=True, verbose_name="خريطة")),
                ("working_hours", models.CharField(blank=True, max_length=150, verbose_name="ساعات العمل")),
            ],
            options={
                "verbose_name": "معلومات التواصل",
                "verbose_name_plural": "معلومات التواصل",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="Page",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=100, verbose_name="الاسم")),
                ("slug", models.SlugField(unique=True)),
                ("title", models.CharField(max_length=200, verbose_name="العنوان")),
                ("meta_description", models.TextField(blank=True, verbose_name="وصف ميتا")),
                ("hero_image", models.ImageField(blank=True, null=True, upload_to="pages/")),
            ],
            options={
                "verbose_name": "صفحة",
                "verbose_name_plural": "الصفحات",
                "ordering": ("name",),
            },
        ),
        migrations.CreateModel(
            name="Subscriber",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("email", models.EmailField(max_length=254, unique=True, verbose_name="البريد الإلكتروني")),
                ("source", models.CharField(blank=True, max_length=100)),
            ],
            options={
                "verbose_name": "مشترك",
                "verbose_name_plural": "المشتركين",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120, verbose_name="الاسم")),
                ("email", models.EmailField(max_length=254, verbose_name="البريد الإلكتروني")),
                ("message", models.TextField(verbose_name="الرسالة")),
                (
                    "service_type",
                    models.CharField(
                        choices=[("web", "تطوير الويب"), ("mobile", "تطبيقات الجوال"), ("erp", "أنظمة تخطيط الموارد"), ("other", "أخرى")],
                        default="other",
                        max_length=50,
                    ),
                ),
                ("is_handled", models.BooleanField(default=False, verbose_name="تمت المعالجة")),
            ],
            options={
                "verbose_name": "رسالة تواصل",
                "verbose_name_plural": "رسائل التواصل",
                "ordering": ("-created_at",),
            },
        ),
        migrations.CreateModel(
            name="Section",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=200, verbose_name="العنوان")),
                ("content", models.TextField(verbose_name="المحتوى")),
                ("section_type", models.CharField(blank=True, max_length=100)),
                ("order", models.PositiveIntegerField(default=0)),
                ("media", models.ImageField(blank=True, null=True, upload_to="sections/")),
                ("extra", models.JSONField(blank=True, default=dict)),
                ("page", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="sections", to="core.page")),
            ],
            options={
                "verbose_name": "قسم",
                "verbose_name_plural": "الأقسام",
                "ordering": ("order",),
            },
        ),
        migrations.CreateModel(
            name="ActivityLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("action", models.CharField(max_length=150)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                (
                    "actor",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="activities",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "سجل النشاط",
                "verbose_name_plural": "سجل النشاط",
                "ordering": ("-created_at",),
            },
        ),
    ]
