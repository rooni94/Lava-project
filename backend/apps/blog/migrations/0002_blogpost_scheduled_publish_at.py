from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="blogpost",
            name="scheduled_publish_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
