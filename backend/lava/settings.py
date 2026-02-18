from __future__ import annotations

import os
from datetime import timedelta
from pathlib import Path

import dj_database_url
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent


def _csv_list(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _append_unique(items: list[str], extras: list[str]) -> list[str]:
    for extra in extras:
        if extra not in items:
            items.append(extra)
    return items

SECRET_KEY = os.environ["SECRET_KEY"]
DEBUG = os.environ.get("DEBUG", "False") == "True"
SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "False") == "True"
DASHBOARD_ACCESS_KEY = os.environ.get("DASHBOARD_ACCESS_KEY", "").strip()
DJANGO_ADMIN_PATH = (os.environ.get("DJANGO_ADMIN_PATH", "secure-admin").strip().strip("/") or "secure-admin")
ADMIN_ALLOWED_IPS = _csv_list(os.environ.get("ADMIN_ALLOWED_IPS", ""))
ALLOWED_HOSTS = _csv_list(os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1"))
ALLOWED_HOSTS = _append_unique(ALLOWED_HOSTS, ["localhost", "127.0.0.1"])

CSRF_TRUSTED_ORIGINS = _csv_list(
    os.environ.get("CSRF_TRUSTED_ORIGINS", "http://localhost:8000,http://localhost:5173,http://localhost:4173")
)
CSRF_TRUSTED_ORIGINS = _append_unique(
    CSRF_TRUSTED_ORIGINS,
    [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
)

INSTALLED_APPS = [
    "apps.accounts",
    "channels",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "django_filters",
    "django_ratelimit",
    "corsheaders",
    "drf_yasg",
    "apps.core",
    "apps.dashboard",
    "apps.content",
    "apps.services",
    "apps.portfolio",
    "apps.blog",
    "apps.team",
    "apps.clients",
    "apps.careers",
    "apps.packages",
    "apps.support",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "lava.middleware.SecurityHeadersMiddleware",
    "lava.middleware.AdminAccessMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "lava.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "lava.wsgi.application"
ASGI_APPLICATION = "lava.asgi.application"

DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL:
    DATABASES = {"default": dj_database_url.parse(DATABASE_URL, conn_max_age=600)}
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "ar"
TIME_ZONE = "Asia/Riyadh"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
_static_dir = BASE_DIR / "static"
STATICFILES_DIRS: list[Path] = [_static_dir] if _static_dir.exists() else []
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
WHITENOISE_MAX_AGE = 60 * 60 * 24 * 30  # 30 days

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
SERVE_MEDIA = os.environ.get("SERVE_MEDIA", "True") == "True"
MEDIA_MAX_UPLOAD_MB = int(os.environ.get("MEDIA_MAX_UPLOAD_MB", "20"))
MEDIA_WATERMARK_ENABLED = os.environ.get("MEDIA_WATERMARK_ENABLED", "True") == "True"
MEDIA_WATERMARK_TEXT = os.environ.get("MEDIA_WATERMARK_TEXT", "LAVA")
MEDIA_WATERMARK_OPACITY = float(os.environ.get("MEDIA_WATERMARK_OPACITY", "0.22"))
MEDIA_WATERMARK_COLOR = os.environ.get("MEDIA_WATERMARK_COLOR", "#ffffff")
MEDIA_WATERMARK_IMAGE_PATH = os.environ.get("MEDIA_WATERMARK_IMAGE_PATH", "")
MEDIA_WATERMARK_IMAGE_SCALE = float(os.environ.get("MEDIA_WATERMARK_IMAGE_SCALE", "0.18"))
MEDIA_IMAGE_MAX_SIDE = int(os.environ.get("MEDIA_IMAGE_MAX_SIDE", "1920"))
MEDIA_IMAGE_QUALITY = int(os.environ.get("MEDIA_IMAGE_QUALITY", "92"))
MEDIA_IMAGE_WEBP_METHOD = int(os.environ.get("MEDIA_IMAGE_WEBP_METHOD", "6"))
MEDIA_IMAGE_ALPHA_LOSSLESS = os.environ.get("MEDIA_IMAGE_ALPHA_LOSSLESS", "True") == "True"

if os.environ.get("USE_S3", "False") == "True":
    AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")
    AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_S3_CUSTOM_DOMAIN = os.environ.get("AWS_S3_CUSTOM_DOMAIN")
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN or f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'}/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"

EMAIL_BACKEND = os.environ.get("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.hostinger.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "465"))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_SSL = os.environ.get("EMAIL_USE_SSL", "True") == "True"
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "False") == "True"
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "noreply@itlava.com")

SUPPORT_EMAIL = os.environ.get("SUPPORT_EMAIL", "support@itlava.com")
CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "contact@itlava.com")
JOBS_EMAIL = os.environ.get("JOBS_EMAIL", "jobs@itlava.com")
NOREPLY_EMAIL = os.environ.get("NOREPLY_EMAIL", "noreply@itlava.com")

# CV / Resume scanning
CV_SCAN_REQUIRED = os.environ.get("CV_SCAN_REQUIRED", "True") == "True"
CV_MAX_SIZE_MB = int(os.environ.get("CV_MAX_SIZE_MB", "10"))

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", CELERY_BROKER_URL)
CELERY_TASK_ALWAYS_EAGER = os.environ.get("CELERY_TASK_ALWAYS_EAGER", "False") == "True"
CELERY_BEAT_SCHEDULE = {
    "publish_scheduled_blog": {
        "task": "apps.blog.tasks.publish_scheduled_blog_posts",
        "schedule": 300,  # every 5 minutes
    },
    "publish_scheduled_projects": {
        "task": "apps.portfolio.tasks.publish_scheduled_projects",
        "schedule": 300,
    },
}

REDIS_URL = os.environ.get("REDIS_URL")
MEMCACHED_LOCATION = os.environ.get("MEMCACHED_LOCATION")
if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
        }
    }
