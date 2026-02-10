import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { isVideoUrl } from "../../utils/media";

type Props = {
  open: boolean;
  images: string[];
  startIndex?: number;
  title?: string;
  onClose: () => void;
};

export default function ImageLightbox({ open, images, startIndex = 0, title, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; panX: number; panY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
  });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const maxIndex = Math.max(0, safeImages.length - 1);

  useEffect(() => {
    if (!open) return;
    setIndex(Math.min(Math.max(0, startIndex), maxIndex));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [open, startIndex, maxIndex]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIndex((i) => (i <= 0 ? maxIndex : i - 1));
      }
      if (e.key === "ArrowRight") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIndex((i) => (i >= maxIndex ? 0 : i + 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, maxIndex, onClose]);

  if (typeof document === "undefined") return null;
  const current = safeImages[index];
  const isVideo = isVideoUrl(current);
  const labelGallery = isAr ? "المعرض" : "Gallery";
  const labelPreview = isAr ? "معاينة" : "Preview";
  const labelClose = isAr ? "إغلاق" : "Close";
  const labelPrev = isAr ? "السابق" : "Prev";
  const labelNext = isAr ? "التالي" : "Next";
  const labelZoomIn = isAr ? "تكبير" : "Zoom in";
  const labelZoomOut = isAr ? "تصغير" : "Zoom out";
  const labelReset = isAr ? "إعادة" : "Reset";
  const canZoomOut = !isVideo && zoom > 1.01;
  const canZoomIn = !isVideo && zoom < 3.99;

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
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl flex flex-col h-[min(900px,calc(100vh-2rem))]">
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

              <div className="relative grid lg:grid-cols-[64px_minmax(0,1fr)_64px] items-stretch flex-1 min-h-0">
                <button
                  type="button"
                  aria-label={labelPrev}
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
                  }}
                  className="hidden lg:flex h-full items-center justify-center text-white/70 hover:text-white self-stretch"
                >
                  <span className="text-3xl leading-none select-none">‹</span>
                </button>

                <div className="relative px-3 py-4 flex flex-col min-h-0 min-w-0">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 flex-1 min-h-0">
                    <div
                      className={`relative w-full h-full bg-black select-none overflow-hidden ${isVideo ? "touch-auto" : "touch-none"}`}
                      onWheel={(e) => {
                        if (!open) return;
                        if (isVideo) return;
                        e.preventDefault();
                        const delta = e.deltaY;
                        const next = delta > 0 ? Math.max(1, zoom - 0.15) : Math.min(4, zoom + 0.15);
                        setZoom(next);
                        if (next <= 1.01) setPan({ x: 0, y: 0 });
                      }}
                      onPointerDown={(e) => {
                        if (isVideo) return;
                        if (zoom <= 1.01) return;
                        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                        dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
                      }}
                      onPointerMove={(e) => {
                        if (isVideo) return;
                        if (!dragRef.current.active) return;
                        const dx = e.clientX - dragRef.current.startX;
                        const dy = e.clientY - dragRef.current.startY;
                        setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
                      }}
                      onPointerUp={() => (dragRef.current.active = false)}
                      onPointerCancel={() => (dragRef.current.active = false)}
                      onDoubleClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                      }}
                    >
                      {isVideo ? (
                        <video
                          key={current}
                          src={current}
                          controls
                          playsInline
                          className="block max-h-full max-w-full w-auto h-auto bg-black m-auto"
                        />
                      ) : (
                        <img
                          key={current}
                          src={current}
                          alt={title || "Image"}
                          className="absolute inset-0 w-full h-full object-contain bg-black"
                          style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transformOrigin: "center center",
                            transition: dragRef.current.active ? "none" : "transform 120ms ease-out",
                            willChange: "transform",
                          }}
                          draggable={false}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                        setIndex((i) => (i <= 0 ? maxIndex : i - 1));
                      }}
                      className="lg:hidden px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10"
                    >
                      {labelPrev}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (isVideo) return;
                          const next = Math.max(1, zoom - 0.25);
                          setZoom(next);
                          if (next <= 1.01) setPan({ x: 0, y: 0 });
                        }}
                        disabled={!canZoomOut}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 disabled:opacity-50 disabled:hover:bg-white/10"
                      >
                        - {labelZoomOut}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isVideo) return;
                          setZoom((z) => Math.min(4, z + 0.25));
                        }}
                        disabled={!canZoomIn}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 disabled:opacity-50 disabled:hover:bg-white/10"
                      >
                        + {labelZoomIn}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setZoom(1);
                          setPan({ x: 0, y: 0 });
                        }}
                        className="hidden sm:inline-flex px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10"
                      >
                        {labelReset}
                      </button>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                      <div className="flex gap-2 min-w-max">
                        {safeImages.map((src, i) => (
                          <button
                            key={src + i}
                            type="button"
                            onClick={() => {
                              setIndex(i);
                              setZoom(1);
                              setPan({ x: 0, y: 0 });
                            }}
                            className={`h-12 w-16 rounded-xl overflow-hidden border transition ${
                              i === index ? "border-primary ring-2 ring-primary/40" : "border-white/10 hover:border-white/20"
                            }`}
                            aria-label={`Go to image ${i + 1}`}
                          >
                            {isVideoUrl(src) ? (
                              <div className="relative h-full w-full bg-black/90 flex items-center justify-center text-white/80">
                                <span className="text-[10px] tracking-widest">VIDEO</span>
                              </div>
                            ) : (
                              <img src={src} alt="" className="h-full w-full object-contain bg-black" draggable={false} loading="lazy" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                        setIndex((i) => (i >= maxIndex ? 0 : i + 1));
                      }}
                      className="lg:hidden px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10"
                    >
                      {labelNext}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={labelNext}
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
                  }}
                  className="hidden lg:flex h-full items-center justify-center text-white/70 hover:text-white self-stretch"
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
