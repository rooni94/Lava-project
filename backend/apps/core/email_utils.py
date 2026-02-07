from __future__ import annotations

import logging
from typing import Iterable

from django.conf import settings
from django.core.mail import EmailMessage

from apps.careers.models import JobApplication
from apps.core.models import ContactMessage

logger = logging.getLogger(__name__)


def _as_list(value: str | Iterable[str] | None) -> list[str]:
    if not value:
        return []
    if isinstance(value, str):
        return [value]
    return list(value)


def send_contact_notification(message: ContactMessage, topic: str | None = None) -> None:
    recipients = _as_list(getattr(settings, "CONTACT_EMAIL", ""))
    if topic and str(topic).lower() in {"support", "help", "technical"}:
        recipients = _as_list(getattr(settings, "SUPPORT_EMAIL", "")) or recipients

    if not recipients:
        logger.warning("No contact recipients configured")
        return

    subject = f"New contact message: {message.name}"
    lines = [
        f"Name: {message.name}",
        f"Email: {message.email}",
        f"Phone: {message.phone or '-'}",
        f"Service type: {message.service_type}",
        f"Status: {message.status}",
        f"Topic: {topic or 'sales'}",
        "",
        "Message:",
        message.message,
    ]
    body = "\n".join(lines)

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        to=recipients,
        reply_to=[message.email],
    )

    try:
        email.send(fail_silently=False)
    except Exception as exc:
        logger.error("Failed to send contact email: %s", exc)


def send_job_application_notification(application: JobApplication) -> None:
    recipients = _as_list(getattr(settings, "JOBS_EMAIL", ""))
    if not recipients:
        logger.warning("No jobs recipients configured")
        return

    job = application.job
    subject = f"New job application: {job.title} - {application.full_name}"
    lines = [
        f"Job: {job.title}",
        f"Department: {job.department or '-'}",
        f"Location: {job.location or '-'}",
        f"Applicant: {application.full_name}",
        f"Email: {application.email}",
        f"Phone: {application.phone or '-'}",
        "",
        "Cover letter:",
        application.cover_letter or "-",
    ]
    body = "\n".join(lines)

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        to=recipients,
        reply_to=[application.email],
    )

    try:
        if application.resume:
            with application.resume.open("rb") as fh:
                email.attach(application.resume.name.split("/")[-1], fh.read())
        email.send(fail_silently=False)
    except Exception as exc:
        logger.error("Failed to send job application email: %s", exc)
