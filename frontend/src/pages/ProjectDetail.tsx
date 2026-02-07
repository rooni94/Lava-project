import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import Skeleton from "../components/ui/Skeleton";
import { fetchProject } from "../api/endpoints";
import { Project } from "../types";
import { resolveMediaUrl } from "../utils/media";

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

  return (
    <Layout>
      <MetaHead title={title} description={description} image={data.cover_image} />
      <section
        className="py-14 container mx-auto px-4 space-y-8 text-secondary dark:text-neutral-100"
        style={{ fontFamily: data.body_font_family || "Space Grotesk" }}
      >
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/12 via-rose-50 to-white dark:from-primary/20 dark:via-neutral-900 dark:to-neutral-950 border border-accent/40 dark:border-neutral-800 shadow-2xl">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-14 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-center px-6 py-8 md:px-10 md:py-12">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {labels[data.category as keyof typeof labels] || data.category}
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight text-secondary dark:text-white"
                style={{
                  fontFamily: data.title_font_family || "Space Grotesk",
                  color: data.primary_color || undefined,
                }}
              >
                {title}
              </h1>
              <p
                className="text-secondary/80 dark:text-neutral-200 whitespace-pre-wrap"
                style={{ fontSize: (data.body_font_size || 16) + "px" }}
              >
                {summary}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-neutral-300">
                {chips.map((c) => (
                  <span
                    key={c.label}
                    className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700"
                  >
                    {c.label}: {c.value}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                {data.live_url && (
                  <a
                    href={data.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-primary text-white shadow hover:shadow-md"
                  >
                    {isAr ? "زيارة المشروع" : "View live project"}
                  </a>
                )}
                {data.github_url && (
                  <a
                    href={data.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary/10"
                  >
                    {isAr ? "عرض الكود" : "View repository"}
                  </a>
                )}
              </div>
            </div>

          <div className="rounded-2xl overflow-hidden border border-accent/40 dark:border-neutral-800 bg-neutral-900/70">
              {data.cover_image ? (
                <img
                  src={resolveMediaUrl(data.cover_image)}
                  alt={title}
                  className="w-full h-full max-h-[360px] object-cover"
                />
              ) : (
                <div className="h-full min-h-[260px] grid place-items-center text-neutral-200">{isAr ? "لا توجد صورة" : "No cover image"}</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="space-y-4">
            <InfoCard title={isAr ? "نظرة عامة" : "Overview"} body={description || summary} bodyFont={data.body_font_size} />

            <div className="grid md:grid-cols-2 gap-4">
              {goals && <InfoCard title={isAr ? "الأهداف" : "Goals"} body={goals} bodyFont={data.body_font_size} />}
              {challenges && (
                <InfoCard title={isAr ? "التحديات" : "Challenges"} body={challenges} bodyFont={data.body_font_size} />
              )}
              {solution && (
                <InfoCard title={isAr ? "الحل والمنهجية" : "Solution & approach"} body={solution} bodyFont={data.body_font_size} />
              )}
              {results && (
                <InfoCard title={isAr ? "النتائج والأثر" : "Outcomes & impact"} body={results} bodyFont={data.body_font_size} />
              )}
            </div>

            {gallery.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "معرض الصور" : "Gallery"}</h3>
                  <span className="text-xs text-secondary/60 dark:text-neutral-400">{gallery.length} {isAr ? "صورة" : "images"}</span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((img) => (
                    <img
                      key={img}
                      src={resolveMediaUrl(img)}
                      alt={data.title}
                      className="w-full h-32 object-cover rounded-xl border border-accent/40 dark:border-neutral-800"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            {chips.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-2">
                <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "بيانات المشروع" : "Project facts"}</h3>
                <ul className="space-y-2 text-sm text-secondary/80 dark:text-neutral-300">
                  {chips.map((c) => (
                    <li key={c.label} className="flex items-center justify-between gap-3 border-b border-accent/30 dark:border-neutral-800 pb-2 last:border-none last:pb-0">
                      <span className="text-secondary/70 dark:text-neutral-400">{c.label}</span>
                      <span className="font-semibold text-secondary dark:text-neutral-50">{c.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.technologies && data.technologies.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3">
                <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "التقنيات" : "Tech stack"}</h3>
                <div className="flex flex-wrap gap-2 text-xs text-secondary/80 dark:text-neutral-300">
                  {data.technologies.map((tech) => (
                    <span key={tech.id} className="px-3 py-1 rounded-full border border-accent/50 dark:border-neutral-700 bg-surface dark:bg-neutral-800">
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(data.live_url || data.github_url) && (
              <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-2 text-sm">
                <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "روابط" : "Links"}</h3>
                {data.live_url && (
                  <a
                    href={data.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-2 rounded-xl border border-accent/50 dark:border-neutral-700 hover:border-primary text-primary"
                  >
                    {isAr ? "الموقع المباشر" : "Live link"}
                  </a>
                )}
                {data.github_url && (
                  <a
                    href={data.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-2 rounded-xl border border-accent/50 dark:border-neutral-700 hover:border-primary text-secondary dark:text-neutral-100"
                  >
                    {isAr ? "المستودع" : "Repository"}
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function InfoCard({ title, body, bodyFont }: { title: string; body?: string; bodyFont?: number }) {
  if (!body) return null;
  return (
    <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-2">
      <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{title}</h3>
      <p className="leading-7 text-secondary/80 dark:text-neutral-300 whitespace-pre-wrap" style={{ fontSize: (bodyFont || 16) + "px" }}>
        {body}
      </p>
    </div>
  );
}
