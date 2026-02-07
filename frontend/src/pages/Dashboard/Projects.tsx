import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  bulkProject,
  createProject,
  createTechnology,
  deleteProject,
  fetchProjects,
  fetchTechnologies,
  updateProject,
  uploadFile,
} from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import { Project, Technology } from "../../types";

const fontOptions = [
  { label: "Cairo", value: "Cairo" },
  { label: "Tajawal", value: "Tajawal" },
  { label: "IBM Plex Sans Arabic", value: "IBM Plex Sans Arabic" },
  { label: "Space Grotesk", value: "Space Grotesk" },
  { label: "Inter", value: "Inter" },
  { label: "Sora", value: "Sora" },
];

const categoryLabels = {
  ar: {
    web: "مواقع ويب",
    mobile: "تطبيقات جوال",
    erp: "أنظمة أعمال / ERP",
    branding: "هوية بصرية",
    other: "أخرى",
  },
  en: {
    web: "Web",
    mobile: "Mobile apps",
    erp: "Business systems / ERP",
    branding: "Branding",
    other: "Other",
  },
};

const statusLabels = {
  ar: {
    draft: "مسودة",
    in_progress: "قيد التنفيذ",
    done: "منجز",
  },
  en: {
    draft: "Draft",
    in_progress: "In progress",
    done: "Done",
  },
};

const baseForm: Partial<Project> = {
  title: "",
  title_en: "",
  description: "",
  description_en: "",
  summary: "",
  summary_en: "",
  goals: "",
  goals_en: "",
  challenges: "",
  challenges_en: "",
  solution: "",
  solution_en: "",
  results: "",
  results_en: "",
  scope: "",
  scope_en: "",
  duration: "",
  duration_en: "",
  team_size: "",
  team_size_en: "",
  budget: "",
  budget_en: "",
  category: "web",
  status: "done",
  client: "",
  client_en: "",
  live_url: "",
  github_url: "",
  primary_color: "#8A1538",
  accent_color: "#111827",
  title_font_family: "Cairo",
  body_font_family: "Cairo",
  title_font_size: 28,
  body_font_size: 16,
  gallery: [],
};

