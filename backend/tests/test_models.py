from django.test import TestCase
from django.utils import timezone

from apps.core.models import SiteSettings, Page
from apps.services.models import ServiceCategory, Service
from apps.blog.models import BlogPost, BlogComment


class BasicModelsTest(TestCase):
    def test_site_settings_create(self):
        s = SiteSettings.objects.create(site_name="Lava", tagline="اختبار")
        self.assertEqual(str(s), "Lava")

    def test_page_status_default(self):
        page = Page.objects.create(name="Home", slug="home", title="الصفحة الرئيسية")
        self.assertEqual(page.status, "published")

    def test_service_with_category(self):
        cat = ServiceCategory.objects.create(name="ويب", slug="web")
        svc = Service.objects.create(title="تطوير", description="وصف", category=cat)
        self.assertEqual(svc.category, cat)

    def test_blog_schedule_publish(self):
        post = BlogPost.objects.create(title="t", slug="t", content="c", is_published=False, scheduled_publish_at=timezone.now())
        self.assertIsNone(post.published_at)

    def test_comment_string(self):
        post = BlogPost.objects.create(title="x", slug="x", content="c", is_published=True)
        comment = BlogComment.objects.create(post=post, name="زائر", email="x@example.com", content="نص")
        self.assertIn("زائر", str(comment))
