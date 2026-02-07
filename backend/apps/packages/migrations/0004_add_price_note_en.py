from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("packages", "0003_seed_marketing_packages"),
    ]

    operations = [
        migrations.AddField(
            model_name="package",
            name="price_note_en",
            field=models.CharField(blank=True, max_length=120, verbose_name="Price note (EN)"),
        ),
    ]
