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
  const [titleEn, setTitleEn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [sectionType, setSectionType] = useState("");
  const [extraBase, setExtraBase] = useState<Record<string, unknown>>({});
  const [logoUrl, setLogoUrl] = useState("");
  const [logoAltAr, setLogoAltAr] = useState("");
  const [logoAltEn, setLogoAltEn] = useState("");
  const [logoHeight, setLogoHeight] = useState("");
  const [linksTitleAr, setLinksTitleAr] = useState("");
  const [linksTitleEn, setLinksTitleEn] = useState("");
  const [linksItems, setLinksItems] = useState("");
  const [newsletterTitleAr, setNewsletterTitleAr] = useState("");
  const [newsletterTitleEn, setNewsletterTitleEn] = useState("");
  const [newsletterBodyAr, setNewsletterBodyAr] = useState("");
  const [newsletterBodyEn, setNewsletterBodyEn] = useState("");
  const [newsletterPlaceholderAr, setNewsletterPlaceholderAr] = useState("");
  const [newsletterPlaceholderEn, setNewsletterPlaceholderEn] = useState("");
  const [newsletterButtonAr, setNewsletterButtonAr] = useState("");
  const [newsletterButtonEn, setNewsletterButtonEn] = useState("");
  const [newsletterSuccessAr, setNewsletterSuccessAr] = useState("");
  const [newsletterSuccessEn, setNewsletterSuccessEn] = useState("");
  const [paymentsTitleAr, setPaymentsTitleAr] = useState("");
  const [paymentsTitleEn, setPaymentsTitleEn] = useState("");
  const [order, setOrder] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const buildExtra = () => {
    const nextExtra: Record<string, unknown> = { ...extraBase };
    const setOrDelete = (key: string, value?: string) => {
      if (value) {
        nextExtra[key] = value;
      } else {
        delete nextExtra[key];
      }
    };
    setOrDelete("title_en", titleEn);
    setOrDelete("content_en", contentEn);
    setOrDelete("logo_url", logoUrl);
    setOrDelete("logo_alt_ar", logoAltAr);
    setOrDelete("logo_alt_en", logoAltEn);
    setOrDelete("logo_height", logoHeight);
    setOrDelete("links_title_ar", linksTitleAr);
    setOrDelete("links_title_en", linksTitleEn);
    setOrDelete("links_items", linksItems);
    setOrDelete("newsletter_title_ar", newsletterTitleAr);
    setOrDelete("newsletter_title_en", newsletterTitleEn);
    setOrDelete("newsletter_body_ar", newsletterBodyAr);
    setOrDelete("newsletter_body_en", newsletterBodyEn);
    setOrDelete("newsletter_placeholder_ar", newsletterPlaceholderAr);
    setOrDelete("newsletter_placeholder_en", newsletterPlaceholderEn);
    setOrDelete("newsletter_button_ar", newsletterButtonAr);
    setOrDelete("newsletter_button_en", newsletterButtonEn);
    setOrDelete("newsletter_success_ar", newsletterSuccessAr);
    setOrDelete("newsletter_success_en", newsletterSuccessEn);
    setOrDelete("payments_title_ar", paymentsTitleAr);
    setOrDelete("payments_title_en", paymentsTitleEn);
    return nextExtra;
  };

  const save = useMutation({
    mutationFn: () =>
      editingId
        ? updateSection(editingId, { title, content, order, page: pageId, section_type: sectionType, extra: buildExtra() })
        : createSection({ title, content, order, page: pageId, section_type: sectionType, extra: buildExtra() }),
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث القسم", "Section updated") : t("تم إضافة القسم", "Section added"));
      setTitle("");
      setContent("");
      setTitleEn("");
      setContentEn("");
      setSectionType("");
      setExtraBase({});
      setLogoUrl("");
      setLogoAltAr("");
      setLogoAltEn("");
      setLogoHeight("");
      setLinksTitleAr("");
      setLinksTitleEn("");
      setLinksItems("");
      setNewsletterTitleAr("");
      setNewsletterTitleEn("");
      setNewsletterBodyAr("");
      setNewsletterBodyEn("");
      setNewsletterPlaceholderAr("");
      setNewsletterPlaceholderEn("");
      setNewsletterButtonAr("");
      setNewsletterButtonEn("");
      setNewsletterSuccessAr("");
      setNewsletterSuccessEn("");
      setPaymentsTitleAr("");
      setPaymentsTitleEn("");
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
      setSectionType(sec.section_type || "");
      const extra = (sec.extra || {}) as Record<string, unknown>;
      setExtraBase(extra);
      setTitleEn((extra?.title_en as string) || "");
      setContentEn((extra?.content_en as string) || "");
      setLogoUrl((extra?.logo_url as string) || "");
      setLogoAltAr((extra?.logo_alt_ar as string) || "");
      setLogoAltEn((extra?.logo_alt_en as string) || "");
      setLogoHeight((extra?.logo_height as string) || "");
      setLinksTitleAr((extra?.links_title_ar as string) || "");
      setLinksTitleEn((extra?.links_title_en as string) || "");
      setLinksItems((extra?.links_items as string) || "");
      setNewsletterTitleAr((extra?.newsletter_title_ar as string) || "");
      setNewsletterTitleEn((extra?.newsletter_title_en as string) || "");
      setNewsletterBodyAr((extra?.newsletter_body_ar as string) || "");
      setNewsletterBodyEn((extra?.newsletter_body_en as string) || "");
      setNewsletterPlaceholderAr((extra?.newsletter_placeholder_ar as string) || "");
      setNewsletterPlaceholderEn((extra?.newsletter_placeholder_en as string) || "");
      setNewsletterButtonAr((extra?.newsletter_button_ar as string) || "");
      setNewsletterButtonEn((extra?.newsletter_button_en as string) || "");
      setNewsletterSuccessAr((extra?.newsletter_success_ar as string) || "");
      setNewsletterSuccessEn((extra?.newsletter_success_en as string) || "");
      setPaymentsTitleAr((extra?.payments_title_ar as string) || "");
      setPaymentsTitleEn((extra?.payments_title_en as string) || "");
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
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value)}
            placeholder={t("نوع القسم (مثال: hero)", "Section type (e.g. hero)")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("عنوان القسم", "Section title")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder={t("عنوان القسم بالإنجليزية (اختياري)", "Section title (English, optional)")}
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
          <RichEditor
            value={contentEn}
            onChange={setContentEn}
            placeholder={t("المحتوى بالإنجليزية (اختياري)", "English content (optional)")}
          />
          {sectionType === "header" && (
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder={t("رابط الشعار (Logo URL)", "Logo URL")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
              <input
                value={logoHeight}
                onChange={(e) => setLogoHeight(e.target.value)}
                placeholder={t("ارتفاع الشعار (مثال: 64)", "Logo height (e.g. 64)")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
              <input
                value={logoAltAr}
                onChange={(e) => setLogoAltAr(e.target.value)}
                placeholder={t("نص بديل للشعار بالعربية", "Logo alt text (Arabic)")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
              <input
                value={logoAltEn}
                onChange={(e) => setLogoAltEn(e.target.value)}
                placeholder={t("نص بديل للشعار بالإنجليزية", "Logo alt text (English)")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
            </div>
          )}
          {sectionType === "footer" && (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={linksTitleAr}
                  onChange={(e) => setLinksTitleAr(e.target.value)}
                  placeholder={t("عنوان عمود الروابط (عربي)", "Links column title (Arabic)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={linksTitleEn}
                  onChange={(e) => setLinksTitleEn(e.target.value)}
                  placeholder={t("عنوان عمود الروابط (إنجليزي)", "Links column title (English)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <textarea
                value={linksItems}
                onChange={(e) => setLinksItems(e.target.value)}
                placeholder={t(
                  "روابط الفوتر: كل سطر بصيغة label_ar|label_en|href",
                  "Footer links: each line as label_ar|label_en|href"
                )}
                className="w-full border rounded-lg px-3 py-2 min-h-[120px] bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={newsletterTitleAr}
                  onChange={(e) => setNewsletterTitleAr(e.target.value)}
                  placeholder={t("عنوان النشرة (عربي)", "Newsletter title (Arabic)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={newsletterTitleEn}
                  onChange={(e) => setNewsletterTitleEn(e.target.value)}
                  placeholder={t("عنوان النشرة (إنجليزي)", "Newsletter title (English)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={newsletterBodyAr}
                  onChange={(e) => setNewsletterBodyAr(e.target.value)}
                  placeholder={t("وصف النشرة (عربي)", "Newsletter description (Arabic)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={newsletterBodyEn}
                  onChange={(e) => setNewsletterBodyEn(e.target.value)}
                  placeholder={t("وصف النشرة (إنجليزي)", "Newsletter description (English)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={newsletterPlaceholderAr}
                  onChange={(e) => setNewsletterPlaceholderAr(e.target.value)}
                  placeholder={t("Placeholder البريد (عربي)", "Email placeholder (Arabic)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={newsletterPlaceholderEn}
                  onChange={(e) => setNewsletterPlaceholderEn(e.target.value)}
                  placeholder={t("Placeholder البريد (إنجليزي)", "Email placeholder (English)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={newsletterButtonAr}
                  onChange={(e) => setNewsletterButtonAr(e.target.value)}
                  placeholder={t("زر النشرة (عربي)", "Newsletter button (Arabic)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={newsletterButtonEn}
                  onChange={(e) => setNewsletterButtonEn(e.target.value)}
                  placeholder={t("زر النشرة (إنجليزي)", "Newsletter button (English)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={newsletterSuccessAr}
                  onChange={(e) => setNewsletterSuccessAr(e.target.value)}
                  placeholder={t("رسالة نجاح النشرة (عربي)", "Newsletter success (Arabic)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={newsletterSuccessEn}
                  onChange={(e) => setNewsletterSuccessEn(e.target.value)}
                  placeholder={t("رسالة نجاح النشرة (إنجليزي)", "Newsletter success (English)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={paymentsTitleAr}
                  onChange={(e) => setPaymentsTitleAr(e.target.value)}
                  placeholder={t("عنوان طرق الدفع (عربي)", "Payments title (Arabic)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={paymentsTitleEn}
                  onChange={(e) => setPaymentsTitleEn(e.target.value)}
                  placeholder={t("عنوان طرق الدفع (إنجليزي)", "Payments title (English)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
            </div>
          )}
          <button onClick={() => save.mutate()} className="bg-primary text-white px-4 py-2 rounded-lg" disabled={!pageId || !title}>
            {editingId ? t("حفظ التعديل", "Save changes") : t("إضافة القسم", "Add section")}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
                setTitleEn("");
                setContentEn("");
                setSectionType("");
                setExtraBase({});
                setLogoUrl("");
                setLogoAltAr("");
                setLogoAltEn("");
                setLogoHeight("");
                setLinksTitleAr("");
                setLinksTitleEn("");
                setLinksItems("");
                setNewsletterTitleAr("");
                setNewsletterTitleEn("");
                setNewsletterBodyAr("");
                setNewsletterBodyEn("");
                setNewsletterPlaceholderAr("");
                setNewsletterPlaceholderEn("");
                setNewsletterButtonAr("");
                setNewsletterButtonEn("");
                setNewsletterSuccessAr("");
                setNewsletterSuccessEn("");
                setPaymentsTitleAr("");
                setPaymentsTitleEn("");
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
                      <p className="text-xs text-secondary/70 dark:text-neutral-300">
                        {t("معرف الصفحة:", "Page ID:")} {sec.page}
                        {sec.section_type ? ` · ${t("النوع:", "Type:")} ${sec.section_type}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(sec.id);
                        setTitle(sec.title);
                        setContent(sec.content);
                        setOrder(sec.order);
                        setSectionType(sec.section_type || "");
                        const extra = (sec.extra || {}) as Record<string, unknown>;
                        setExtraBase(extra);
                        setTitleEn((extra?.title_en as string) || "");
                        setContentEn((extra?.content_en as string) || "");
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
