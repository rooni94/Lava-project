from django.db import migrations


def set_currency_sar(apps, schema_editor):
    Package = apps.get_model("packages", "Package")
    Package.objects.update(currency="SAR")


class Migration(migrations.Migration):
    dependencies = [
        ("packages", "0006_alter_package_options_alter_packagecategory_options_and_more"),
    ]

    operations = [
        migrations.RunPython(set_currency_sar, reverse_code=migrations.RunPython.noop),
    ]
