from __future__ import annotations

import io
import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Iterable

from django.conf import settings
from django.core.files.base import ContentFile
from django.utils import timezone
from PIL import Image, ImageColor, ImageDraw, ImageFont, ImageOps


@dataclass(frozen=True)
class ProcessedUpload:
    content: ContentFile
    filename: str
    content_type: str


def guess_media_type(*, content_type: str | None, filename: str | None) -> str:
    ct = (content_type or "").lower()
    name = (filename or "").lower()
    if ct.startswith("image/") or name.endswith((".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff")):
        return "image"
    if ct.startswith("video/") or name.endswith((".mp4", ".mov", ".mkv", ".webm", ".avi")):
        return "video"
    return "document"


def _load_font(size: int) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("DejaVuSans.ttf", size=size)
    except Exception:
        return ImageFont.load_default()


def _watermark_text() -> str:
    text = os.environ.get("MEDIA_WATERMARK_TEXT")
    if text:
        return text.strip()
    # Fallback to site name if available; keep it stable for images.
    return getattr(settings, "MEDIA_WATERMARK_TEXT", "") or "LAVA"


def _watermark_enabled() -> bool:
    enabled = os.environ.get("MEDIA_WATERMARK_ENABLED")
    if enabled is not None:
        return enabled.lower() in ("1", "true", "yes", "on")
    return bool(getattr(settings, "MEDIA_WATERMARK_ENABLED", True))


def _watermark_opacity() -> float:
    raw = os.environ.get("MEDIA_WATERMARK_OPACITY") or getattr(settings, "MEDIA_WATERMARK_OPACITY", 0.22)
    try:
        val = float(raw)
    except Exception:
        val = 0.22
    return max(0.0, min(1.0, val))


def _watermark_color() -> tuple[int, int, int]:
    raw = os.environ.get("MEDIA_WATERMARK_COLOR") or getattr(settings, "MEDIA_WATERMARK_COLOR", "#ffffff")
    try:
        return ImageColor.getrgb(str(raw))
    except Exception:
        return (255, 255, 255)


def _watermark_image_path() -> str | None:
    raw = os.environ.get("MEDIA_WATERMARK_IMAGE_PATH") or getattr(settings, "MEDIA_WATERMARK_IMAGE_PATH", "")
    path = str(raw).strip()
    return path or None


def _watermark_image_scale() -> float:
    raw = os.environ.get("MEDIA_WATERMARK_IMAGE_SCALE") or getattr(settings, "MEDIA_WATERMARK_IMAGE_SCALE", 0.18)
    try:
        val = float(raw)
    except Exception:
        val = 0.18
    return max(0.05, min(0.6, val))


@lru_cache(maxsize=8)
def _load_watermark_image(path: str) -> Image.Image | None:
    resolved = path
    if not os.path.isabs(resolved):
        base_dir = getattr(settings, "BASE_DIR", None)
        if base_dir:
            resolved = os.path.join(str(base_dir), resolved)
        else:
            resolved = os.path.abspath(resolved)
    try:
        img = Image.open(resolved)
        return img.convert("RGBA")
    except Exception:
        return None


def apply_logo_watermark(image: Image.Image) -> Image.Image:
    if not _watermark_enabled():
        return image

    path = _watermark_image_path()
    if not path:
        return image

    watermark = _load_watermark_image(path)
    if watermark is None:
        return image

    base = image.convert("RGBA")
    w, h = base.size
    if w < 240 or h < 240:
        return image

    target_w = int(min(w, h) * _watermark_image_scale())
    if target_w < 24:
        return image

    wm = watermark.copy()
    ratio = target_w / max(1, wm.size[0])
    target_h = max(1, int(wm.size[1] * ratio))
    wm = wm.resize((target_w, target_h), resample=Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS)

    opacity = _watermark_opacity()
    if opacity < 1.0:
        r, g, b, a = wm.split()
        a = a.point(lambda p: int(p * opacity))
        wm = Image.merge("RGBA", (r, g, b, a))

    margin = max(10, int(min(w, h) * 0.03))
    x = w - wm.size[0] - margin
    y = h - wm.size[1] - margin
    if x < 0 or y < 0:
        return image

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    overlay.paste(wm, (x, y), wm)
    out = Image.alpha_composite(base, overlay)
    return out.convert(image.mode) if image.mode in ("RGB", "L") else out


