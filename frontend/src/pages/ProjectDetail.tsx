import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import SectionTitle from "../components/ui/SectionTitle";
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

export default function ProjectDetail() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const labels = isAr ? categoryLabels.ar : categoryLabels.en;
  const { data, isLoading } = useQuery<Project | undefined>({
    queryKey: ["project", id],
    queryFn: () => fetchProject(String(id)),
    enabled: Boolean(id),
  });

  const gallery: string[] = data?.gallery || [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const goto = (dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + gallery.length) % gallery.length;
    setLightboxIndex(next);
  };

  if (isLoading || !data) {
    return (
      <Layout>
        <section className="py-14 container mx-auto px-4">
          <Skeleton className="h-64 w-full" />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <MetaHead title={data.title} description={data.description} image={data.cover_image} />
      <section
        className="py-14 container mx-auto px-4 space-y-6 text-secondary dark:text-neutral-100"
        style={{ fontFamily: data.body_font_family || "Space Grotesk" }}
      >
        <SectionTitle
          title={data.title}
          subtitle={data.client || labels[data.category as keyof typeof labels] || (isAr ? "العميل" : "Client")}
          titleStyle={{
            fontFamily: data.title_font_family || "Space Grotesk",
            fontSize: (data.title_font_size || 28) + "px",
            color: data.primary_color || "#8A1538",
          }}
        />

        {data.cover_image && (
          <img
            src={resolveMediaUrl(data.cover_image)}
            alt={data.title}
            className="w-full max-h-[360px] object-cover rounded-2xl border border-accent/30 dark:border-neutral-800"
            loading="lazy"
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50" style={{ fontFamily: data.title_font_family }}>
              {isAr ? "ملخص سريع" : "Quick summary"}
            </h3>
            <p className="leading-7 text-secondary/80 dark:text-neutral-300" style={{ fontSize: (data.body_font_size || 16) + "px" }}>
              {data.summary || data.description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-secondary/70 dark:text-neutral-300">
              {data.client && (
                <span className="px-3 py-1 rounded bg-surface dark:bg-neutral-900 border dark:border-neutral-800">
                  {isAr ? "العميل:" : "Client:"} {data.client}
                </span>
              )}
              {data.duration && (
                <span className="px-3 py-1 rounded bg-surface dark:bg-neutral-900 border dark:border-neutral-800">
                  {isAr ? "المدة:" : "Duration:"} {data.duration}
                </span>
              )}
              {data.scope && (
                <span className="px-3 py-1 rounded bg-surface dark:bg-neutral-900 border dark:border-neutral-800">
                  {isAr ? "النطاق:" : "Scope:"} {data.scope}
                </span>
              )}
              {data.team_size && (
                <span className="px-3 py-1 rounded bg-surface dark:bg-neutral-900 border dark:border-neutral-800">
                  {isAr ? "الفريق:" : "Team:"} {data.team_size}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50" style={{ fontFamily: data.title_font_family }}>
              {isAr ? "أرقام وروابط" : "Links & resources"}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {data.live_url && (
                <a
                  href={data.live_url}
                  className="px-4 py-2 rounded-full bg-primary text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  {isAr ? "زيارة المشروع" : "View live product"}
                </a>
              )}
              {data.github_url && (
                <a
                  href={data.github_url}
                  className="px-4 py-2 rounded-full border border-primary text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {isAr ? "الاطلاع على الكود" : "View repository"}
                </a>
              )}
            </div>
            {data.technologies && (
              <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-neutral-300">
                {data.technologies.map((tech) => (
                  <span key={tech.id} className="px-2 py-1 bg-surface dark:bg-neutral-900 border border-accent/50 dark:border-neutral-800 rounded-full">
                    {tech.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.goals && (
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-secondary dark:text-neutral-50" style={{ fontFamily: data.title_font_family }}>
                {isAr ? "الأهداف" : "Goals"}
              </h3>
              <p className="leading-7 text-secondary/80 dark:text-neutral-300" style={{ fontSize: (data.body_font_size || 16) + "px" }}>
                {data.goals}
              </p>
            </div>
          )}
          {data.challenges && (
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-secondary dark:text-neutral-50" style={{ fontFamily: data.title_font_family }}>
                {isAr ? "التحديات" : "Challenges"}
              </h3>
              <p className="leading-7 text-secondary/80 dark:text-neutral-300" style={{ fontSize: (data.body_font_size || 16) + "px" }}>
                {data.challenges}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.solution && (
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-secondary dark:text-neutral-50" style={{ fontFamily: data.title_font_family }}>
                {isAr ? "الحل والمنهجية" : "Solution & approach"}
              </h3>
              <p className="leading-7 text-secondary/80 dark:text-neutral-300" style={{ fontSize: (data.body_font_size || 16) + "px" }}>
                {data.solution}
              </p>
            </div>
          )}
          {data.results && (
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-secondary dark:text-neutral-50" style={{ fontFamily: data.title_font_family }}>
                {isAr ? "النتائج والأثر" : "Outcomes & impact"}
              </h3>
              <p className="leading-7 text-secondary/80 dark:text-neutral-300" style={{ fontSize: (data.body_font_size || 16) + "px" }}>
                {data.results}
              </p>
            </div>
          )}
        </div>

        {gallery.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => openLightbox(idx)}
                  className="rounded-xl border border-accent/30 dark:border-neutral-800 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={resolveMediaUrl(img)}
                    alt={data.title}
                    className="object-cover w-full h-48 transition hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {lightboxIndex !== null && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <button
                  className="absolute top-6 right-6 text-white text-2xl"
                  onClick={closeLightbox}
                  aria-label={isAr ? "إغلاق" : "Close"}
                >
                  X
                </button>
                <div className="relative max-w-5xl w-full">
                  <img
                    src={resolveMediaUrl(gallery[lightboxIndex])}
                    alt={data.title}
                    className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                  />
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={() => goto(-1)}
                        className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/50 text-white px-3 py-2 rounded-full"
                        aria-label={isAr ? "السابق" : "Previous"}
                      >
                        &lsaquo;
                      </button>
                      <button
                        onClick={() => goto(1)}
                        className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/50 text-white px-3 py-2 rounded-full"
                        aria-label={isAr ? "التالي" : "Next"}
                      >
                        &rsaquo;
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-2 right-4 text-white text-sm">
                    {lightboxIndex + 1} / {gallery.length}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
