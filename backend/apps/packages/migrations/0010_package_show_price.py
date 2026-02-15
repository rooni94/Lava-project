from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("packages", "0009_restore_package_catalog"),
    ]

    operations = [
        migrations.AddField(
            model_name="package",
            name="show_price",
            field=models.BooleanField(default=True, verbose_name="إظهار السعر"),
        ),
    ]
