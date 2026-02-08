from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0010_seed_cafems_system_translations"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="is_active",
            field=models.BooleanField(default=True, verbose_name="Visible on site"),
        ),
    ]