export default function DashboardProjects() {
  const qc = useQueryClient();
  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["projects-admin"], queryFn: fetchProjects });
  const { data: technologies } = useQuery<Technology[]>({ queryKey: ["technologies"], queryFn: fetchTechnologies });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const categoryMap = isAr ? categoryLabels.ar : categoryLabels.en;
  const statusMap = isAr ? statusLabels.ar : statusLabels.en;
  const [form, setForm] = useState<Partial<Project>>(baseForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [techIds, setTechIds] = useState<number[]>([]);
  const [newTechName, setNewTechName] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      let cover_image = form.cover_image;
      if (coverFile) {
        const res = await uploadFile(coverFile);
        cover_image = res.data.path || res.data.url || res.data.file || res.data;
      }

      const gallery = [...(form.gallery || [])];
      if (galleryFiles && galleryFiles.length) {
        for (const file of Array.from(galleryFiles)) {
          const res = await uploadFile(file);
          const path = res.data.path || res.data.url || res.data.file || res.data;
          if (path) gallery.push(path);
        }
      }

      const payload: Partial<Project> & { technology_ids?: number[] } = {
        ...form,
        cover_image,
        gallery,
        technology_ids: techIds,
      };

      return editingId ? updateProject(editingId, payload) : createProject(payload);
    },
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث العمل بنجاح", "Project updated successfully") : t("تم إضافة عمل جديد", "Project added"));
      resetForm();
      qc.invalidateQueries({ queryKey: ["projects-admin"] });
    },
    onError: () => toast.error(t("تعذر حفظ العمل، تحقق من البيانات", "Unable to save project, check the data")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      toast.success(t("تم حذف العمل", "Project deleted"));
      qc.invalidateQueries({ queryKey: ["projects-admin"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete")),
  });

  const bulkMutate = useMutation({
    mutationFn: (action: "publish" | "feature" | "delete") => bulkProject(action, selected),
    onSuccess: () => {
      toast.success(t("تم تنفيذ الإجراء على العناصر المحددة", "Action applied to selected items"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["projects-admin"] });
    },
    onError: () => toast.error(t("تعذر تنفيذ العملية الجماعية", "Bulk action failed")),
  });

  const addTech = useMutation({
    mutationFn: () => createTechnology({ name: newTechName, slug: newTechName.toLowerCase().replace(/\s+/g, "-") }),
    onSuccess: ({ data }) => {
      toast.success(t("تمت إضافة التقنية", "Technology added"));
      setTechIds((prev) => [...prev, data.id]);
      setNewTechName("");
      qc.invalidateQueries({ queryKey: ["technologies"] });
    },
    onError: () => toast.error(t("تعذر إضافة التقنية", "Unable to add technology")),
  });

  const resetForm = () => {
    setForm(baseForm);
    setCoverFile(null);
    setGalleryFiles(null);
    setEditingId(null);
    setSelected([]);
    setTechIds([]);
  };

  const startEditSelected = () => {
    if (selected.length !== 1 || !projects) return;
    const item = projects.find((p) => p.id === selected[0]);
    if (item) {
      setEditingId(item.id);
      setForm({
        ...baseForm,
        ...item,
      });
      setTechIds(item.technologies?.map((t) => t.id) || []);
      setSelected([]);
    }
  };

  const selectedProjects = useMemo(() => projects?.filter((p) => selected.includes(p.id)) || [], [projects, selected]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-5 text-secondary dark:text-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary/60">
              {t("تحكم كامل في عرض الأعمال بالواجهة العامة", "Full control over how projects appear on the site")}
            </p>
            <h1 className="text-3xl font-bold text-secondary">{t("إدارة الأعمال", "Manage projects")}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => bulkMutate.mutate("publish")}
              disabled={!selected.length}
              className="px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm"
            >
              {t("نشر المحدد", "Publish selected")}
            </button>
            <button
              onClick={() => bulkMutate.mutate("feature")}
              disabled={!selected.length}
              className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm"
            >
              {t("تمييز المحدد", "Feature selected")}
            </button>
            <button
              onClick={() => bulkMutate.mutate("delete")}
              disabled={!selected.length}
              className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
            >
              {t("حذف المحدد", "Delete selected")}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-secondary">
                  {editingId ? t("تعديل عمل", "Edit project") : t("إضافة عمل جديد", "Add new project")}
                </h2>
                {editingId && (
                  <button onClick={resetForm} className="text-sm text-primary underline">
                    {t("إلغاء التعديل", "Cancel editing")}
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={form.title || ""}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder={t("عنوان العمل", "Project title")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={form.client || ""}
                  onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))}
                  placeholder={t("اسم العميل", "Client name")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                >
                  {Object.entries(categoryMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                >
                  {Object.entries(statusMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={form.description || ""}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder={t("وصف مختصر يظهر في البطاقات", "Short description for cards")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
              <div className="grid md:grid-cols-2 gap-3">
                <textarea
                  value={form.summary || ""}
                  onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                  placeholder={t("ملخص تنفيذي", "Executive summary")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <textarea
                  value={form.goals || ""}
                  onChange={(e) => setForm((p) => ({ ...p, goals: e.target.value }))}
                  placeholder={t("الأهداف والنتائج المتوقعة", "Goals and expected outcomes")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <textarea
                  value={form.challenges || ""}
                  onChange={(e) => setForm((p) => ({ ...p, challenges: e.target.value }))}
                  placeholder={t("التحديات", "Challenges")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <textarea
                  value={form.solution || ""}
                  onChange={(e) => setForm((p) => ({ ...p, solution: e.target.value }))}
                  placeholder={t("الحل / المنهجية", "Solution / approach")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <textarea
                value={form.results || ""}
                onChange={(e) => setForm((p) => ({ ...p, results: e.target.value }))}
                placeholder={t("النتائج والأثر", "Results & impact")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  value={form.scope || ""}
                  onChange={(e) => setForm((p) => ({ ...p, scope: e.target.value }))}
                  placeholder={t("نطاق العمل", "Scope")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={form.duration || ""}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  placeholder={t("المدة / الجدول", "Duration / timeline")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={form.team_size || ""}
                  onChange={(e) => setForm((p) => ({ ...p, team_size: e.target.value }))}
                  placeholder={t("حجم الفريق", "Team size")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  value={form.budget || ""}
                  onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                  placeholder={t("الميزانية (اختياري)", "Budget (optional)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={form.live_url || ""}
                  onChange={(e) => setForm((p) => ({ ...p, live_url: e.target.value }))}
                  placeholder={t("رابط المشروع المباشر", "Live link")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <input
                  value={form.github_url || ""}
                  onChange={(e) => setForm((p) => ({ ...p, github_url: e.target.value }))}
                  placeholder={t("رابط الكود / المستودع", "Repository link")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>

              <div className="border-t border-accent/20 dark:border-neutral-800 pt-4 space-y-3">
                <h3 className="text-lg font-semibold text-secondary">
                  {t("الترجمة الإنجليزية", "English content")}
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    value={form.title_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                    placeholder={t("عنوان العمل (EN)", "Project title (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                  <input
                    value={form.client_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, client_en: e.target.value }))}
                    placeholder={t("اسم العميل (EN)", "Client name (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                </div>
                <textarea
                  value={form.description_en || ""}
                  onChange={(e) => setForm((p) => ({ ...p, description_en: e.target.value }))}
                  placeholder={t("وصف مختصر (EN)", "Short description (EN)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <textarea
                    value={form.summary_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, summary_en: e.target.value }))}
                    placeholder={t("ملخص تنفيذي (EN)", "Executive summary (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                  <textarea
                    value={form.goals_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, goals_en: e.target.value }))}
                    placeholder={t("الأهداف والنتائج (EN)", "Goals and expected outcomes (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <textarea
                    value={form.challenges_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, challenges_en: e.target.value }))}
                    placeholder={t("التحديات (EN)", "Challenges (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                  <textarea
                    value={form.solution_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, solution_en: e.target.value }))}
                    placeholder={t("الحل / المنهجية (EN)", "Solution / approach (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                </div>
                <textarea
                  value={form.results_en || ""}
                  onChange={(e) => setForm((p) => ({ ...p, results_en: e.target.value }))}
                  placeholder={t("النتائج والأثر (EN)", "Results & impact (EN)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    value={form.scope_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, scope_en: e.target.value }))}
                    placeholder={t("نطاق العمل (EN)", "Scope (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                  <input
                    value={form.duration_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, duration_en: e.target.value }))}
                    placeholder={t("المدة / الجدول (EN)", "Duration / timeline (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                  <input
                    value={form.team_size_en || ""}
                    onChange={(e) => setForm((p) => ({ ...p, team_size_en: e.target.value }))}
                    placeholder={t("حجم الفريق (EN)", "Team size (EN)")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                </div>
                <input
                  value={form.budget_en || ""}
                  onChange={(e) => setForm((p) => ({ ...p, budget_en: e.target.value }))}
                  placeholder={t("الميزانية (EN)", "Budget (EN)")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="w-full border rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer">
                  <span>{t("صورة الغلاف", "Cover image")}</span>
                  <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                </label>
                <label className="w-full border rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer">
                  <span>{t("معرض الصور (متعدد)", "Gallery (multiple)")}</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="border rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-secondary">{t("التقنيات", "Technologies")}</span>
                    <div className="flex gap-2">
                      <input
                        value={newTechName}
                        onChange={(e) => setNewTechName(e.target.value)}
                      placeholder={t("إضافة تقنية", "Add technology")}
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => newTechName && addTech.mutate()}
                        className="px-2 py-1 bg-primary text-white rounded text-sm"
                        disabled={!newTechName}
                      >
                      {t("إضافة", "Add")}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {technologies?.map((tech) => (
                      <label
                        key={tech.id}
                        className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                          techIds.includes(tech.id) ? "bg-primary text-white border-primary" : "bg-surface text-secondary"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={techIds.includes(tech.id)}
                          onChange={(e) =>
                            setTechIds((prev) =>
                              e.target.checked ? [...prev, tech.id] : prev.filter((id) => id !== tech.id)
                            )
                          }
                        />
                        {tech.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col text-sm gap-1">
                  <span>{t("خط العناوين", "Heading font")}</span>
                      <select
                        value={form.title_font_family}
                        onChange={(e) => setForm((p) => ({ ...p, title_font_family: e.target.value }))}
                        className="border rounded px-2 py-1"
                      >
                        {fontOptions.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col text-sm gap-1">
                  <span>{t("خط المحتوى", "Body font")}</span>
                      <select
                        value={form.body_font_family}
                        onChange={(e) => setForm((p) => ({ ...p, body_font_family: e.target.value }))}
                        className="border rounded px-2 py-1"
                      >
                        {fontOptions.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col text-sm gap-1">
                  <span>{t("حجم العنوان", "Heading size")}</span>
                      <input
                        type="number"
                        min={16}
                        max={48}
                        value={form.title_font_size}
                        onChange={(e) => setForm((p) => ({ ...p, title_font_size: Number(e.target.value) }))}
                        className="border rounded px-2 py-1"
                      />
                    </label>
                    <label className="flex flex-col text-sm gap-1">
                  <span>{t("حجم النص", "Body size")}</span>
                      <input
                        type="number"
                        min={12}
                        max={32}
                        value={form.body_font_size}
                        onChange={(e) => setForm((p) => ({ ...p, body_font_size: Number(e.target.value) }))}
                        className="border rounded px-2 py-1"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col text-sm gap-1">
                  <span>{t("لون أساسي", "Primary color")}</span>
                      <input
                        type="color"
                        value={form.primary_color || "#8A1538"}
                        onChange={(e) => setForm((p) => ({ ...p, primary_color: e.target.value }))}
                        className="h-10 w-full rounded border"
                      />
                    </label>
                    <label className="flex flex-col text-sm gap-1">
                  <span>{t("لون مساعد", "Accent color")}</span>
                      <input
                        type="color"
                        value={form.accent_color || "#111827"}
                        onChange={(e) => setForm((p) => ({ ...p, accent_color: e.target.value }))}
                        className="h-10 w-full rounded border"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => save.mutate()}
                  className="bg-primary text-white px-5 py-2 rounded-lg"
                  disabled={!form.title || !form.description}
                >
                  {editingId ? t("تحديث العمل", "Update project") : t("حفظ العمل", "Save project")}
                </button>
                <button onClick={resetForm} className="text-secondary/70 underline">
                  {t("إعادة ضبط", "Reset")}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-secondary">{t("الأعمال الحالية", "Current projects")}</h2>
                <button
                  disabled={selected.length !== 1}
                  onClick={startEditSelected}
                  className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm disabled:opacity-50"
                >
                  {t("تعديل المحدد", "Edit selected")}
                </button>
              </div>
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <div className="space-y-2">
                  {projects?.map((p) => (
                    <label
                      key={p.id}
                      className="flex gap-3 items-start justify-between border rounded-xl p-3 hover:border-primary/50 cursor-pointer"
                    >
                      <div className="flex gap-3 items-start">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={selected.includes(p.id)}
                          onChange={(e) =>
                            setSelected((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)))
                          }
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-secondary text-lg">{isAr ? p.title : p.title_en || p.title}</p>
                            <span className="px-2 py-1 text-xs rounded-full bg-surface border text-secondary/80">
                              {categoryMap[p.category as keyof typeof categoryMap] || p.category}
                            </span>
                            {p.status && (
                              <span className="px-2 py-1 text-xs rounded-full bg-accent text-secondary">
                                {statusMap[p.status as keyof typeof statusMap] || p.status}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-secondary/70 line-clamp-2">{isAr ? p.description : p.description_en || p.description}</p>
                          <div className="text-xs text-secondary/60 flex gap-2 flex-wrap">
                            {(isAr ? p.client : p.client_en || p.client) && (
                              <span>{t("العميل:", "Client:")} {isAr ? p.client : p.client_en || p.client}</span>
                            )}
                            {(isAr ? p.duration : p.duration_en || p.duration) && (
                              <span>{t("المدة:", "Duration:")} {isAr ? p.duration : p.duration_en || p.duration}</span>
                            )}
                            {(isAr ? p.scope : p.scope_en || p.scope) && (
                              <span>{t("نطاق العمل:", "Scope:")} {isAr ? p.scope : p.scope_en || p.scope}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(p.id);
                            setForm({ ...baseForm, ...p });
                            setTechIds(p.technologies?.map((t) => t.id) || []);
                          }}
                          className="text-blue-600 text-sm"
                        >
                          {t("تعديل", "Edit")}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove.mutate(p.id);
                          }}
                          className="text-red-600 text-sm"
                        >
                          {t("حذف", "Delete")}
                        </button>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-3">
                {t("معاينة سريعة للتخطيط", "Quick layout preview")}
              </h3>
              <div
                className="rounded-xl border p-4 space-y-2"
                style={{
                  background: form.primary_color ? `${form.primary_color}0d` : "#f8f9fa",
                  borderColor: form.accent_color || "#e5e7eb",
                  color: form.accent_color || "#111827",
                  fontFamily: form.body_font_family,
                }}
              >
                <p
                  className="font-bold"
                  style={{ fontFamily: form.title_font_family, fontSize: (form.title_font_size || 28) + "px" }}
                >
                  {form.title || t("عنوان العمل", "Project title")}
                </p>
                <p style={{ fontSize: (form.body_font_size || 16) + "px" }}>
                  {form.description || t("وصف البطاقة يظهر هنا.", "Card description appears here.")}
                </p>
                <div className="text-sm space-x-2 space-x-reverse">
                  {form.client && <span>{t("العميل:", "Client:")} {form.client}</span>}
                  {form.duration && <span>{t("المدة:", "Duration:")} {form.duration}</span>}
                  {form.scope && <span>{t("نطاق العمل:", "Scope:")} {form.scope}</span>}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-2">
              <h3 className="text-lg font-semibold text-secondary">{t("الأعمال المحددة", "Selected projects")}</h3>
              {selectedProjects.length === 0 ? (
                <p className="text-sm text-secondary/60">{t("لا توجد عناصر محددة.", "No items selected.")}</p>
              ) : (
                <ul className="text-sm text-secondary/80 list-disc pr-4 space-y-1">
                  {selectedProjects.map((p) => (
                    <li key={p.id}>{isAr ? p.title : p.title_en || p.title}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={startEditSelected}
                disabled={selected.length !== 1}
                className="w-full mt-2 px-3 py-2 rounded bg-primary text-white text-sm disabled:opacity-50"
              >
                {t("تعديل المحدد الآن", "Edit selected now")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
