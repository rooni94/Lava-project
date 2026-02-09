import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/client";
import { bulkMediaDelete, bulkUploadMedia, replaceMediaFile, updateMedia } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import ImageCropModal from "../../components/dashboard/ImageCropModal";

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
  const [files, setFiles] = useState<FileList | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<MediaItem | null>(null);

  const upload = useMutation({
    mutationFn: async () => {
      const list = files ? Array.from(files) : [];
      if (!list.length) return;
      return bulkUploadMedia(list, { category });
    },
    onSuccess: () => {
      toast.success(t("تم رفع الملفات", "Files uploaded"));
      setFiles(null);
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error(t("فشل الرفع", "Upload failed")),
  });

  const replaceFile = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => replaceMediaFile(id, file),
    onSuccess: () => {
      toast.success(t("تم تحديث الصورة", "Image updated"));
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error(t("تعذر تحديث الصورة", "Unable to update image")),
  });

  const bulkDelete = useMutation({
    mutationFn: () => bulkMediaDelete(selected),
    onSuccess: () => {
      toast.success(t("تم حذف العناصر المحددة", "Selected items deleted"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error(t("تعذر حذف العناصر المحددة", "Unable to delete selection")),
  });

  const saveMeta = useMutation({
    mutationFn: () => (editingId ? updateMedia(editingId, { title, category }) : Promise.resolve()),
    onSuccess: () => {
      toast.success(t("تم حفظ البيانات", "Metadata saved"));
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error(t("تعذر حفظ البيانات", "Unable to save metadata")),
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("مكتبة الوسائط", "Media library")}</h1>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as MediaFilter)}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            >
              <option value={MediaFilter.All}>{t("الكل", "All")}</option>
              <option value={MediaFilter.Image}>{t("الصور", "Images")}</option>
              <option value={MediaFilter.Document}>{t("المستندات", "Documents")}</option>
              <option value={MediaFilter.Video}>{t("الفيديوهات", "Videos")}</option>
            </select>

            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("التصنيف (اختياري)", "Category (optional)")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />

            <button
              onClick={() => upload.mutate()}
              className="px-4 py-2 rounded-lg bg-primary text-white"
              disabled={!files?.length}
            >
              {t("رفع ملفات", "Upload files")}
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
              placeholder={t("العنوان", "Title")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("التصنيف", "Category")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <button
              onClick={() => saveMeta.mutate()}
              disabled={!editingId}
              className="px-4 py-2 rounded-lg bg-primary text-white"
            >
              {t("حفظ البيانات", "Save metadata")}
            </button>
          </div>

          <h2 className="text-lg font-semibold text-secondary dark:text-neutral-50">{t("عناصر الوسائط", "Media items")}</h2>

          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {data?.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-3 space-y-2 ${selected.includes(item.id) ? "ring-2 ring-primary" : ""} border-accent/30 dark:border-neutral-800 bg-white dark:bg-neutral-900`}
                >
                  {item.media_type === "image" && (
                    <img
                      src={item.file}
                      alt={item.title || "Media"}
                      className="w-full h-40 object-cover rounded-lg border border-accent/30 dark:border-neutral-800"
                      loading="lazy"
                    />
                  )}

                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-secondary dark:text-neutral-50">
                        {item.title || t("ملف بدون عنوان", "Untitled file")}
                      </p>
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

                    {item.media_type === "image" && (
                      <button
                        onClick={() => {
                          setCropTarget(item);
                          setCropOpen(true);
                        }}
                        className="text-secondary dark:text-neutral-200 text-xs underline"
                      >
                        {t("قص/تحرير", "Crop/edit")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ImageCropModal
        open={cropOpen}
        imageUrl={cropTarget?.file || null}
        title={t("تعديل الصورة", "Edit image")}
        onClose={() => {
          setCropOpen(false);
          setCropTarget(null);
        }}
        onSave={async (file) => {
          if (!cropTarget) return;
          await replaceFile.mutateAsync({ id: cropTarget.id, file });
        }}
      />
    </DashboardLayout>
  );
}
