from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0008_seed_header_footer_sections"),
    ]

    operations = [
        migrations.AddField(
            model_name="sitesettings",
            name="surface_color",
            field=models.CharField(default="#F8F9FA", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="background_color",
            field=models.CharField(default="#F8F9FA", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="text_color",
            field=models.CharField(default="#1F2937", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="heading_color",
            field=models.CharField(default="#222222", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="primary_color_dark",
            field=models.CharField(default="#FF4A75", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="secondary_color_dark",
            field=models.CharField(default="#E5E7EB", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="accent_color_dark",
            field=models.CharField(default="#374151", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="surface_color_dark",
            field=models.CharField(default="#111827", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="background_color_dark",
            field=models.CharField(default="#0B0F17", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="text_color_dark",
            field=models.CharField(default="#E5E7EB", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="heading_color_dark",
            field=models.CharField(default="#F9FAFB", max_length=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="body_font_family",
            field=models.CharField(default="Cairo, Tajawal, 'IBM Plex Sans Arabic', sans-serif", max_length=200),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="body_font_family_en",
            field=models.CharField(default="'Space Grotesk', Inter, Sora, sans-serif", max_length=200),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="heading_font_family",
            field=models.CharField(default="Cairo, Tajawal, 'IBM Plex Sans Arabic', sans-serif", max_length=200),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="heading_font_family_en",
            field=models.CharField(default="'Space Grotesk', Inter, Sora, sans-serif", max_length=200),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="font_size_base",
            field=models.PositiveSmallIntegerField(default=16),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="font_size_h1",
            field=models.PositiveSmallIntegerField(default=36),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="font_size_h2",
            field=models.PositiveSmallIntegerField(default=30),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="font_size_h3",
            field=models.PositiveSmallIntegerField(default=24),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="font_size_h4",
            field=models.PositiveSmallIntegerField(default=20),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="font_size_h5",
            field=models.PositiveSmallIntegerField(default=18),
        ),
        migrations.AddField(
            model_name="sitesettings",
            name="font_size_h6",
            field=models.PositiveSmallIntegerField(default=16),
        ),
    ]
