from __future__ import annotations

from typing import Any

from apps.core.models import ActivityLog


class ActivityLoggerMixin:
    """Log create/update/delete actions into ActivityLog."""

    activity_action_prefix: str | None = None

    def _log_activity(self, instance, action: str, extra: dict[str, Any] | None = None) -> None:
        request = getattr(self, "request", None)
        actor = None
        if request and getattr(request, "user", None) and request.user.is_authenticated:
            actor = request.user
        try:
            ActivityLog.objects.create(
                actor=actor,
                action=action,
                metadata={
                    "model": instance._meta.label_lower,
                    "id": instance.pk,
                    **(extra or {}),
                },
            )
        except Exception:
            # Logging must never break API calls
            pass

    def perform_create(self, serializer):
        instance = serializer.save()
        action = self.activity_action_prefix or f"create_{instance._meta.model_name}"
        self._log_activity(instance, action)
        return instance

    def perform_update(self, serializer):
        instance = serializer.save()
        action = self.activity_action_prefix or f"update_{instance._meta.model_name}"
        self._log_activity(instance, action)
        return instance

    def perform_destroy(self, instance):
        action = self.activity_action_prefix or f"delete_{instance._meta.model_name}"
        self._log_activity(instance, action)
        return super().perform_destroy(instance)
