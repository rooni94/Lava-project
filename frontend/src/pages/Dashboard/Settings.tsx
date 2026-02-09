import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import SectionTitle from "../../components/ui/SectionTitle";
import { createSiteSettings, fetchSiteSettings, updateSiteSettings } from "../../api/endpoints";
import { SiteSettings } from "../../types";
import { applySiteTheme } from "../../utils/theme";

const defaultValues: Partial<SiteSettings> = {
  site_name: "LAVA",
  primary_color: "#580213",
  secondary_color: "#222222",
  accent_color: "#CCCCCC",
  surface_color: "#F8F9FA",
  background_color: "#F8F9FA",
  text_color: "#1F2937",
  heading_color: "#222222",
  primary_color_dark: "#FF4A75",
  secondary_color_dark: "#E5E7EB",
  accent_color_dark: "#374151",
  surface_color_dark: "#111827",
  background_color_dark: "#0B0F17",
  text_color_dark: "#E5E7EB",
  heading_color_dark: "#F9FAFB",
  body_font_family: "Cairo, Tajawal, 'IBM Plex Sans Arabic', sans-serif",
  body_font_family_en: "'Space Grotesk', Inter, Sora, sans-serif",
  heading_font_family: "Cairo, Tajawal, 'IBM Plex Sans Arabic', sans-serif",
  heading_font_family_en: "'Space Grotesk', Inter, Sora, sans-serif",
  font_size_base: 16,
  font_size_h1: 36,
  font_size_h2: 30,
  font_size_h3: 24,
  font_size_h4: 20,
  font_size_h5: 18,
  font_size_h6: 16,
};

type ColorKey = keyof Pick<
  SiteSettings,
  | "primary_color"
  | "secondary_color"
  | "accent_color"
  | "surface_color"
  | "background_color"
  | "text_color"
  | "heading_color"
  | "primary_color_dark"
  | "secondary_color_dark"
  | "accent_color_dark"
  | "surface_color_dark"
  | "background_color_dark"
  | "text_color_dark"
  | "heading_color_dark"
>;

type FontKey = keyof Pick<
  SiteSettings,
  "body_font_family" | "body_font_family_en" | "heading_font_family" | "heading_font_family_en"
>;

type SizeKey = keyof Pick<
  SiteSettings,
  "font_size_base" | "font_size_h1" | "font_size_h2" | "font_size_h3" | "font_size_h4" | "font_size_h5" | "font_size_h6"
>;

