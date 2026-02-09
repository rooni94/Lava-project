import { useCallback, useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { CropArea, cropImageToBlob } from "../../utils/cropImage";

export default function ImageCropModal({
  open,
  imageUrl,
  title,
  onClose,
  onSave,
}: {
  open: boolean;
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
  onSave: (file: File) => Promise<void> | void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropPixels, setCropPixels] = useState<CropArea | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => Boolean(open && imageUrl && cropPixels && !saving), [open, imageUrl, cropPixels, saving]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCropPixels(croppedAreaPixels as CropArea);
  }, []);

  const save = async () => {
    if (!imageUrl || !cropPixels) return;
    setSaving(true);
    try {
      const blob = await cropImageToBlob(imageUrl, cropPixels, rotation);
      const file = new File([blob], "edited.webp", { type: blob.type || "image/webp" });
      await onSave(file);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-neutral-950 rounded-2xl border border-accent/30 dark:border-neutral-800 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-accent/30 dark:border-neutral-800">
          <div className="font-semibold text-secondary dark:text-neutral-50">{title || "Edit image"}</div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border border-accent/30 dark:border-neutral-800">
            Close
          </button>
        </div>

        <div className="relative h-[420px] bg-black">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm text-secondary dark:text-neutral-100">
              Zoom
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="text-sm text-secondary dark:text-neutral-100">
              Rotation
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-accent/30 dark:border-neutral-800">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!canSave}
              className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>

          <p className="text-xs text-secondary/60 dark:text-neutral-400">
            Note: watermark is applied automatically when the image is saved.
          </p>
        </div>
      </div>
    </div>
  );
}
