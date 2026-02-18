from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("clients", "0003_remove_client_testimonial"),
    ]

    operations = [
        migrations.AddField(
            model_name="testimonial",
            name="quote_en",
            field=models.TextField(blank=True, verbose_name="التوصية بالإنجليزية"),
        ),
    ]
