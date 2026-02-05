import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import ProjectCard from "../components/ui/ProjectCard";
import Skeleton from "../components/ui/Skeleton";
import { fetchProjectStats, fetchProjects } from "../api/endpoints";
import { Project } from "../types";

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

  const { data: stats } = useQuery<ProjectStats>({ queryKey: ["projects", "stats"], queryFn: fetchProjectStats });
  const {
    data: projects,
    isLoading,
    isFetching,
  } = useQuery<Project[]>({
    queryKey: ["projects", { category, sort }],
    queryFn: () =>
      fetchProjects({
        ...(category ? { category } : {}),
        ...(sort === "featured" ? { is_featured: true } : { ordering: "-created_at" }),
      }),
  });

  const heroCopy = t(
    "واجهات رقمية وأنظمة أعمال وهوية بصرية تُنفذ بمعايير عالية لعملاء في مجالات متنوعة.",
    "Digital products, business systems, and bold identities crafted to launch and scale brands."
  );

  return (
    <Layout>
      <MetaHead
        title={t("أعمالنا", "Portfolio | LAVA")}
        description={t("نماذج مختارة من المشاريع التي أنجزناها لعملائنا.", "Selected projects and case studies delivered by LAVA.")}
      />

      <section className="container mx-auto px-4 py-14 space-y-8 text-secondary dark:text-neutral-100">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/10 via-rose-50 to-white dark:from-primary/20 dark:via-neutral-900 dark:to-neutral-950 border border-accent/40 dark:border-neutral-800 shadow-2xl">
          <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-12 -bottom-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.35fr_0.65fr] gap-6 items-center px-6 py-8 md:px-10 md:py-12">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">{t("الأعمال", "Portfolio")}</p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-secondary dark:text-white">
                {t("أعمال مختارة بعناية", "Curated projects that ship results")}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-200 max-w-2xl">{heroCopy}</p>
              <div className="flex flex-wrap gap-3 text-sm text-secondary/70 dark:text-neutral-300">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900 border border-accent/40 dark:border-neutral-700">
                  {t("ويب • جوال • أنظمة • علامة", "Web • Mobile • Systems • Brand")}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900 border border-accent/40 dark:border-neutral-700">
                  {t("منتجات • لوحات تحكم • مواقع", "Products • Dashboards • Sites")}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <StatCard label={t("إجمالي الأعمال", "Total projects")} value={stats?.total_projects ?? 0} />
              <StatCard label={t("مميزة", "Featured")} value={stats?.featured_projects ?? 0} />
              <StatCard label={t("وسائط ومعارض", "Media & galleries")} value={stats?.media_items ?? 0} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
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

          <div className="flex items-center gap-2 text-sm">
            <span className="text-secondary/60 dark:text-neutral-400">{t("عرض", "Sort")}</span>
            <button
              onClick={() => setSort("latest")}
              className={`px-3 py-1.5 rounded-full border transition ${
                sort === "latest" ? "bg-primary text-white border-primary" : "border-accent/50 dark:border-neutral-700"
              }`}
            >
              {t("الأحدث", "Latest")}
            </button>
            <button
              onClick={() => setSort("featured")}
              className={`px-3 py-1.5 rounded-full border transition ${
                sort === "featured" ? "bg-primary text-white border-primary" : "border-accent/50 dark:border-neutral-700"
              }`}
            >
              {t("المميزة", "Featured")}
            </button>
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
    <div className="rounded-2xl border border-accent/50 dark:border-neutral-700 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-secondary/60 dark:text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold text-secondary dark:text-white">{value}</div>
    </div>
  );
}
