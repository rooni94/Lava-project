from django.contrib import admin

from apps.packages.models import Package, PackageCategory


@admin.register(PackageCategory)
class PackageCategoryAdmin(admin.ModelAdmin):
    list_display = ("name_ar", "name_en", "slug", "created_at")
    search_fields = ("name_ar", "name_en", "slug")


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ("title_ar", "title_en", "price", "show_price", "currency", "featured", "is_active", "category", "created_at")
    list_filter = ("featured", "show_price", "is_active", "category", "product_type")
    search_fields = ("title_ar", "title_en", "slug", "short_description_ar", "short_description_en")
    prepopulated_fields = {"slug": ("title_en",)}
