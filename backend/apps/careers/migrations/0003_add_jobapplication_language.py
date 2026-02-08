from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("careers", "0002_seed_additional_jobs"),
    ]

    operations = [
        migrations.AddField(
            model_name="jobapplication",
            name="language",
            field=models.CharField(default="ar", max_length=5),
        ),
    ]
