from __future__ import annotations

import os

from django.conf import settings
from django.utils.deprecation import MiddlewareMixin


class SecurityHeadersMiddleware(MiddlewareMixin):
    """Adds a minimal set of secure headers with configurable CSP."""

    def process_response(self, request, response):
        response.setdefault("X-Content-Type-Options", "nosniff")
        response.setdefault("X-Frame-Options", "DENY")
        response.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        if not settings.DEBUG:
            response.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
            csp = getattr(settings, "CSP_HEADER", None) or os.environ.get(
                "CSP_HEADER",
                "default-src 'self'; "
                "img-src 'self' data: blob: https://*.googleusercontent.com; "
                "media-src 'self' data: blob:; "
                "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.hotjar.com; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com; "
                "connect-src 'self' https://www.google-analytics.com https://*.hotjar.com; ",
            )
            response.setdefault("Content-Security-Policy", csp)
        return response
