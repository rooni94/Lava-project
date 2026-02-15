import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PackageForm from "../../components/dashboard/PackageForm";
import { bulkPackage, deletePackage, fetchPackageCategories, fetchPackages } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import { Package, PackageCategory } from "../../types";
import { formatRiyal } from "../../utils/currency";

export default function DashboardPackages() {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const { data: categories } = useQuery<PackageCategory[]>({ queryKey: ["package-categories"], queryFn: fetchPackageCategories });
  const { data: packages, isLoading } = useQuery<Package[]>({ queryKey: ["packages-admin"], queryFn: () => fetchPackages({ product_type: "service" }) });

  const [editing, setEditing] = useState<Package | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const remove = useMutation({
    mutationFn: (id: number) => deletePackage(id),
    onSuccess: () => {
      toast.success(t("تم حذف الباقة", "Package deleted"));
      qc.invalidateQueries({ queryKey: ["packages-admin"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Delete failed")),
  });

  const bulkMutate = useMutation({
    mutationFn: (action: "activate" | "deactivate" | "delete" | "hide-prices" | "show-prices" | "hide-all-prices" | "show-all-prices") =>
      bulkPackage(action, selected),
    onSuccess: () => {
      toast.success(t("تم تنفيذ الإجراء", "Action completed"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["packages-admin"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: () => toast.error(t("تعذر تنفيذ الإجراء", "Action failed")),
  });

  const featuredCount = useMemo(() => packages?.filter((p) => p.featured).length ?? 0, [packages]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-5 text-secondary dark:text-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary/60">{t("باقات خدمات جاهزة للتخصيص", "Service bundles you can tailor")}</p>
            <h1 className="text-3xl font-bold text-secondary">{t("إدارة الباقات", "Manage packages")}</h1>
          </div>
          <div className="text-sm text-secondary/60">
            {t("مميزة:", "Featured:")} {featuredCount} / {packages?.length ?? 0}
          </div>
        </div>

        <PackageForm categories={categories} initial={editing} onDone={() => setEditing(null)} />

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-secondary">{t("الباقات الحالية", "Current packages")}</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                disabled={!selected.length}
                onClick={() => bulkMutate.mutate("activate")}
                className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-60"
              >
                {t("تفعيل", "Activate")}
              </button>
              <button
                disabled={!selected.length}
                onClick={() => bulkMutate.mutate("deactivate")}
                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded disabled:opacity-60"
              >
                {t("تعطيل", "Deactivate")}
              </button>
              <button
                disabled={!selected.length}
                onClick={() => bulkMutate.mutate("hide-prices")}
                className="px-3 py-1 bg-amber-100 text-amber-700 rounded disabled:opacity-60"
              >
                {t("إخفاء سعر المحدد", "Hide selected prices")}
              </button>
              <button
                disabled={!selected.length}
                onClick={() => bulkMutate.mutate("show-prices")}
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded disabled:opacity-60"
              >
                {t("إظهار سعر المحدد", "Show selected prices")}
              </button>
              <button onClick={() => bulkMutate.mutate("hide-all-prices")} className="px-3 py-1 bg-red-100 text-red-700 rounded">
                {t("إخفاء جميع الأسعار", "Hide all prices")}
              </button>
              <button onClick={() => bulkMutate.mutate("show-all-prices")} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded">
                {t("إظهار جميع الأسعار", "Show all prices")}
              </button>
              <button
                disabled={!selected.length}
                onClick={() => bulkMutate.mutate("delete")}
                className="px-3 py-1 bg-red-100 text-red-700 rounded disabled:opacity-60"
              >
                {t("حذف", "Delete")}
              </button>
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : !packages?.length ? (
            <div className="text-secondary/70">{t("لا توجد باقات حالياً.", "No packages yet.")}</div>
          ) : (
            <div className="space-y-2">
              {packages.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-3 border rounded-xl p-3 hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={(e) => setSelected((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)))}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-secondary text-lg">{p.title_ar}</span>
                        <span className="text-secondary/70 text-sm">/ {p.title_en}</span>
                        {p.featured ? <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{t("مميزة", "Featured")}</span> : null}
                        {p.show_price === false ? <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">{t("السعر مخفي", "Price hidden")}</span> : null}
                        {p.is_active === false ? <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">{t("غير فعال", "Inactive")}</span> : null}
                      </div>
                      <div className="text-sm text-secondary/70 flex flex-wrap gap-2">
                        {p.category ? (isAr ? p.category.name_ar : p.category.name_en) : t("بدون تصنيف", "Uncategorized")}
                        {p.show_price === false ? (
                          <> · {t("السعر مخفي", "Price hidden")}</>
                        ) : (
                          <>
                            {" "}· {formatRiyal(p.price)}
                            {(isAr ? p.price_note : p.price_note_en || p.price_note) ? <> · {isAr ? p.price_note : p.price_note_en || p.price_note}</> : null}
                          </>
                        )}
                      </div>
                      <div className="text-xs text-secondary/60 line-clamp-2">{isAr ? p.short_description_ar : p.short_description_en}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(p)} className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm hover:bg-blue-100">
                      {t("تعديل", "Edit")}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t("حذف هذه الباقة؟", "Delete this package?"))) remove.mutate(p.id);
                      }}
                      className="px-3 py-1 rounded bg-red-50 text-red-700 text-sm hover:bg-red-100"
                    >
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
