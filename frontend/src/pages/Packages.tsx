import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import Skeleton from "../components/ui/Skeleton";
import PackageCard from "../components/ui/PackageCard";
import { fetchPackageCategories, fetchPackages } from "../api/endpoints";
import { Package, PackageCategory } from "../types";

type Group = { category: PackageCategory | null; items: Package[] };

export default function PackagesPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const [filter, setFilter] = useState<string>("");

  const { data: categories } = useQuery<PackageCategory[]>({ queryKey: ["package-categories"], queryFn: fetchPackageCategories });
  const { data: packages, isLoading, isFetching } = useQuery<Package[]>({
    queryKey: ["packages", { filter }],
    queryFn: () => fetchPackages({ product_type: "service", ...(filter ? { category: filter } : {}), ordering: "-featured" }),
  });

  const groups: Group[] = useMemo(() => {
    if (!packages?.length) return [];
    if (filter) {
      const cat = categories?.find((c) => String(c.id) === String(filter) || c.slug === filter) || null;
      return [{ category: cat, items: packages }];
    }
    const bucket: Record<string, Group> = {};
    packages.forEach((p) => {
      const key = p.category?.slug || "other";
      if (!bucket[key]) bucket[key] = { category: p.category || null, items: [] };
      bucket[key].items.push(p);
    });
    const ordered = categories?.map((c) => bucket[c.slug]).filter(Boolean) as Group[];
    const other = Object.values(bucket).filter((g) => !g.category);
    return [...(ordered || []), ...other];
  }, [packages, categories, filter]);

  return (
    <Layout>
      <MetaHead
        title={t("باقات الخدمات", "Service Packages")}
        description={t("حزم جاهزة للتخصيص تشمل تطوير الويب والتطبيقات والهوية والمحتوى.", "Curated service packages for web, apps, brand, and content.")}
      />

      <section className="container mx-auto px-4 py-14 space-y-10 text-secondary dark:text-neutral-100">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/12 via-rose-50 to-white dark:from-primary/20 dark:via-neutral-900 dark:to-neutral-950 border border-accent/40 dark:border-neutral-800 shadow-2xl">
          <div className="absolute -left-14 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-16 -bottom-18 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-center px-6 py-10 md:px-10 md:py-12">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {t("باقات وخدمات جاهزة", "Curated packages")}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-secondary dark:text-white">
                {t("باقات رقمية جاهزة للتخصيص والتوسع", "Launch-ready digital packages you can tailor")}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-200 max-w-2xl">
                {t(
                  "برمجة، هوية بصرية، محتوى، واستضافة في مستويات سعرية واضحة مع إمكانية تعديل البنود حسب احتياجك.",
                  "Web/apps, brand, content, and hosting with clear tiers you can adjust to fit your scope."
                )}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-secondary/70 dark:text-neutral-300">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  WordPress · React · React Native
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {t("هوية ومحتوى", "Brand & content")}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {t("تسويق واستضافة", "Marketing & hosting")}
                </span>
              </div>
            </div>

            <div className="bg-white/85 dark:bg-neutral-900/80 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-secondary/60 dark:text-neutral-400">{t("مؤشرات", "Highlights")}</div>
                  <div className="text-lg font-semibold text-secondary dark:text-white">{t("جودة + سرعة تنفيذ", "Quality + speed")}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/30">
                  {t("قابلة للتخصيص", "Customizable")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Metric label={t("باقات", "Packages")} value={packages?.length ?? 0} />
                <Metric label={t("مميزة", "Featured")} value={packages?.filter((p) => p.featured)?.length ?? 0} />
                <Metric label="24/7" value={t("دعم", "Support")} />
              </div>
              <p className="text-sm text-secondary/70 dark:text-neutral-300">
                {t("اختر الباقة واطلب التعديل المناسب. يمكن دمج أو إزالة أي عنصر حسب الحاجة.", "Pick a package then tailor any items you need.")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1.5 rounded-full text-sm ${filter === "" ? "bg-primary text-white" : "border border-accent/50 dark:border-neutral-700"}`}
          >
            {t("الكل", "All")}
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(String(c.id))}
              className={`px-3 py-1.5 rounded-full text-sm ${
                filter === String(c.id) ? "bg-primary text-white" : "border border-accent/50 dark:border-neutral-700"
              }`}
            >
              {isAr ? c.name_ar : c.name_en}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-secondary/70 dark:text-neutral-300">{t("لا توجد باقات حالياً.", "No packages available yet.")}</div>
        ) : (
          groups.map((group, idx) => (
            <section key={group.category?.id || idx} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary dark:text-neutral-50">
                  {group.category ? (isAr ? group.category.name_ar : group.category.name_en) : t("باقات أخرى", "Other packages")}
                </h2>
                <span className="text-sm text-secondary/60 dark:text-neutral-400">{group.items.length} {t("باقات", "packages")}</span>
              </div>
              <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${isFetching ? "opacity-90" : ""}`}>
                {group.items.map((pkg) => (
                  <PackageCard key={pkg.id} item={pkg} />
                ))}
              </div>
            </section>
          ))
        )}
      </section>
    </Layout>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-accent/40 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 p-3 text-center">
      <div className="text-xs text-secondary/60 dark:text-neutral-400">{label}</div>
      <div className="text-xl font-semibold text-secondary dark:text-neutral-100">{value}</div>
    </div>
  );
}
