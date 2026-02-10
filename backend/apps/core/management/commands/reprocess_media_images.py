from __future__ import annotations

from django.core.management.base import BaseCommand

from apps.core.media_utils import process_image_upload
from apps.core.models import MediaFile


class Command(BaseCommand):
    help = "Reprocess image items in the media library (optimize + apply watermark)."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=0, help="Process at most N images (0 = no limit).")
        parser.add_argument("--dry-run", action="store_true", help="Show what would happen without saving files.")
        parser.add_argument(
            "--no-watermark",
            action="store_true",
            help="Optimize images without applying a watermark.",
        )

    def handle(self, *args, **options):
        limit: int = int(options["limit"] or 0)
        dry_run: bool = bool(options["dry_run"])
        watermark: bool = not bool(options["no_watermark"])

        qs = MediaFile.objects.filter(media_type=MediaFile.MediaType.IMAGE).order_by("id")
        total = qs.count() if limit <= 0 else min(limit, qs.count())

        self.stdout.write(f"Found {total} image(s) to process.")
        processed = 0
        failed = 0

        if limit > 0:
            items = list(qs[:limit])
        else:
            items = qs.iterator(chunk_size=200)

        for mf in items:
            try:
                old_name = mf.file.name
                with mf.file.open("rb") as f:
                    processed_upload = process_image_upload(f, watermark=watermark)

                if dry_run:
                    self.stdout.write(f"[dry-run] {mf.id}: {old_name} -> {processed_upload.filename}")
                else:
                    mf.file.save(processed_upload.filename, processed_upload.content, save=True)
                    try:
                        if old_name and old_name != mf.file.name:
                            mf.file.storage.delete(old_name)
                    except Exception:
                        # Best effort: don't fail the whole command due to storage delete issues.
                        pass
                    self.stdout.write(f"{mf.id}: {old_name} -> {mf.file.name}")
                processed += 1
            except Exception as e:
                failed += 1
                self.stderr.write(f"Failed {mf.id} ({getattr(mf.file, 'name', '')}): {e}")

        self.stdout.write(f"Done. processed={processed}, failed={failed}")

