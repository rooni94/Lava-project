import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  images: string[];
  startIndex?: number;
  title?: string;
  onClose: () => void;
};

export default function ImageLightbox({ open, images, startIndex = 0, title, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const maxIndex = Math.max(0, safeImages.length - 1);

  useEffect(() => {
    if (!open) return;
    setIndex(Math.min(Math.max(0, startIndex), maxIndex));
  }, [open, startIndex, maxIndex]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i <= 0 ? maxIndex : i - 1));
      if (e.key === "ArrowRight") setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, maxIndex, onClose]);

  if (typeof document === "undefined") return null;
  const current = safeImages[index];
  const labelGallery = isAr ? "المعرض" : "Gallery";
  const labelPreview = isAr ? "معاينة" : "Preview";
  const labelClose = isAr ? "إغلاق" : "Close";
  const labelPrev = isAr ? "السابق" : "Prev";
  const labelNext = isAr ? "التالي" : "Next";

  return createPortal(
    <AnimatePresence>
      {open && safeImages.length > 0 ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-6xl"
            initial={{ y: 18, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-rose-500/10" />

              <div className="relative flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/60">{labelGallery}</div>
                  <div className="truncate text-white font-semibold">
                    {title || labelPreview} <span className="text-white/50 text-sm">({index + 1}/{safeImages.length})</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10"
                >
                  {labelClose}
                </button>
              </div>

              <div className="relative grid lg:grid-cols-[64px_1fr_64px] items-center">
                <button
                  type="button"
                  aria-label={labelPrev}
                  onClick={() => setIndex((i) => (i <= 0 ? maxIndex : i - 1))}
                  className="hidden lg:flex h-full items-center justify-center text-white/70 hover:text-white"
                >
                  <span className="text-3xl leading-none select-none">‹</span>
                </button>

                <div className="relative px-3 py-4">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    <img
                      key={current}
                      src={current}
                      alt={title || "Image"}
                      className="w-full max-h-[76vh] object-contain bg-black"
                      draggable={false}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setIndex((i) => (i <= 0 ? maxIndex : i - 1))}
                      className="lg:hidden px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10"
                    >
                      {labelPrev}
                    </button>
                    <div className="flex-1 overflow-x-auto">
                      <div className="flex gap-2 min-w-max">
                        {safeImages.map((src, i) => (
                          <button
                            key={src + i}
                            type="button"
                            onClick={() => setIndex(i)}
                            className={`h-12 w-16 rounded-xl overflow-hidden border transition ${
                              i === index ? "border-primary ring-2 ring-primary/40" : "border-white/10 hover:border-white/20"
                            }`}
                            aria-label={`Go to image ${i + 1}`}
                          >
                            <img src={src} alt="" className="h-full w-full object-cover" draggable={false} loading="lazy" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIndex((i) => (i >= maxIndex ? 0 : i + 1))}
                      className="lg:hidden px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10"
                    >
                      {labelNext}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={labelNext}
                  onClick={() => setIndex((i) => (i >= maxIndex ? 0 : i + 1))}
                  className="hidden lg:flex h-full items-center justify-center text-white/70 hover:text-white"
                >
                  <span className="text-3xl leading-none select-none">›</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