elif MEMCACHED_LOCATION:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
            "LOCATION": [loc.strip() for loc in MEMCACHED_LOCATION.split(",") if loc.strip()],
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "lava-locmem",
        }
    }

if REDIS_URL:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {"hosts": [REDIS_URL]},
        }
    }
else:
    CHANNEL_LAYERS = {
        "default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}
    }

RATELIMIT_USE_CACHE = "default"
SILENCED_SYSTEM_CHECKS = ["django_ratelimit.E003", "django_ratelimit.W001"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticatedOrReadOnly",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "apps.core.throttling.RealIPScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "auth": "20/min",
        "contact": "30/hour",
        "services": "300/min",
        "projects": "300/min",
        "packages": "300/min",
        "blog": "300/min",
        "jobs": "300/min",
        "clients": "300/min",
        "team": "300/min",
        "media": "60/min",
        "site_settings": "600/min",
        "pages": "600/min",
        "sections": "600/min",
        "careers": "300/min",
    },
}

# Emergency switch: disable all DRF throttling (useful when a reverse proxy hides client IPs and
# throttle buckets become shared, causing widespread 429s).
DISABLE_THROTTLING = os.environ.get("DISABLE_THROTTLING", "False").strip().lower() in ("1", "true", "yes", "on")
if DISABLE_THROTTLING:
    REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = []

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

CORS_ALLOWED_ORIGINS = _csv_list(
    os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173,http://localhost:3000")
)
CORS_ALLOWED_ORIGINS = _append_unique(
    CORS_ALLOWED_ORIGINS,
    [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-guest-token",
    "x-dashboard-key",
]

SWAGGER_SETTINGS = {
    "USE_SESSION_AUTH": False,
    "SECURITY_DEFINITIONS": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
        }
    },
    "DEFAULT_MODEL_RENDERING": "example",
}
# Silence deprecated renderer warning
SWAGGER_USE_COMPAT_RENDERERS = False

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        }
    },
    "root": {"handlers": ["console"], "level": "INFO"},
}

if not DEBUG:
    SECURE_HSTS_SECONDS = int(os.environ.get("SECURE_HSTS_SECONDS", "63072000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
