import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import ProjectCard from "../components/ui/ProjectCard";
import Skeleton from "../components/ui/Skeleton";
import { fetchProjectStats, fetchProjects } from "../api/endpoints";
import { Project } from "../types";
import SectionTitle from "../components/ui/SectionTitle";

const categoryFilters = [
  { key: "", labelAr: "الكل", labelEn: "All" },
  { key: "web", labelAr: "ويب", labelEn: "Web" },
  { key: "mobile", labelAr: "جوال", labelEn: "Mobile" },
  { key: "erp", labelAr: "أنظمة", labelEn: "Systems" },
  { key: "branding", labelAr: "علامة", labelEn: "Branding" },
  { key: "other", labelAr: "أخرى", labelEn: "Other" },
];

type ProjectStats = {
  total_projects: number;
  featured_projects: number;
  by_category: Record<string, number>;
  media_items: number;
  technologies: number;
};

export default function PortfolioPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<"latest" | "featured">("latest");

  const { data: stats } = useQuery<ProjectStats>({
    queryKey: ["projects", "stats"],
    queryFn: fetchProjectStats,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: projects, isLoading, isFetching } = useQuery<Project[]>({
    queryKey: ["projects", { category, sort }],
    queryFn: () =>
      fetchProjects({
        ...(category ? { category } : {}),
        ...(sort === "featured" ? { is_featured: true } : { ordering: "-created_at" }),
      }),
    staleTime: 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  return (
    <Layout>
      <MetaHead
        title={t("أعمالنا", "Portfolio | LAVA")}
        description={t("نماذج مختارة من المشاريع التي أنجزناها لعملائنا.", "Selected projects and case studies delivered by LAVA.")}
      />

      <section className="container mx-auto px-4 py-14 space-y-8 text-secondary dark:text-neutral-100">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-14 -bottom-14 h-64 w-64 rounded-full bg-secondary/10 blur-3xl dark:bg-white/5" />
          <div className="relative grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">{t("الأعمال", "Portfolio")}</p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-secondary dark:text-neutral-50 ribbon-line">
                {t("أعمال تُترجم الرؤية إلى نتائج", "Work that turns vision into measurable outcomes")}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-300 max-w-3xl leading-8">
                {t(
                  "كل مشروع هنا يمثل توازنًا بين الجمال البصري، المنطق التقني، وأهداف النمو التجاري.",
                  "Every case study here balances visual craft, technical architecture, and growth intent."
                )}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <StatCard label={t("إجمالي الأعمال", "Total projects")} value={stats?.total_projects ?? 0} />
              <StatCard label={t("مشاريع مميزة", "Featured projects")} value={stats?.featured_projects ?? 0} />
              <StatCard label={t("وسائط ومعارض", "Media assets")} value={stats?.media_items ?? 0} />
            </div>
          </div>
        </motion.div>

        <div className="neo-panel p-4 md:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle
              align="start"
              title={t("تصفية الأعمال", "Filter projects")}
              subtitle={t("اختر التصنيف ثم طريقة العرض.", "Pick a category and sort mode.")}
            />

            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setSort("latest")}
                className={`px-4 py-2 rounded-full border transition ${
                  sort === "latest"
                    ? "bg-primary text-white border-primary"
                    : "border-accent/60 dark:border-neutral-700 hover:border-primary"
                }`}
              >
                {t("الأحدث", "Latest")}
              </button>
              <button
                onClick={() => setSort("featured")}
                className={`px-4 py-2 rounded-full border transition ${
                  sort === "featured"
                    ? "bg-primary text-white border-primary"
                    : "border-accent/60 dark:border-neutral-700 hover:border-primary"
                }`}
              >
                {t("المميزة", "Featured")}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setCategory(f.key)}
                className={`px-3 py-1.5 rounded-full border text-sm transition ${
                  category === f.key
                    ? "bg-primary text-white border-primary"
                    : "bg-transparent text-secondary dark:text-neutral-200 border-accent/50 dark:border-neutral-700 hover:border-primary"
                }`}
              >
                {t(f.labelAr, f.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative ${isFetching ? "opacity-90" : ""}`}>
            {projects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        ) : (
          <div className="text-center text-secondary/70 dark:text-neutral-300 border border-dashed border-accent/60 dark:border-neutral-700 rounded-2xl p-10">
            {t("لا توجد أعمال مطابقة حالياً.", "No projects match the selected filters yet.")}
          </div>
        )}
      </section>
    </Layout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-accent/50 dark:border-neutral-700 bg-white/75 dark:bg-neutral-900/65 backdrop-blur px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-secondary/60 dark:text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold text-secondary dark:text-white">{value}</div>
    </div>
  );
}
