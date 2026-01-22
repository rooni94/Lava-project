from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Client",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=150, verbose_name="الاسم")),
                ("logo", models.ImageField(blank=True, null=True, upload_to="clients/")),
                ("testimonial", models.TextField(blank=True, verbose_name="شهادة")),
                ("rating", models.PositiveSmallIntegerField(default=5)),
                ("website", models.URLField(blank=True)),
                ("is_featured", models.BooleanField(default=False)),
            ],
            options={
                "verbose_name": "عميل",
                "verbose_name_plural": "العملاء",
                "ordering": ("-created_at",),
            },
        ),
    ]
