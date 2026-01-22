import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Project } from "../../types";
import { resolveMediaUrl } from "../../utils/media";

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

export default function ProjectCard({ project }: { project: Project }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const detailHref = `/portfolio/${project.id}`;
  const labels = isAr ? categoryLabels.ar : categoryLabels.en;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow border border-accent/30 dark:border-neutral-800"
      style={{ fontFamily: project.body_font_family || "Space Grotesk" }}
    >
      <Link to={detailHref} className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
        <div
          className="h-48 bg-gradient-to-br relative rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${(project.primary_color as string) || "#8A1538"}1a, ${
              (project.accent_color as string) || "#111827"
            }0f)`,
          }}
        >
          {project.cover_image ? (
            <img
              src={resolveMediaUrl(project.cover_image)}
              alt={project.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-primary font-bold">LAVA</div>
          )}
        </div>
      </Link>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Link to={detailHref} className="focus:outline-none focus:ring-2 focus:ring-primary rounded">
            <h3
              className="text-xl font-bold text-secondary dark:text-neutral-50"
              style={{
                fontFamily: project.title_font_family || "Space Grotesk",
                fontSize: (project.title_font_size || 20) + "px",
              }}
            >
              {project.title}
            </h3>
          </Link>
          <span className="text-xs px-3 py-1 rounded-full bg-accent text-secondary">
            {labels[project.category as keyof typeof labels] || project.category}
          </span>
        </div>
        <p className="text-sm text-secondary/80 dark:text-neutral-300 line-clamp-3">{project.description}</p>
        {project.scope && (
          <div className="text-xs text-secondary/70 dark:text-neutral-400 flex gap-3 flex-wrap">
            <span>{isAr ? "النطاق:" : "Scope:"} {project.scope}</span>
            {project.duration && <span>{isAr ? "المدة:" : "Duration:"} {project.duration}</span>}
            {project.client && <span>{isAr ? "العميل:" : "Client:"} {project.client}</span>}
          </div>
        )}
        {project.technologies && (
          <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-neutral-300">
            {project.technologies.map((tech) => (
              <span key={tech.id} className="px-2 py-1 bg-surface dark:bg-neutral-800 border border-accent/50 dark:border-neutral-700 rounded-full">
                {tech.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 text-sm">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="text-primary font-semibold">
              {isAr ? "زيارة المشروع" : "View live product"}
            </a>
          )}
          <Link to={`/portfolio/${project.id}`} className="text-secondary/80 dark:text-neutral-300 underline">
            {isAr ? "تفاصيل العمل" : "Project details"}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
