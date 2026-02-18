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

const statusLabels = {
  ar: { draft: "مسودة", in_progress: "قيد التنفيذ", done: "منجز" },
  en: { draft: "Draft", in_progress: "In progress", done: "Done" },
};

export default function ProjectCard({ project }: { project: Project }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const pickText = (ar?: string, en?: string) => (isAr ? ar : en || ar);
  const detailHref = `/portfolio/${project.id}`;
  const labels = isAr ? categoryLabels.ar : categoryLabels.en;
  const statusLabel = isAr ? statusLabels.ar[project.status as keyof typeof statusLabels.ar] : statusLabels.en[project.status as keyof typeof statusLabels.en];
  const title = pickText(project.title, project.title_en);
  const description = pickText(project.description, project.description_en);
  const client = pickText(project.client, project.client_en);
  const scope = pickText(project.scope, project.scope_en);
  const duration = pickText(project.duration, project.duration_en);

  const gradientBg = `linear-gradient(135deg, ${(project.primary_color as string) || "#580213"}1a, ${
    (project.accent_color as string) || "#0f172a"
  }12)`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl bg-white/90 dark:bg-neutral-900/90 shadow-[0_14px_36px_rgba(15,23,42,0.12)] border border-accent/40 dark:border-neutral-800"
      style={{ fontFamily: project.body_font_family || "Manrope" }}
    >
      <Link to={detailHref} className="block focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl">
        <div className="h-52 relative rounded-3xl overflow-hidden bg-gradient-to-br" style={{ background: gradientBg }}>
          {project.cover_image ? (
            <img
              src={resolveMediaUrl(project.cover_image)}
              alt={project.title}
              className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-primary font-semibold text-lg">LAVA</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {project.is_featured ? (
              <span className="px-3 py-1 text-xs rounded-full bg-primary text-white shadow-sm">
                {isAr ? "مميز" : "Featured"}
              </span>
            ) : null}
            <span className="px-3 py-1 text-xs rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700 text-secondary dark:text-neutral-100">
              {labels[project.category as keyof typeof labels] || project.category}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 text-secondary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            {isAr ? "عرض التفاصيل" : "View details"}
          </div>
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <Link to={detailHref} className="focus:outline-none focus:ring-2 focus:ring-primary rounded">
            <h3
              className="text-lg md:text-xl font-bold text-secondary dark:text-neutral-50 leading-tight"
              style={{
                fontFamily: project.title_font_family || "var(--font-heading-ltr, Sora)",
                fontSize: (project.title_font_size || 20) + "px",
              }}
            >
              {title}
            </h3>
          </Link>
          <p className="text-sm text-secondary/80 dark:text-neutral-300 line-clamp-3">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-neutral-300">
          {client && (
            <span className="px-3 py-1 rounded-full bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700">
              {isAr ? "العميل:" : "Client:"} {client}
            </span>
          )}
          {scope && (
            <span className="px-3 py-1 rounded-full bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700">
              {isAr ? "النطاق:" : "Scope:"} {scope}
            </span>
          )}
          {duration && (
            <span className="px-3 py-1 rounded-full bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700">
              {isAr ? "المدة:" : "Duration:"} {duration}
            </span>
          )}
          {project.status && (
            <span className="px-3 py-1 rounded-full bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700">
              {isAr ? "الحالة:" : "Status:"} {statusLabel || project.status}
            </span>
          )}
        </div>

        {project.technologies && project.technologies.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-neutral-300">
            {project.technologies.map((tech) => (
              <span
                key={tech.id}
                className="px-2 py-1 rounded-full border border-accent/50 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800"
              >
                {tech.name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-4 text-sm">
          <Link to={detailHref} className="text-primary font-semibold hover:underline">
            {isAr ? "تفاصيل العمل" : "View details"}
          </Link>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="text-secondary/80 dark:text-neutral-300 hover:underline"
            >
              {isAr ? "زيارة المشروع" : "Live demo"}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
