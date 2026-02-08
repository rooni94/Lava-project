import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { createPage, createSection, deletePage, fetchPages, updatePage } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import RichEditor from "../../components/dashboard/RichEditor";
import { Page } from "../../types";

export default function DashboardPages() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Page[]>({ queryKey: ["pages-admin"], queryFn: fetchPages });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [meta, setMeta] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const save = useMutation({
    mutationFn: async () => {
      if (editingId) {
        await updatePage(editingId, { name: title, slug, title, meta_description: meta, status });
      } else {
        const { data: created } = await createPage({ name: title, slug, title, meta_description: meta, status });
        if (content) {
          await createSection({ page: created.id, title, content, order: 0 });
        }
      }
    },
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث الصفحة", "Page updated") : t("تم إنشاء صفحة جديدة", "Page created"));
      setTitle("");
      setSlug("");
      setMeta("");
      setContent("");
      setStatus("published");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["pages-admin"] });
    },
    onError: () => toast.error(t("تعذر الحفظ", "Unable to save page")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deletePage(id),
    onSuccess: () => {
      toast.success(t("تم حذف الصفحة", "Page deleted"));
      qc.invalidateQueries({ queryKey: ["pages-admin"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete page")),
  });

  const bulkStatus = useMutation({
    mutationFn: (nextStatus: "published" | "draft") => Promise.all(selected.map((id) => updatePage(id, { status: nextStatus }))),
    onSuccess: () => {
      toast.success(t("تم تحديث الحالة", "Status updated"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["pages-admin"] });
    },
    onError: () => toast.error(t("تعذر تحديث الحالة", "Unable to update status")),
  });

  const startEditSelected = (id?: number) => {
    const targetId = id ?? (selected.length === 1 ? selected[0] : null);
    if (!targetId) return;
    const page = data?.find((p) => p.id === targetId);
    if (page) {
      setEditingId(page.id);
      setTitle(page.title);
      setSlug(page.slug);
      setMeta(page.meta_description || "");
      setContent("");
      setStatus((page.status as "published" | "draft") || "published");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("الصفحات", "Pages")}</h1>
        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("عنوان الصفحة", "Page title")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={t("المسار (slug)", "Slug")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <input
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            placeholder={t("وصف ميتا", "Meta description")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          >
            <option value="published">{t("\u0645\u0646\u0634\u0648\u0631\u0629", "Published")}</option>
            <option value="draft">{t("\u0645\u0633\u0648\u062f\u0629", "Draft")}</option>
          </select>
          {!editingId && <RichEditor value={content} onChange={setContent} placeholder={t("محتوى أولي (اختياري)", "Initial content (optional)")} />}
          <button onClick={() => save.mutate()} className="bg-primary text-white px-4 py-2 rounded-lg" disabled={!title || !slug}>
            {editingId ? t("حفظ التعديلات", "Save changes") : t("إضافة صفحة", "Add page")}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setSlug("");
                setMeta("");
                setContent("");
                setStatus("published");
              }}
              className="text-sm text-secondary dark:text-neutral-300 underline"
            >
              {t("إلغاء التعديل", "Cancel editing")}
            </button>
          )}
        </div>
        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 shadow-sm">
          <div className="flex gap-2 flex-wrap mb-3">
            <button
              disabled={!selected.length}
              onClick={() => bulkStatus.mutate("published")}
              className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-60"
            >
              {t("نشر", "Publish")}
            </button>
            <button
              disabled={!selected.length}
              onClick={() => bulkStatus.mutate("draft")}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded disabled:opacity-60"
            >
              {t("تعطيل", "Disable")}
            </button>
            <button
              disabled={selected.length !== 1}
              onClick={() => startEditSelected()}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-60"
            >
              {t("تعديل", "Edit")}
            </button>
            <button
              disabled={!selected.length}
              onClick={() => selected.forEach((id) => remove.mutate(id))}
              className="px-3 py-1 bg-red-100 text-red-700 rounded disabled:opacity-60"
            >
              {t("حذف المحدد", "Delete selected")}
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-3 text-secondary dark:text-neutral-50">{t("قائمة الصفحات", "Pages list")}</h2>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-2">
              {data?.map((p) => (
                <label key={p.id} className="flex items-center justify-between border-b border-accent/20 dark:border-neutral-800 py-2 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={(e) =>
                        setSelected((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)))
                      }
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-secondary dark:text-neutral-50">{p.title}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                          {p.status === "published" ? t("منشورة", "Published") : t("مسودة", "Draft")}
                        </span>
                      </div>
                      <p className="text-sm text-secondary/70 dark:text-neutral-300">{p.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditSelected(p.id)} className="text-blue-600 dark:text-blue-400 text-sm">
                      {t("تعديل", "Edit")}
                    </button>
                    <button onClick={() => remove.mutate(p.id)} className="text-red-600 dark:text-red-400 text-sm">
                      {t("حذف", "Delete")}
                    </button>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
