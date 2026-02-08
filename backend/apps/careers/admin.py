from django.contrib import admin

from apps.careers.models import JobApplication, JobOpening


@admin.register(JobOpening)
class JobOpeningAdmin(admin.ModelAdmin):
    list_display = ("title", "department", "employment_type", "is_active", "created_at")
    list_filter = ("is_active", "employment_type", "department")
    search_fields = ("title", "description", "department")


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "job", "status", "language", "created_at")
    list_filter = ("status", "job", "language")
    search_fields = ("full_name", "email")
