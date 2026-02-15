from __future__ import annotations

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.static import serve
from django.urls import re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions, routers
from rest_framework_simplejwt.views import TokenRefreshView

from apps.blog.views import BlogCategoryViewSet, BlogCommentViewSet, BlogPostViewSet
from apps.clients.views import ClientViewSet
from apps.clients.views import TestimonialViewSet
from apps.dashboard.views import DashboardStatsView, FileUploadView
from apps.core.views import (
    ActivityLogViewSet,
    ContactInfoViewSet,
    ContactMessageViewSet,
    ContactSubmitView,
    MediaFileViewSet,
    PageViewSet,
    SectionViewSet,
    SiteSettingsViewSet,
    SubscribeView,
    SubscriberViewSet,
    UserRegistrationView,
)
from apps.accounts.views import DashboardTokenObtainPairView, UserViewSet
from apps.services.views import ServiceCategoryViewSet
from apps.portfolio.views import ProjectViewSet, TechnologyViewSet
from apps.portfolio.views import ProjectImageViewSet
from apps.services.views import ServiceViewSet
from apps.team.views import TeamMemberViewSet
from apps.careers.views import JobApplicationViewSet, JobOpeningViewSet
from apps.packages.views import PackageViewSet, PackageCategoryViewSet
from apps.core.views import ExportMessagesView, ExportSubscribersView
from lava.views import robots_txt, sitemap_xml, healthz

router = routers.DefaultRouter()
router.register(r"site-settings", SiteSettingsViewSet, basename="site-settings")
router.register(r"pages", PageViewSet, basename="pages")
router.register(r"sections", SectionViewSet, basename="sections")
router.register(r"services", ServiceViewSet, basename="services")
router.register(r"service-categories", ServiceCategoryViewSet, basename="service-categories")
router.register(r"projects", ProjectViewSet, basename="projects")
router.register(r"project-images", ProjectImageViewSet, basename="project-images")
router.register(r"technologies", TechnologyViewSet, basename="technologies")
router.register(r"clients", ClientViewSet, basename="clients")
router.register(r"testimonials", TestimonialViewSet, basename="testimonials")
router.register(r"team", TeamMemberViewSet, basename="team")
router.register(r"blog/categories", BlogCategoryViewSet, basename="blog-categories")
router.register(r"blog/posts", BlogPostViewSet, basename="blog-posts")
router.register(r"blog/comments", BlogCommentViewSet, basename="blog-comments")
router.register(r"contact-info", ContactInfoViewSet, basename="contact-info")
router.register(r"messages", ContactMessageViewSet, basename="messages")
router.register(r"subscribers", SubscriberViewSet, basename="subscribers")
router.register(r"media", MediaFileViewSet, basename="media")
router.register(r"users", UserViewSet, basename="users")
router.register(r"careers/jobs", JobOpeningViewSet, basename="job-openings")
router.register(r"careers/applications", JobApplicationViewSet, basename="job-applications")
router.register(r"activities", ActivityLogViewSet, basename="activities")
router.register(r"packages", PackageViewSet, basename="packages")
router.register(r"package-categories", PackageCategoryViewSet, basename="package-categories")

schema_view = get_schema_view(
    openapi.Info(
        title="LAVA API",
        default_version="v1",
        description="واجهة برمجة تطبيقات لافا للخدمات البرمجية وإدارة المحتوى.",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", DashboardTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/register/", UserRegistrationView.as_view(), name="auth_register"),
    path("api/auth/reset-password-request/", UserViewSet.as_view({"post": "reset_password_request"})),
    path("api/auth/reset-password-confirm/", UserViewSet.as_view({"post": "reset_password_confirm"})),
    path("api/dashboard/stats/", DashboardStatsView.as_view(), name="dashboard_stats"),
    path("api/upload/", FileUploadView.as_view(), name="file_upload"),
    path("api/export/subscribers/", ExportSubscribersView.as_view(), name="export_subscribers"),
    path("api/export/messages/", ExportMessagesView.as_view(), name="export_messages"),
    path("api/contact/", ContactSubmitView.as_view(), name="contact_submit"),
    path("api/subscribe/", SubscribeView.as_view(), name="subscribe"),
    path("api/support/", include("apps.support.urls")),
    path("api/", include(router.urls)),
    path(
        "api/docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "api/docs/redoc/",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
    path("healthz/", healthz, name="healthz"),
    path("sitemap.xml", sitemap_xml, name="sitemap"),
    path("robots.txt", robots_txt, name="robots"),
] 

if settings.DEBUG or getattr(settings, "SERVE_MEDIA", False):
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
    ]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
