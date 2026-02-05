import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { bulkService, createService, deleteService, fetchServices, updateService } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import { Service } from "../../types";
import { serviceIcons, serviceIconKeys } from "../../components/ui/ServiceCard";

export default function DashboardServices() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Service[]>({ queryKey: ["services-admin"], queryFn: fetchServices });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>("default");
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const iconOptions = serviceIconKeys.map((key) => ({
    value: key,
    label: isAr
      ? {
          design: "تصميم / واجهات",
          code: "تطوير ويب",
          mobile: "تطبيقات الجوال",
          marketing: "تسويق وحملات",
          content: "محتوى وكتابة",
          video: "فيديو وموشن",
          ads: "إعلانات وأداء",
          erp: "أنظمة ERP/CRM",
          data: "بيانات وتحليلات",
          cloud: "سحابة وبنية",
          support: "دعم وصيانة",
          security: "أمن وحماية",
          ecommerce: "متاجر إلكترونية",
          ai: "ذكاء اصطناعي",
          default: "أيقونة افتراضية",
        }[key as keyof typeof serviceIcons] || key
      : {
          design: "Design / UI",
          code: "Web development",
          mobile: "Mobile apps",
          marketing: "Marketing",
          content: "Content",
          video: "Video / Motion",
          ads: "Ads / Performance",
          erp: "ERP / CRM",
          data: "Data / Analytics",
          cloud: "Cloud / Infra",
          support: "Support",
          security: "Security",
          ecommerce: "E-commerce",
          ai: "AI / ML",
          default: "Default",
        }[key as keyof typeof serviceIcons] || key,
  }));

  const save = useMutation({
    mutationFn: () =>
      editingId
        ? updateService(editingId, { title, description, icon: icon || undefined })
        : createService({ title, description, icon: icon || undefined }),
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث الخدمة بنجاح", "Service updated") : t("تمت إضافة خدمة جديدة", "Service added"));
      setTitle("");
      setDescription("");
      setIcon("default");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["services-admin"] });
    },
    onError: () => toast.error(t("تعذر حفظ الخدمة، تحقق من البيانات", "Unable to save service")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: () => {
      toast.success(t("تم حذف الخدمة", "Service deleted"));
      qc.invalidateQueries({ queryKey: ["services-admin"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete service")),
  });

  const bulkMutate = useMutation({
    mutationFn: (action: "activate" | "deactivate" | "delete") => bulkService(action, selected),
    onSuccess: () => {
      toast.success(t("تم تنفيذ العملية على العناصر المحددة", "Action applied to selected services"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["services-admin"] });
    },
    onError: () => toast.error(t("تعذر تنفيذ العملية", "Bulk action failed")),
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("الخدمات", "Services")}</h1>
        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("عنوان الخدمة", "Service title")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("وصف مختصر للخدمة", "Short service description")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="border rounded-lg px-3 py-2 min-w-[220px] bg-white dark:bg-neutral-900 dark:border-neutral-700"
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="text-sm text-secondary/70 dark:text-neutral-300">
              {t("اختر الأيقونة كما ستظهر في واجهة الخدمات.", "Choose the icon as it will appear in the services section.")}
            </span>
            <div className="w-12 h-12 rounded-xl bg-primary text-white grid place-items-center">
              {serviceIcons[(icon || "default") as keyof typeof serviceIcons]}
            </div>
          </div>
          <button onClick={() => save.mutate()} className="bg-primary text-white px-4 py-2 rounded-lg" disabled={!title || !description}>
            {editingId ? t("تحديث الخدمة", "Save changes") : t("إضافة خدمة", "Add service")}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setDescription("");
                setIcon("default");
              }}
              className="text-sm text-secondary dark:text-neutral-300 underline"
            >
              {t("إلغاء التعديل", "Cancel editing")}
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-2 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            <button
              disabled={selected.length !== 1 || !data?.length}
              onClick={() => {
                const id = selected[0];
                const svc = data?.find((s) => s.id === id);
                if (svc) {
                  setEditingId(svc.id);
                  setTitle(svc.title);
                  setDescription(svc.description);
                  setIcon(svc.icon || "default");
                }
              }}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-60"
            >
              {t("تعديل", "Edit")}
            </button>
            <button disabled={!selected.length} onClick={() => bulkMutate.mutate("activate")} className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-60">
              {t("تفعيل", "Activate")}
            </button>
            <button disabled={!selected.length} onClick={() => bulkMutate.mutate("deactivate")} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded disabled:opacity-60">
              {t("تعطيل", "Deactivate")}
            </button>
            <button disabled={!selected.length} onClick={() => bulkMutate.mutate("delete")} className="px-3 py-1 bg-red-100 text-red-700 rounded disabled:opacity-60">
              {t("حذف", "Delete")}
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-2 text-secondary dark:text-neutral-50">{t("قائمة الخدمات", "Services list")}</h2>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-2">
              {data?.map((svc) => (
                <label key={svc.id} className="flex items-center justify-between border-b border-accent/20 dark:border-neutral-800 py-2 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(svc.id)}
                      onChange={(e) =>
                        setSelected((prev) => (e.target.checked ? [...prev, svc.id] : prev.filter((id) => id !== svc.id)))
                      }
                    />
                    <div>
                      <p className="font-bold text-secondary dark:text-neutral-50">{svc.title}</p>
                      <p className="text-sm text-secondary/70 dark:text-neutral-300 line-clamp-2">{svc.description}</p>
                      <div className="text-xs text-secondary/60 dark:text-neutral-400">{t("الأيقونة:", "Icon:")} {svc.icon || "default"}</div>
                      <span className={`text-xs px-2 py-1 rounded ${svc.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                        {svc.is_active ? t("مفعلة", "Active") : t("معطلة", "Inactive")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(svc.id);
                        setTitle(svc.title);
                        setDescription(svc.description);
                        setIcon(svc.icon || "default");
                      }}
                      className="text-blue-600 dark:text-blue-400 text-sm"
                    >
                      {t("تعديل", "Edit")}
                    </button>
                    <button onClick={() => remove.mutate(svc.id)} className="text-red-600 dark:text-red-400 text-sm">
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
