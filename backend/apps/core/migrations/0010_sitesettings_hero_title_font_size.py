from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0009_add_theme_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="sitesettings",
            name="hero_title_font_size",
            field=models.PositiveSmallIntegerField(default=52),
        ),
    ]
