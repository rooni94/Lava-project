from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("portfolio", "0005_seed_showcase_projects"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="title_en",
            field=models.CharField(blank=True, default="", max_length=200, verbose_name="Project title (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="description_en",
            field=models.TextField(blank=True, default="", verbose_name="Short description (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="summary_en",
            field=models.TextField(blank=True, default="", verbose_name="Executive summary (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="goals_en",
            field=models.TextField(blank=True, default="", verbose_name="Goals (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="challenges_en",
            field=models.TextField(blank=True, default="", verbose_name="Challenges (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="solution_en",
            field=models.TextField(blank=True, default="", verbose_name="Solution (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="results_en",
            field=models.TextField(blank=True, default="", verbose_name="Results & impact (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="scope_en",
            field=models.CharField(blank=True, default="", max_length=150, verbose_name="Scope (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="duration_en",
            field=models.CharField(blank=True, default="", max_length=100, verbose_name="Duration / timeline (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="team_size_en",
            field=models.CharField(blank=True, default="", max_length=100, verbose_name="Team size (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="budget_en",
            field=models.CharField(blank=True, default="", max_length=100, verbose_name="Budget (EN)"),
        ),
        migrations.AddField(
            model_name="project",
            name="client_en",
            field=models.CharField(blank=True, default="", max_length=150, verbose_name="Client (EN)"),
        ),
    ]
