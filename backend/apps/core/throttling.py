from __future__ import annotations

from rest_framework.throttling import AnonRateThrottle, ScopedRateThrottle


def _first_ip_from_xff(xff: str) -> str | None:
    if not xff:
        return None
    # Standard format: "client, proxy1, proxy2"
    first = xff.split(",")[0].strip()
    return first or None


class RealIPMixin:
    """
    DRF throttling uses request.META['REMOTE_ADDR'] by default, which is the proxy IP when behind Nginx/Cloudflare.
    That can cause all users to share a single throttle bucket and quickly hit 429 in production.
    """

    def get_ident(self, request):  # type: ignore[override]
        meta = getattr(request, "META", {}) or {}

        cf = meta.get("HTTP_CF_CONNECTING_IP")
        if cf:
            return str(cf).strip()

        real_ip = meta.get("HTTP_X_REAL_IP")
        if real_ip:
            return str(real_ip).strip()

        xff = meta.get("HTTP_X_FORWARDED_FOR")
        ip = _first_ip_from_xff(str(xff)) if xff else None
        if ip:
            return ip

        return super().get_ident(request)


class RealIPScopedRateThrottle(RealIPMixin, ScopedRateThrottle):
    pass


class RealIPAnonRateThrottle(RealIPMixin, AnonRateThrottle):
    pass