def _image_max_side() -> int:
    raw = os.environ.get("MEDIA_IMAGE_MAX_SIDE") or getattr(settings, "MEDIA_IMAGE_MAX_SIDE", 1920)
    try:
        side = int(raw)
    except Exception:
        side = 1920
    return max(320, min(8192, side))


def _image_quality() -> int:
    raw = os.environ.get("MEDIA_IMAGE_QUALITY") or getattr(settings, "MEDIA_IMAGE_QUALITY", 92)
    try:
        quality = int(raw)
    except Exception:
        quality = 92
    return max(40, min(100, quality))


def _webp_method() -> int:
    raw = os.environ.get("MEDIA_IMAGE_WEBP_METHOD") or getattr(settings, "MEDIA_IMAGE_WEBP_METHOD", 6)
    try:
        method = int(raw)
    except Exception:
        method = 6
    return max(0, min(6, method))


def _alpha_lossless() -> bool:
    raw = os.environ.get("MEDIA_IMAGE_ALPHA_LOSSLESS")
    if raw is not None:
        return raw.lower() in ("1", "true", "yes", "on")
    return bool(getattr(settings, "MEDIA_IMAGE_ALPHA_LOSSLESS", True))


def apply_text_watermark(image: Image.Image, *, text: str | None = None) -> Image.Image:
    if not _watermark_enabled():
        return image

    watermark_text = (text or _watermark_text()).strip()
    if not watermark_text:
        return image

    base = image.convert("RGBA")
    w, h = base.size
    if w < 240 or h < 240:
        # Avoid making tiny images unreadable.
        return image

    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font_size = max(14, int(min(w, h) * 0.05))
    font = _load_font(font_size)

    # Measure text box.
    bbox = draw.textbbox((0, 0), watermark_text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    margin = max(10, int(min(w, h) * 0.03))
    x = w - tw - margin
    y = h - th - margin

    opacity = int(255 * _watermark_opacity())
    fill = (*_watermark_color(), opacity)
    shadow = (0, 0, 0, int(opacity * 0.55))

    # Shadow for readability.
    draw.text((x + 2, y + 2), watermark_text, font=font, fill=shadow)
    draw.text((x, y), watermark_text, font=font, fill=fill)

    out = Image.alpha_composite(base, overlay)
    return out.convert(image.mode) if image.mode in ("RGB", "L") else out


def apply_watermark(image: Image.Image, *, text: str | None = None) -> Image.Image:
    """
    Prefer logo watermark when MEDIA_WATERMARK_IMAGE_PATH is set; fallback to text.
    """
    with_logo = bool(_watermark_image_path())
    if with_logo:
        out = apply_logo_watermark(image)
        # If logo watermark couldn't be applied (missing file, too small...), fall back to text.
        if out is not image:
            return out
    return apply_text_watermark(image, text=text)


def process_image_upload(
    upload,
    *,
    max_size: tuple[int, int] | None = None,
    quality: int | None = None,
    watermark: bool = True,
) -> ProcessedUpload:
    """
    Normalize images:
    - EXIF transpose
    - constrain to max_size (default from MEDIA_IMAGE_MAX_SIDE)
    - convert to WEBP (high quality by default)
    - apply watermark (server-side) by default
    """

    img = Image.open(upload)
    img = ImageOps.exif_transpose(img)

    if max_size is None:
        side = _image_max_side()
        max_size = (side, side)
    if quality is None:
        quality = _image_quality()

    resample = Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS
    img.thumbnail(max_size, resample=resample)

    if watermark:
        img = apply_watermark(img)

    has_alpha = (
        img.mode in ("RGBA", "LA")
        or (img.mode == "P" and "transparency" in getattr(img, "info", {}))
    )

    buf = io.BytesIO()
    if has_alpha and _alpha_lossless():
        img.convert("RGBA").save(buf, format="WEBP", lossless=True, method=_webp_method())
    else:
        img.convert("RGB").save(buf, format="WEBP", quality=quality, method=_webp_method(), optimize=True)
    buf.seek(0)
    filename = f"{timezone.now().strftime('%Y%m%d%H%M%S')}.webp"
    return ProcessedUpload(content=ContentFile(buf.read()), filename=filename, content_type="image/webp")


def iter_uploads(files) -> Iterable:
    if not files:
        return []
    if hasattr(files, "getlist"):
        bulk = files.getlist("files") or []
        if bulk:
            return bulk
    single = files.get("file")
    return [single] if single else []
