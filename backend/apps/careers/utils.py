from __future__ import annotations

import logging
import os
import shutil
import subprocess
import tempfile
from typing import Iterable

from django.conf import settings
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def _pick_scanner(commands: Iterable[str]) -> str | None:
    for cmd in commands:
        if shutil.which(cmd):
            return cmd
    return None


def _write_temp_file(upload) -> str:
    suffix = os.path.splitext(getattr(upload, "name", ""))[1] or ".tmp"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        for chunk in upload.chunks():
            tmp.write(chunk)
        return tmp.name


def _scan_with_clam(command: str, path: str) -> tuple[int, str]:
    result = subprocess.run(
        [command, "--no-summary", path],
        capture_output=True,
        text=True,
        timeout=120,
    )
    output = (result.stdout or "") + (result.stderr or "")
    return result.returncode, output.strip()


def validate_resume_upload(upload) -> None:
    if not upload:
        raise ValidationError({"resume": "يجب إرفاق السيرة الذاتية."})

    max_bytes = getattr(settings, "CV_MAX_SIZE_MB", 10) * 1024 * 1024
    if upload.size and upload.size > max_bytes:
        raise ValidationError({"resume": f"حجم السيرة الذاتية يجب ألا يتجاوز {settings.CV_MAX_SIZE_MB}MB."})

    content_type = getattr(upload, "content_type", "") or ""
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        raise ValidationError({"resume": "صيغة الملف غير مدعومة. يُرجى رفع PDF أو DOC أو DOCX."})

    scanner = _pick_scanner(["clamdscan", "clamscan"])
    if not scanner:
        if getattr(settings, "CV_SCAN_REQUIRED", True):
            raise ValidationError({"resume": "خدمة فحص الملفات غير متاحة حالياً. حاول لاحقاً."})
        logger.warning("CV scan skipped: ClamAV not available")
        return

    temp_path = _write_temp_file(upload)
    if hasattr(upload, "seek"):
        try:
            upload.seek(0)
        except OSError:
            pass
    try:
        exit_code, output = _scan_with_clam(scanner, temp_path)
        if exit_code == 0:
            return
        if exit_code == 1:
            raise ValidationError({"resume": "تم رفض الملف: تم اكتشاف برمجيات خبيثة."})
        logger.error("CV scan error (%s): %s", scanner, output)
        raise ValidationError({"resume": "تعذر فحص الملف حالياً. حاول لاحقاً."})
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass
