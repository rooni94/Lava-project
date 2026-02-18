import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import Skeleton from "../components/ui/Skeleton";
import { fetchProject } from "../api/endpoints";
import { Project } from "../types";
import { isVideoUrl, resolveMediaUrl } from "../utils/media";
import ImageLightbox from "../components/ui/ImageLightbox";
import Reveal from "../components/ui/Reveal";

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
  ar: { draft: "مسودة", in_progress: "قيد التنفيذ", done: "منجز" },
  en: { draft: "Draft", in_progress: "In progress", done: "Done" },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const pickText = (ar?: string, en?: string) => (isAr ? ar : en || ar);
  const labels = isAr ? categoryLabels.ar : categoryLabels.en;
  const statusMap = isAr ? statusLabels.ar : statusLabels.en;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data, isLoading } = useQuery<Project | undefined>({
    queryKey: ["project", id],
    queryFn: () => fetchProject(String(id)),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <Layout>
        <section className="py-14 container mx-auto px-4">
          <Skeleton className="h-64 w-full" />
        </section>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100">
          {isAr ? "لم يتم العثور على العمل المطلوب." : "Project not found."}
        </section>
      </Layout>
    );
  }

  const title = pickText(data.title, data.title_en) || data.title;
  const description = pickText(data.description, data.description_en) || data.description;
  const summary = pickText(data.summary, data.summary_en) || description;
  const goals = pickText(data.goals, data.goals_en);
  const challenges = pickText(data.challenges, data.challenges_en);
  const solution = pickText(data.solution, data.solution_en);
  const results = pickText(data.results, data.results_en);
  const scope = pickText(data.scope, data.scope_en);
  const duration = pickText(data.duration, data.duration_en);
  const teamSize = pickText(data.team_size, data.team_size_en);
  const budget = pickText(data.budget, data.budget_en);
  const client = pickText(data.client, data.client_en);

  const chips = [
    { label: isAr ? "التصنيف" : "Category", value: labels[data.category as keyof typeof labels] || data.category },
    data.status ? { label: isAr ? "الحالة" : "Status", value: statusMap[data.status as keyof typeof statusMap] || data.status } : null,
    client ? { label: isAr ? "العميل" : "Client", value: client } : null,
    scope ? { label: isAr ? "النطاق" : "Scope", value: scope } : null,
    duration ? { label: isAr ? "المدة" : "Duration", value: duration } : null,
    teamSize ? { label: isAr ? "الفريق" : "Team", value: teamSize } : null,
    budget ? { label: isAr ? "الميزانية" : "Budget", value: budget } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const gallery = data.gallery || [];
  const galleryUrls = gallery.map((p) => resolveMediaUrl(p)).filter(Boolean) as string[];

  return (
    <Layout>
      <MetaHead title={title} description={description} image={data.cover_image} />
      <section className="py-14 container mx-auto px-4 space-y-8 text-secondary dark:text-neutral-100" style={{ fontFamily: data.body_font_family || "Manrope" }}>
        <Reveal className="neo-panel p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/14 blur-3xl" />
          <div className="absolute -right-12 -bottom-14 h-64 w-64 rounded-full bg-secondary/10 blur-3xl dark:bg-white/6" />

          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-secondary/60 dark:text-neutral-400">
                {labels[data.category as keyof typeof labels] || data.category}
              </p>
              <h1
                className="text-3xl md:text-5xl font-bold leading-tight"
                style={{
                  fontFamily: data.title_font_family || "Sora",
                  color: data.primary_color || undefined,
                }}
              >
                {title}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-300 whitespace-pre-wrap leading-8" style={{ fontSize: (data.body_font_size || 16) + "px" }}>
                {summary}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-secondary/75 dark:text-neutral-300">
                {chips.map((c) => (
                  <span key={c.label} className="px-3 py-1 rounded-full border border-accent/55 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/65">
                    {c.label}: {c.value}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {data.live_url ? (
                  <a
                    href={data.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-primary text-white shadow-[0_12px_28px_rgba(var(--color-primary),0.32)]"
                  >
                    {isAr ? "زيارة المشروع" : "View live project"}
                  </a>
                ) : null}
                {data.github_url ? (
                  <a
                    href={data.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary/10"
                  >
                    {isAr ? "عرض الكود" : "View repository"}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-accent/45 dark:border-neutral-800 bg-neutral-950/70 min-h-[260px] sm:min-h-[320px] md:min-h-[360px] p-3 flex items-center justify-center">
              {data.cover_image ? (
                <img
                  src={resolveMediaUrl(data.cover_image)}
                  alt={title}
                  className="max-w-full w-auto h-auto max-h-[70vh]"
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-neutral-200">{isAr ? "لا توجد صورة" : "No cover image"}</div>
              )}
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="space-y-4">
            <InfoCard title={isAr ? "نظرة عامة" : "Overview"} body={description || summary} bodyFont={data.body_font_size} />

            <div className="grid md:grid-cols-2 gap-4">
              {goals ? <InfoCard title={isAr ? "الأهداف" : "Goals"} body={goals} bodyFont={data.body_font_size} /> : null}
              {challenges ? <InfoCard title={isAr ? "التحديات" : "Challenges"} body={challenges} bodyFont={data.body_font_size} /> : null}
              {solution ? <InfoCard title={isAr ? "الحل والمنهجية" : "Solution & approach"} body={solution} bodyFont={data.body_font_size} /> : null}
              {results ? <InfoCard title={isAr ? "النتائج والأثر" : "Outcomes & impact"} body={results} bodyFont={data.body_font_size} /> : null}
            </div>

            {gallery.length > 0 ? (
              <div className="neo-panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "معرض الوسائط" : "Gallery"}</h3>
                  <span className="text-xs text-secondary/60 dark:text-neutral-400">{gallery.length} {isAr ? "عنصر" : "items"}</span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryUrls.map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="group relative overflow-hidden rounded-xl border border-accent/40 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary bg-white/60 dark:bg-neutral-950/40"
                      aria-label={isAr ? "معاينة الوسائط" : "Preview media"}
                    >
                      {isVideoUrl(src) ? (
                        <div className="relative">
                          <video src={src} className="w-full aspect-[16/10] object-contain p-2 transition duration-300 group-hover:scale-[1.01]" muted playsInline preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center text-white/90 text-3xl">▶</div>
                        </div>
                      ) : (
                        <img src={src} alt={data.title} className="w-full aspect-[16/10] object-contain p-2 transition duration-300 group-hover:scale-[1.01]" loading="lazy" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            {chips.length > 0 ? (
              <div className="neo-panel p-4 space-y-2">
                <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "بيانات المشروع" : "Project facts"}</h3>
                <ul className="space-y-2 text-sm text-secondary/80 dark:text-neutral-300">
                  {chips.map((c) => (
                    <li key={c.label} className="flex items-center justify-between gap-3 border-b border-accent/30 dark:border-neutral-800 pb-2 last:border-none last:pb-0">
                      <span className="text-secondary/70 dark:text-neutral-400">{c.label}</span>
                      <span className="font-semibold text-secondary dark:text-neutral-50 text-end">{c.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {data.technologies && data.technologies.length > 0 ? (
              <div className="neo-panel p-4 space-y-3">
                <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "التقنيات" : "Tech stack"}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-secondary/80 dark:text-neutral-300">
                  {data.technologies.map((tech) => (
                    <span key={tech.id} className="px-3 py-1 rounded-full border border-accent/50 dark:border-neutral-700 bg-surface dark:bg-neutral-800">
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <ImageLightbox
        open={lightboxOpen}
        images={galleryUrls}
        startIndex={lightboxIndex}
        title={title}
        onClose={() => setLightboxOpen(false)}
      />
    </Layout>
  );
}

function InfoCard({ title, body, bodyFont }: { title: string; body?: string; bodyFont?: number }) {
  if (!body) return null;
  return (
    <div className="neo-panel p-4 space-y-2">
      <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{title}</h3>
      <p className="leading-7 text-secondary/80 dark:text-neutral-300 whitespace-pre-wrap" style={{ fontSize: (bodyFont || 16) + "px" }}>
        {body}
      </p>
    </div>
  );
}
