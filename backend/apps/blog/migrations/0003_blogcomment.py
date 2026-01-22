from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0002_blogpost_scheduled_publish_at"),
    ]

    operations = [
        migrations.CreateModel(
            name="BlogComment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120, verbose_name="الاسم")),
                ("email", models.EmailField(max_length=254, verbose_name="البريد الإلكتروني")),
                ("content", models.TextField(verbose_name="نص التعليق")),
                ("is_approved", models.BooleanField(default=True, verbose_name="معتمد")),
                (
                    "post",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="comments",
                        to="blog.blogpost",
                    ),
                ),
            ],
            options={
                "verbose_name": "تعليق مدونة",
                "verbose_name_plural": "تعليقات المدونة",
                "ordering": ("-created_at",),
            },
        ),
    ]
