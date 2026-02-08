from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0005_alter_contactmessage_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactmessage",
            name="topic",
            field=models.CharField(choices=[("sales", "Sales / Packages"), ("support", "Support"), ("general", "General")], default="sales", max_length=20),
        ),
        migrations.AddField(
            model_name="contactmessage",
            name="language",
            field=models.CharField(choices=[("ar", "Arabic"), ("en", "English")], default="ar", max_length=5),
        ),
    ]