export default function DashboardSettings() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const initial = useMemo(() => ({ ...defaultValues, ...(data || {}) }), [data]);
  const [form, setForm] = useState<Partial<SiteSettings>>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const updateField = (key: keyof SiteSettings, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form };
      if (data?.id) {
        return updateSiteSettings(data.id, payload);
      }
      return createSiteSettings(payload);
    },
    onSuccess: async () => {
      toast.success(t("تم حفظ الإعدادات", "Settings saved"));
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      const refreshed = await fetchSiteSettings();
      applySiteTheme(refreshed || undefined);
    },
    onError: () => toast.error(t("تعذر حفظ الإعدادات", "Unable to save settings")),
  });

  const renderColor = (labelAr: string, labelEn: string, key: ColorKey) => (
    <label className="flex items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-xl px-4 py-3">
      <span className="text-sm text-secondary dark:text-neutral-200">{t(labelAr, labelEn)}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={(form[key] as string) || "#000000"}
          onChange={(e) => updateField(key, e.target.value)}
          className="h-8 w-10 rounded border border-accent/50"
        />
        <input
          value={(form[key] as string) || ""}
          onChange={(e) => updateField(key, e.target.value)}
          className="w-28 px-2 py-1 rounded border border-accent/40 dark:border-neutral-700 bg-transparent text-xs"
        />
      </div>
    </label>
  );

  const renderFont = (labelAr: string, labelEn: string, key: FontKey) => (
    <label className="block space-y-2">
      <span className="text-sm text-secondary dark:text-neutral-200">{t(labelAr, labelEn)}</span>
      <input
        value={(form[key] as string) || ""}
        onChange={(e) => updateField(key, e.target.value)}
        className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
      />
    </label>
  );

  const renderSize = (labelAr: string, labelEn: string, key: SizeKey) => (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm text-secondary dark:text-neutral-200">{t(labelAr, labelEn)}</span>
      <input
        type="number"
        min={10}
        max={80}
        value={Number(form[key] || 0)}
        onChange={(e) => updateField(key, Number(e.target.value))}
        className="w-24 border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
      />
    </label>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={t("إعدادات المظهر والخطوط", "Theme & Typography")}
          subtitle={t("عدّل الألوان، الخطوط، وأحجام النصوص للموقع بالكامل.", "Adjust colors, fonts, and text sizing across the site.")}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("ألوان الوضع الفاتح", "Light mode colors")}</h3>
            <div className="grid gap-2">
              {renderColor("اللون الأساسي", "Primary color", "primary_color")}
              {renderColor("اللون النصي الأساسي", "Primary text color", "secondary_color")}
              {renderColor("لون التمييز", "Accent color", "accent_color")}
              {renderColor("لون السطح", "Surface color", "surface_color")}
              {renderColor("لون الخلفية", "Background color", "background_color")}
              {renderColor("لون النص", "Text color", "text_color")}
              {renderColor("لون العناوين", "Heading color", "heading_color")}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("ألوان الوضع الداكن", "Dark mode colors")}</h3>
            <div className="grid gap-2">
              {renderColor("اللون الأساسي (داكن)", "Primary color (dark)", "primary_color_dark")}
              {renderColor("اللون النصي الأساسي (داكن)", "Primary text color (dark)", "secondary_color_dark")}
              {renderColor("لون التمييز (داكن)", "Accent color (dark)", "accent_color_dark")}
              {renderColor("لون السطح (داكن)", "Surface color (dark)", "surface_color_dark")}
              {renderColor("لون الخلفية (داكن)", "Background color (dark)", "background_color_dark")}
              {renderColor("لون النص (داكن)", "Text color (dark)", "text_color_dark")}
              {renderColor("لون العناوين (داكن)", "Heading color (dark)", "heading_color_dark")}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold">{t("الخطوط", "Fonts")}</h3>
            {renderFont("خط النصوص (عربي)", "Body font (Arabic)", "body_font_family")}
            {renderFont("خط النصوص (إنجليزي)", "Body font (English)", "body_font_family_en")}
            {renderFont("خط العناوين (عربي)", "Heading font (Arabic)", "heading_font_family")}
            {renderFont("خط العناوين (إنجليزي)", "Heading font (English)", "heading_font_family_en")}
            <p className="text-xs text-secondary/70 dark:text-neutral-400">
              {t("يمكنك كتابة عدة خطوط مفصولة بفواصل.", "You can provide multiple fonts separated by commas.")}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-lg font-semibold">{t("أحجام النصوص", "Text sizes")}</h3>
            {renderSize("حجم النص الأساسي", "Base font size", "font_size_base")}
            {renderSize("حجم عنوان H1", "H1 size", "font_size_h1")}
            {renderSize("حجم عنوان H2", "H2 size", "font_size_h2")}
            {renderSize("حجم عنوان H3", "H3 size", "font_size_h3")}
            {renderSize("حجم عنوان H4", "H4 size", "font_size_h4")}
            {renderSize("حجم عنوان H5", "H5 size", "font_size_h5")}
            {renderSize("حجم عنوان H6", "H6 size", "font_size_h6")}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => save.mutate()}
            className="px-5 py-2 rounded-lg bg-primary text-white shadow hover:shadow-md"
            disabled={save.isPending}
          >
            {save.isPending ? t("جارٍ الحفظ...", "Saving...") : t("حفظ التغييرات", "Save changes")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
