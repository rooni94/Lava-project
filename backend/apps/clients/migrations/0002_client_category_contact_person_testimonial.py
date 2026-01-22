from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("clients", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="client",
            name="category",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name="client",
            name="contact_person",
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.CreateModel(
            name="Testimonial",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("quote", models.TextField(verbose_name="التوصية")),
                ("author", models.CharField(blank=True, max_length=150)),
                ("position", models.CharField(blank=True, max_length=150)),
                ("rating", models.PositiveSmallIntegerField(default=5)),
                ("is_featured", models.BooleanField(default=True)),
                ("client", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="testimonials", to="clients.client")),
            ],
            options={
                "verbose_name": "توصية",
                "verbose_name_plural": "التوصيات",
                "ordering": ("-created_at",),
            },
        ),
    ]
