from django.contrib import admin

from apps.portfolio.models import Project, ProjectImage, Technology


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "client", "status", "is_featured", "created_at")
    list_filter = ("category", "is_featured", "status")
    search_fields = ("title", "client", "description", "summary", "goals")
    filter_horizontal = ("technologies",)
    fieldsets = (
        (None, {"fields": ("title", "description", "summary", "goals", "challenges", "solution", "results")}),
        (
            "تفاصيل العمل",
            {"fields": ("category", "client", "scope", "duration", "team_size", "budget", "technologies")},
        ),
        ("روابط ووسائط", {"fields": ("cover_image", "gallery", "live_url", "github_url")}),
        ("التمييز والنشر", {"fields": ("status", "is_featured", "scheduled_publish_at")}),
        (
            "التنسيق",
            {
                "fields": (
                    "title_font_family",
                    "body_font_family",
                    "title_font_size",
                    "body_font_size",
                    "primary_color",
                    "accent_color",
                )
            },
        ),
    )


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ("project", "order")
    ordering = ("project", "order")
