import { motion } from "framer-motion";
import { Service } from "../../types";

const icons = {
  design: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M4 16l8-8 4 4-8 8H4v-4z" />
      <path d="M14 6l2-2 4 4-2 2" />
      <path d="M12 8l4 4" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M3 5h18v14H3z" />
      <path d="M3 9h18" />
      <path d="M7 13l2 2-2 2" />
      <path d="M17 13l-2 2 2 2" />
      <circle cx="6" cy="7" r="0.6" fill="white" stroke="none" />
      <circle cx="9" cy="7" r="0.6" fill="white" stroke="none" />
      <circle cx="12" cy="7" r="0.6" fill="white" stroke="none" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M10 6h4" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
      <circle cx="12" cy="18" r="0.9" fill="white" stroke="none" />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M4 10l10-5v14l-10-5v-4z" />
      <path d="M14 12h6" />
      <path d="M14 9h4" />
      <path d="M14 15h3" />
      <path d="M4 14v2a2 2 0 002 2h2" />
    </svg>
  ),
  erp: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="4" y="7" width="16" height="11" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
      <path d="M8 12h8" />
      <path d="M10 15h4" />
    </svg>
  ),
  data: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M7 17h10a4 4 0 000-8 6 6 0 00-11.7 1.5A3.5 3.5 0 007 17z" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15l6-6M9 9h0M15 15h0" strokeLinecap="round" />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M12 3l8 3v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M12 3l3 6 6 .5-4.5 4 1.5 6-6-3-6 3 1.5-6L3 9.5 9 9l3-6z" />
    </svg>
  ),
};

function pickIcon(title?: string, fallback?: string) {
  if (fallback && icons[fallback as keyof typeof icons]) return icons[fallback as keyof typeof icons];
  const t = title || "";
  if (/design|brand|ui|ux/i.test(t)) return icons.design;
  if (/mobile|app/i.test(t)) return icons.mobile;
  if (/web|development|engineer|code|frontend|backend|platform/i.test(t)) return icons.code;
  if (/erp|crm|enterprise|system/i.test(t)) return icons.erp;
  if (/marketing|seo|ads|growth/i.test(t)) return icons.marketing;
  if (/data|analytics|ai|ml|insight/i.test(t)) return icons.data;
  if (/cloud|infrastructure|network/i.test(t)) return icons.cloud;
  if (/support|maintenance|ops/i.test(t)) return icons.support;
  if (/security|privacy|defense/i.test(t)) return icons.security;
  return icons.default;
}

export default function ServiceCard({ service }: { service: Service }) {
  const icon = pickIcon(service.title, service.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow hover:-translate-y-1 transition-transform border border-accent/30 dark:border-neutral-800"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary text-white grid place-items-center text-xl font-bold tracking-wide">
          <span className="text-white">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">{service.title}</h3>
      </div>
      <p className="text-sm text-secondary/80 dark:text-neutral-300 mb-3 leading-7">{service.description}</p>
      {service.features && (
        <ul className="text-sm text-secondary/80 dark:text-neutral-300 space-y-1 list-disc pl-4">
          {service.features.map((feat, idx) => (
            <li key={idx}>{feat}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
