from __future__ import annotations

import logging
import re
from typing import Iterable

from django.conf import settings
from django.core.mail import EmailMessage

from apps.careers.models import JobApplication
from apps.core.models import ContactMessage

logger = logging.getLogger(__name__)
ARABIC_RE = re.compile(r"[\u0600-\u06FF]")


def _as_list(value: str | Iterable[str] | None) -> list[str]:
    if not value:
        return []
    if isinstance(value, str):
        return [value]
    return list(value)


def detect_language(text: str | None) -> str:
    if text and ARABIC_RE.search(text):
        return "ar"
    return "en"


def _pick_from_email(topic: str | None) -> str | None:
    if topic == "support":
        return getattr(settings, "SUPPORT_EMAIL", None)
    return getattr(settings, "CONTACT_EMAIL", None) or getattr(settings, "DEFAULT_FROM_EMAIL", None)


def _build_contact_ack(message: ContactMessage) -> tuple[str, str]:
    lang = (message.language or "").lower() or detect_language(message.message)
    is_support = message.topic == "support"

    if lang == "ar":
        subject = "تم استلام طلبك - LAVA"
        if is_support:
            subject = "تم استلام طلب الدعم الفني - LAVA"
        body = "\n".join(
            [
                f"مرحباً {message.name},",
                "",
                "شكرًا لتواصلك معنا. تم استلام رسالتك وسنعود إليك خلال 24 ساعة عمل.",
                "",
                "تفاصيل الطلب:",
                f"- الاسم: {message.name}",
                f"- البريد: {message.email}",
                f"- الهاتف: {message.phone or '-'}",
                f"- نوع الخدمة: {message.service_type}",
                f"- نوع الرسالة: {'دعم فني' if is_support else 'طلب باقة/خدمة'}",
                "",
                "محتوى الرسالة:",
                message.message,
                "",
                "تحياتنا،",
                "فريق LAVA",
            ]
        )
        return subject, body

    subject = "We received your request - LAVA"
    if is_support:
        subject = "We received your support request - LAVA"
    body = "\n".join(
        [
            f"Hello {message.name},",
            "",
            "Thanks for reaching out. We received your message and will respond within 24 business hours.",
            "",
            "Request details:",
            f"- Name: {message.name}",
            f"- Email: {message.email}",
            f"- Phone: {message.phone or '-'}",
            f"- Service type: {message.service_type}",
            f"- Message type: {'Support' if is_support else 'Sales / Package'}",
            "",
            "Message:",
            message.message,
            "",
            "Best regards,",
            "LAVA Team",
        ]
    )
    return subject, body


def send_contact_ack(message: ContactMessage) -> None:
    subject, body = _build_contact_ack(message)
    from_email = _pick_from_email(message.topic)
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=[message.email],
        reply_to=[from_email] if from_email else None,
    )
    try:
        email.send(fail_silently=False)
    except Exception as exc:
        logger.error("Failed to send contact ack email: %s", exc)


def send_contact_reply(message: ContactMessage, subject: str, body: str) -> None:
    from_email = _pick_from_email(message.topic)
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=[message.email],
        reply_to=[from_email] if from_email else None,
    )
    email.send(fail_silently=False)


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
        f"Topic: {topic or message.topic or 'sales'}",
        f"Language: {message.language}",
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
        f"Language: {application.language}",
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


def _build_job_ack(application: JobApplication) -> tuple[str, str]:
    lang = (application.language or "").lower() or detect_language(application.cover_letter or "")
    if lang == "ar":
        subject = "تم استلام طلب التوظيف - LAVA"
        body = "\n".join(
            [
                f"مرحباً {application.full_name},",
                "",
                "شكرًا لتقديمك. تم استلام طلب التوظيف وسنعاود التواصل خلال 24 ساعة عمل.",
                "",
                "تفاصيل الطلب:",
                f"- الوظيفة: {application.job.title}",
                f"- الاسم: {application.full_name}",
                f"- البريد: {application.email}",
                f"- الهاتف: {application.phone or '-'}",
                "",
                "تحياتنا،",
                "فريق LAVA",
            ]
        )
        return subject, body

    subject = "We received your application - LAVA"
    body = "\n".join(
        [
            f"Hello {application.full_name},",
            "",
            "Thank you for applying. We received your application and will get back to you within 24 business hours.",
            "",
            "Application details:",
            f"- Role: {application.job.title}",
            f"- Name: {application.full_name}",
            f"- Email: {application.email}",
            f"- Phone: {application.phone or '-'}",
            "",
            "Best regards,",
            "LAVA Team",
        ]
    )
    return subject, body


def send_job_application_ack(application: JobApplication) -> None:
    subject, body = _build_job_ack(application)
    from_email = getattr(settings, "JOBS_EMAIL", None) or getattr(settings, "DEFAULT_FROM_EMAIL", None)
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=[application.email],
        reply_to=[from_email] if from_email else None,
    )
    try:
        email.send(fail_silently=False)
    except Exception as exc:
        logger.error("Failed to send job ack email: %s", exc)


def send_job_application_reply(application: JobApplication, subject: str, body: str) -> None:
    from_email = getattr(settings, "JOBS_EMAIL", None) or getattr(settings, "DEFAULT_FROM_EMAIL", None)
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=[application.email],
        reply_to=[from_email] if from_email else None,
    )
    email.send(fail_silently=False)
