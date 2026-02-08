from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0009_seed_cafems_systems"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="is_active",
            field=models.BooleanField(default=True, verbose_name="Visible on site"),
        ),
    ]
