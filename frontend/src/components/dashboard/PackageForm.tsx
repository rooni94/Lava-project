import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, PackageCategory } from "../../types";
import { createPackage, updatePackage } from "../../api/endpoints";
import toast from "react-hot-toast";

type FormState = {
  slug: string;
  title_en: string;
  title_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  price_note: string;
  currency: string;
  category_id: number | null;
  featured: boolean;
  is_active: boolean;
};

const empty: FormState = {
  slug: "",
  title_en: "",
  title_ar: "",
  short_description_en: "",
  short_description_ar: "",
  description_en: "",
  description_ar: "",
  price: 0,
  price_note: "",
  currency: "﷼",
  category_id: null,
  featured: false,
  is_active: true,
};

export default function PackageForm({
  categories,
  initial,
  onDone,
}: {
  categories: PackageCategory[] | undefined;
  initial?: Package | null;
  onDone?: () => void;
}) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (!initial) {
      setForm(empty);
      return;
    }
    setForm({
      slug: initial.slug || "",
      title_en: initial.title_en || "",
      title_ar: initial.title_ar || "",
      short_description_en: initial.short_description_en || "",
      short_description_ar: initial.short_description_ar || "",
      description_en: initial.description_en || "",
      description_ar: initial.description_ar || "",
      price: Number(initial.price || 0),
      price_note: initial.price_note || "",
      currency: initial.currency || "﷼",
      category_id: initial.category?.id ?? null,
      featured: !!initial.featured,
      is_active: initial.is_active !== false,
    });
  }, [initial]);

  const mutate = useMutation({
    mutationFn: async () => {
      const payload: Partial<Package> = {
        ...form,
        product_type: "service",
        category_id: form.category_id,
      };
      if (initial?.id) return updatePackage(initial.id, payload);
      return createPackage(payload);
    },
    onSuccess: () => {
      toast.success(initial ? t("تم تحديث الباقة", "Package updated") : t("تمت إضافة الباقة", "Package added"));
      qc.invalidateQueries({ queryKey: ["packages-admin"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
      onDone?.();
      if (!initial) setForm(empty);
    },
    onError: () => toast.error(t("تعذر حفظ الباقة", "Failed to save package")),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate.mutate();
      }}
      className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-secondary dark:text-neutral-50">
          {initial ? t("تعديل الباقة", "Edit package") : t("إضافة باقة", "Add package")}
        </h2>
        {onDone && initial ? (
          <button type="button" onClick={onDone} className="text-sm text-primary underline">
            {t("إلغاء", "Cancel")}
          </button>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          value={form.title_ar}
          onChange={(e) => setForm((p) => ({ ...p, title_ar: e.target.value }))}
          placeholder={t("العنوان (عربي)", "Title (Arabic)")}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
        <input
          value={form.title_en}
          onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
          placeholder={t("العنوان (EN)", "Title (EN)")}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
        <input
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          placeholder="slug"
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
        <select
          value={form.category_id || ""}
          onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value ? Number(e.target.value) : null }))}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        >
          <option value="">{t("اختر التصنيف", "Select category")}</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {isAr ? c.name_ar : c.name_en}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          value={form.short_description_ar}
          onChange={(e) => setForm((p) => ({ ...p, short_description_ar: e.target.value }))}
          placeholder={t("وصف قصير (ع)", "Short description (AR)")}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
        <input
          value={form.short_description_en}
          onChange={(e) => setForm((p) => ({ ...p, short_description_en: e.target.value }))}
          placeholder={t("وصف قصير (EN)", "Short description (EN)")} 
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
      </div>

      <textarea
        value={form.description_ar}
        onChange={(e) => setForm((p) => ({ ...p, description_ar: e.target.value }))}
        placeholder={t("المزايا / المحتوى (AR) - سطر لكل نقطة", "Features (AR) - one per line")}
        className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700 min-h-[90px]"
      />
      <textarea
        value={form.description_en}
        onChange={(e) => setForm((p) => ({ ...p, description_en: e.target.value }))}
        placeholder={t("Features / content (EN) - one per line", "Features / content (EN) - one per line")}
        className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700 min-h-[90px]"
      />

      <div className="grid md:grid-cols-3 gap-3">
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
          placeholder={t("السعر", "Price")}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
        <input
          value={form.price_note}
          onChange={(e) => setForm((p) => ({ ...p, price_note: e.target.value }))}
          placeholder={t("ملاحظة السعر (مثال 3,500 – 5,000)", "Price note (e.g. 3,500 – 5,000)")}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
        <input
          value={form.currency}
          onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
          placeholder={t("العملة", "Currency")}
          className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
      </div>

      <div className="flex items-center gap-4 text-sm text-secondary/80 dark:text-neutral-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
          {t("مميزة", "Featured")}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />
          {t("فعّالة", "Active")}
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {onDone && (
          <button type="button" className="text-secondary/70 underline" onClick={onDone}>
            {t("إلغاء", "Cancel")}
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white" disabled={mutate.isPending}>
          {mutate.isPending ? t("جاري الحفظ...", "Saving...") : initial ? t("تحديث الباقة", "Update package") : t("حفظ الباقة", "Save package")}
        </button>
      </div>
    </form>
  );
}
