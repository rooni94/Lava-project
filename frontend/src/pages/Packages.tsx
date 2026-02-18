import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import Skeleton from "../components/ui/Skeleton";
import PackageCard from "../components/ui/PackageCard";
import { fetchPackageCategories, fetchPackages } from "../api/endpoints";
import { Package, PackageCategory } from "../types";
import SectionTitle from "../components/ui/SectionTitle";

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
    packages.forEach((pkg) => {
      const key = pkg.category?.slug || "other";
      if (!bucket[key]) bucket[key] = { category: pkg.category || null, items: [] };
      bucket[key].items.push(pkg);
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -left-14 -top-16 h-56 w-56 rounded-full bg-primary/16 blur-3xl" />
          <div className="absolute -right-14 -bottom-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl dark:bg-white/6" />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {t("باقات تشغيل وإطلاق", "Launch-ready offers")}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-secondary dark:text-neutral-50">
                {t("اختر الباقة ثم خصّصها بدقة", "Pick the package, then tailor it exactly")}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-300 max-w-3xl leading-8">
                {t(
                  "باقاتنا مصممة لتقصير وقت القرار: نطاق واضح، تسعير مرن، وخطة تنفيذ قابلة للتعديل قبل التعاقد.",
                  "Our packages are designed to shorten decision time: clear scope, flexible pricing, and adjustable delivery plans."
                )}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-secondary/70 dark:text-neutral-300">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">WordPress</span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">React</span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">React Native</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Metric label={t("باقات", "Packages")} value={packages?.length ?? 0} />
              <Metric label={t("مميزة", "Featured")} value={packages?.filter((p) => p.featured)?.length ?? 0} />
              <Metric label="24/7" value={t("دعم", "Support")} />
            </div>
          </div>
        </motion.div>

        <div className="neo-panel p-4 md:p-5">
          <SectionTitle
            align="start"
            title={t("تصنيف الباقات", "Package categories")}
            subtitle={t("اختر المجال المطلوب لعرض الباقات المناسبة.", "Choose a domain to narrow down the right offers.")}
          />
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
    <div className="rounded-2xl border border-accent/40 dark:border-neutral-800 bg-white/75 dark:bg-neutral-900/75 p-3 text-center">
      <div className="text-xs text-secondary/60 dark:text-neutral-400">{label}</div>
      <div className="text-xl font-semibold text-secondary dark:text-neutral-100">{value}</div>
    </div>
  );
}
