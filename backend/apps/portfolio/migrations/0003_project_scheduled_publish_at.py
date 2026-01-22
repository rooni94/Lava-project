from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0002_project_status_projectimage"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="scheduled_publish_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
