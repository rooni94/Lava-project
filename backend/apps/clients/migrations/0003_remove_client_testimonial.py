from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("clients", "0002_client_category_contact_person_testimonial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="client",
            name="testimonial",
        ),
    ]
