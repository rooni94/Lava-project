import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/client";
import { bulkMediaDelete, updateMedia, uploadFile } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";

type MediaItem = { id: number; file: string; media_type: string; category?: string; title?: string };

enum MediaFilter {
  All = "all",
  Image = "image",
  Document = "document",
  Video = "video",
}

export default function DashboardMedia() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<MediaFilter>(MediaFilter.All);
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const { data, isLoading } = useQuery({
    queryKey: ["media", filter],
    queryFn: async (): Promise<MediaItem[]> => {
      const res = await api.get("/media/");
      let items = res.data.results ?? res.data;
      if (filter !== MediaFilter.All) items = items.filter((i: MediaItem) => i.media_type === filter);
      return items;
    },
  });

  const [selected, setSelected] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) return;
      return uploadFile(file);
    },
    onSuccess: () => {
      toast.success(t("تم رفع الملف بنجاح", "File uploaded"));
      setFile(null);
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error(t("تعذر رفع الملف", "Upload failed")),
  });

  const bulkDelete = useMutation({
    mutationFn: () => bulkMediaDelete(selected),
    onSuccess: () => {
      toast.success(t("تم حذف العناصر المحددة", "Selected items deleted"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete selection")),
  });

  const saveMeta = useMutation({
    mutationFn: () => (editingId ? updateMedia(editingId, { title, category }) : Promise.resolve()),
    onSuccess: () => {
      toast.success(t("تم تحديث البيانات", "Metadata saved"));
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error(t("تعذر التحديث", "Unable to save metadata")),
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("المكتبة", "Media library")}</h1>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as MediaFilter)}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            >
              <option value={MediaFilter.All}>{t("الكل", "All")}</option>
              <option value={MediaFilter.Image}>{t("صور", "Images")}</option>
              <option value={MediaFilter.Document}>{t("مستندات", "Documents")}</option>
              <option value={MediaFilter.Video}>{t("فيديو", "Videos")}</option>
            </select>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <button onClick={() => upload.mutate()} className="px-4 py-2 rounded-lg bg-primary text-white" disabled={!file}>
              {t("رفع ملف", "Upload file")}
            </button>
            {selected.length > 0 && (
              <button onClick={() => bulkDelete.mutate()} className="px-4 py-2 rounded-lg bg-red-100 text-red-700">
                {t("حذف المحدد", "Delete selected")} ({selected.length})
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("عنوان", "Title")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("تصنيف", "Category")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <button onClick={() => saveMeta.mutate()} disabled={!editingId} className="px-4 py-2 rounded-lg bg-primary text-white">
              {t("حفظ بيانات العنصر", "Save metadata")}
            </button>
          </div>
          <h2 className="text-lg font-semibold text-secondary dark:text-neutral-50">{t("قائمة الوسائط", "Media items")}</h2>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {data?.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-3 space-y-2 ${selected.includes(item.id) ? "ring-2 ring-primary" : ""} border-accent/30 dark:border-neutral-800 bg-white dark:bg-neutral-900`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-secondary dark:text-neutral-50">{item.title || t("ملف بدون عنوان", "Untitled file")}</p>
                      <p className="text-xs text-secondary/60 dark:text-neutral-300">{item.category || t("عام", "General")}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={(e) =>
                        setSelected((prev) => (e.target.checked ? [...prev, item.id] : prev.filter((id) => id !== item.id)))
                      }
                    />
                  </div>
                  <a href={item.file} target="_blank" rel="noreferrer" className="text-primary text-sm underline">
                    {t("فتح الملف", "Open file")}
                  </a>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setTitle(item.title || "");
                        setCategory(item.category || "");
                      }}
                      className="text-blue-600 dark:text-blue-400 text-xs"
                    >
                      {t("تعديل البيانات", "Edit metadata")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
