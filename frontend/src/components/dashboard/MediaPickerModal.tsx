import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../../api/client";

type MediaItem = { id: number; file: string; media_type: string; title?: string; category?: string };

export default function MediaPickerModal({
  open,
  title,
  allowedTypes = ["image", "video"],
  onClose,
  onPick,
}: {
  open: boolean;
  title?: string;
  allowedTypes?: string[];
  onClose: () => void;
  onPick: (urls: string[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const { data, isLoading } = useQuery({
    queryKey: ["media-picker", allowedTypes.join(",")],
    enabled: open,
    queryFn: async (): Promise<MediaItem[]> => {
      const res = await api.get("/media/");
      return res.data.results ?? res.data;
    },
  });

  const items = useMemo(() => {
    const list = (data || []).filter((i) => allowedTypes.includes(i.media_type));
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((i) => (i.title || "").toLowerCase().includes(q) || (i.category || "").toLowerCase().includes(q));
  }, [data, query, allowedTypes]);

  const filteredItems = useMemo(() => {
    if (typeFilter === "all") return items;
    return items.filter((i) => i.media_type === typeFilter);
  }, [items, typeFilter]);

  const pick = () => {
    const urls = (data || [])
      .filter((i) => selected.includes(i.id))
      .map((i) => i.file)
      .filter(Boolean);
    onPick(urls);
    setSelected([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-neutral-950 rounded-2xl border border-accent/30 dark:border-neutral-800 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-accent/30 dark:border-neutral-800">
          <div className="font-semibold text-secondary dark:text-neutral-50">{title || t("اختيار الوسائط", "Pick media")}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1 rounded-lg border border-accent/30 dark:border-neutral-800">
              {t("إغلاق", "Close")}
            </button>
            <button
              onClick={pick}
              disabled={!selected.length}
              className="px-3 py-1 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              {t("إضافة", "Add")} ({selected.length})
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("بحث بالعنوان أو التصنيف...", "Search by title or category...")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-800"
          />

          {isLoading ? (
            <div className="text-sm text-secondary/70 dark:text-neutral-300">{t("جاري التحميل...", "Loading...")}</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-secondary/70 dark:text-neutral-300">{t("لا توجد وسائط.", "No media found.")}</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg border text-sm ${
                    typeFilter === "all" ? "bg-primary text-white border-primary" : "border-accent/30 dark:border-neutral-800"
                  }`}
                >
                  {t("الكل", "All")}
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("image")}
                  disabled={!allowedTypes.includes("image")}
                  className={`px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 ${
                    typeFilter === "image" ? "bg-primary text-white border-primary" : "border-accent/30 dark:border-neutral-800"
                  }`}
                >
                  {t("صور", "Images")}
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("video")}
                  disabled={!allowedTypes.includes("video")}
                  className={`px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 ${
                    typeFilter === "video" ? "bg-primary text-white border-primary" : "border-accent/30 dark:border-neutral-800"
                  }`}
                >
                  {t("فيديو", "Videos")}
                </button>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-sm text-secondary/70 dark:text-neutral-300">{t("لا توجد نتائج مطابقة.", "No matching media.")}</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setSelected((prev) =>
                          prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                        )
                      }
                      className={`text-left border rounded-xl overflow-hidden bg-white dark:bg-neutral-900 ${
                        selected.includes(item.id) ? "ring-2 ring-primary" : "border-accent/30 dark:border-neutral-800"
                      }`}
                    >
                      <div className="relative w-full h-28 bg-black/80">
                        {item.media_type === "video" ? (
                          <>
                            <video src={item.file} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                            <div className="absolute inset-0 flex items-center justify-center text-white/90 text-2xl">▶</div>
                          </>
                        ) : (
                          <img src={item.file} alt={item.title || "Media"} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-semibold text-secondary dark:text-neutral-50 truncate">
                          {item.title || t("بدون عنوان", "Untitled")}
                        </div>
                        <div className="text-[11px] text-secondary/60 dark:text-neutral-400 truncate">{item.category || t("عام", "General")}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
