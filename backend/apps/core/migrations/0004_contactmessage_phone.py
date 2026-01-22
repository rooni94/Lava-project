from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_alter_activitylog_options_alter_contactinfo_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactmessage",
            name="phone",
            field=models.CharField(blank=True, max_length=50, verbose_name="Phone"),
        ),
    ]
