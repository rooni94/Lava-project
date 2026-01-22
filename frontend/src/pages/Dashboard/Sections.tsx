import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import SectionTitle from "../../components/ui/SectionTitle";
import Skeleton from "../../components/ui/Skeleton";
import RichEditor from "../../components/dashboard/RichEditor";
import { createSection, deleteSection, fetchPages, fetchSections, reorderSections, updateSection } from "../../api/endpoints";
import toast from "react-hot-toast";
import { Page, Section } from "../../types";

export default function DashboardSections() {
  const qc = useQueryClient();
  const { data: pages } = useQuery<Page[]>({ queryKey: ["pages-admin"], queryFn: fetchPages });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [pageId, setPageId] = useState<number | null>(null);

  useEffect(() => {
    if (!pageId && pages?.length) setPageId(pages[0].id);
  }, [pages, pageId]);

  const { data: sections, isLoading } = useQuery<Section[]>({
    queryKey: ["sections", pageId],
    queryFn: () => fetchSections(pageId || undefined),
    enabled: !!pageId,
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const save = useMutation({
    mutationFn: () =>
      editingId
        ? updateSection(editingId, { title, content, order, page: pageId })
        : createSection({ title, content, order, page: pageId }),
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث القسم", "Section updated") : t("تم إضافة القسم", "Section added"));
      setTitle("");
      setContent("");
      setOrder(0);
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["sections", pageId] });
    },
    onError: () => toast.error(t("تعذر الحفظ", "Unable to save section")),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteSection(id),
    onSuccess: () => {
      toast.success(t("تم حذف القسم", "Section deleted"));
      qc.invalidateQueries({ queryKey: ["sections", pageId] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete section")),
  });

  const reorderMut = useMutation({
    mutationFn: (orders: { id: number; order: number }[]) => reorderSections(orders),
    onSuccess: () => {
      toast.success(t("تم تحديث ترتيب الأقسام", "Order updated"));
      qc.invalidateQueries({ queryKey: ["sections", pageId] });
    },
    onError: () => toast.error(t("تعذر تحديث الترتيب", "Unable to update order")),
  });

  const bulkOrders = useMemo(() => sections?.map((s, idx) => ({ id: s.id, order: idx + 1 })) ?? [], [sections]);

  const startEditSelected = () => {
    if (selected.length !== 1) return;
    const sec = sections?.find((s) => s.id === selected[0]);
    if (sec) {
      setEditingId(sec.id);
      setTitle(sec.title);
      setContent(sec.content);
      setOrder(sec.order);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "الأقسام" : "Sections"}
          subtitle={isAr ? "إنشاء وتعديل وترتيب أقسام الصفحات." : "Create, edit, and reorder page sections."}
        />
        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3">
          <label className="block text-sm mb-1">{t("اختر الصفحة", "Select page")}</label>
          <select
            value={pageId ?? ""}
            onChange={(e) => setPageId(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          >
            <option value="" disabled>
              {t("اختر الصفحة", "Choose page")}
            </option>
            {pages?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("عنوان القسم", "Section title")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            placeholder={t("الترتيب", "Order")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <RichEditor value={content} onChange={setContent} placeholder={t("المحتوى التفصيلي / WYSIWYG", "Detailed content / WYSIWYG")} />
          <button onClick={() => save.mutate()} className="bg-primary text-white px-4 py-2 rounded-lg" disabled={!pageId || !title}>
            {editingId ? t("حفظ التعديل", "Save changes") : t("إضافة القسم", "Add section")}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
                setOrder(0);
              }}
              className="text-sm text-secondary dark:text-neutral-300 underline"
            >
              {t("إلغاء التعديل", "Cancel editing")}
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4">
          <div className="flex gap-2 flex-wrap mb-3">
            <button
              disabled={selected.length !== 1}
              onClick={startEditSelected}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-60"
            >
              {t("تعديل المحدد", "Edit selected")}
            </button>
            {sections?.length ? (
              <button onClick={() => reorderMut.mutate(bulkOrders)} className="px-3 py-1 bg-gray-100 text-secondary rounded">
                {t("تطبيق ترتيب تلقائي", "Apply automatic order")}
              </button>
            ) : null}
          </div>
          <h2 className="text-lg font-semibold mb-3 text-secondary dark:text-neutral-50">{t("الأقسام الحالية", "Current sections")}</h2>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="space-y-3">
              {sections?.map((sec) => (
                <div key={sec.id} className="border rounded-lg border-accent/30 dark:border-neutral-800 p-3 flex justify-between items-center bg-white dark:bg-neutral-900">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(sec.id)}
                      onChange={(e) =>
                        setSelected((prev) => (e.target.checked ? [...prev, sec.id] : prev.filter((id) => id !== sec.id)))
                      }
                    />
                    <div>
                      <p className="font-bold text-secondary dark:text-neutral-50">
                        {sec.order}. {sec.title}
                      </p>
                      <p className="text-xs text-secondary/70 dark:text-neutral-300">{t("معرف الصفحة:", "Page ID:")} {sec.page}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(sec.id);
                        setTitle(sec.title);
                        setContent(sec.content);
                        setOrder(sec.order);
                      }}
                      className="text-blue-600 dark:text-blue-400 text-sm"
                    >
                      {t("تعديل", "Edit")}
                    </button>
                    <button onClick={() => deleteMut.mutate(sec.id)} className="text-red-600 dark:text-red-400 text-sm">
                      {t("حذف", "Delete")}
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
