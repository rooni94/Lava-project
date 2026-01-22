from django.contrib import admin

from apps.blog.models import BlogCategory, BlogComment, BlogPost


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "author", "is_published", "published_at")
    list_filter = ("is_published", "category")
    search_fields = ("title", "content", "tags")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ("post", "name", "email", "is_approved", "created_at")
    list_filter = ("is_approved", "post")
    search_fields = ("name", "email", "content")
