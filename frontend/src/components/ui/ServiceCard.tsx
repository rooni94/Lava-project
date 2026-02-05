import { motion } from "framer-motion";
import { Service } from "../../types";

export const serviceIcons = {
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
  content: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M7 8h10M7 12h7M7 16h5" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="4" y="5" width="14" height="14" rx="2" />
      <path d="M14 12.5 10.5 10v5z" fill="white" stroke="none" />
      <path d="M18 9.5v5l2.5 1.5v-8z" />
    </svg>
  ),
  ads: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <circle cx="7" cy="12" r="3" />
      <path d="M10 12h8" />
      <path d="M14 8l4 4-4 4" />
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
  ecommerce: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M4 6h17l-2 9H6z" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="16" cy="18" r="1" />
      <path d="M4 6 3 3" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 4v3M15 4v3M9 17v3M15 17v3M4 9h3M4 15h3M17 9h3M17 15h3" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M12 3l3 6 6 .5-4.5 4 1.5 6-6-3-6 3 1.5-6L3 9.5 9 9l3-6z" />
    </svg>
  ),
};

export const serviceIconKeys = Object.keys(serviceIcons);
export const serviceIconOptions = serviceIconKeys.map((key) => ({ value: key, label: key }));

function pickIcon(service: Service) {
  if (service.icon && serviceIconKeys.includes(service.icon)) return serviceIcons[service.icon as keyof typeof serviceIcons];
  const t = (service.title || "").toLowerCase();
  if (/content|copy|voice/.test(t)) return serviceIcons.content;
  if (/video|motion|reel/.test(t)) return serviceIcons.video;
  if (/ads|seo|growth|campaign/.test(t)) return serviceIcons.ads;
  if (/design|brand|ui|ux/.test(t)) return serviceIcons.design;
  if (/mobile|app/.test(t)) return serviceIcons.mobile;
  if (/web|dev|code|platform/.test(t)) return serviceIcons.code;
  if (/erp|crm|system/.test(t)) return serviceIcons.erp;
  if (/data|analytics|ai|ml|insight/.test(t)) return serviceIcons.data;
  if (/cloud|infra|network/.test(t)) return serviceIcons.cloud;
  if (/support|maintenance|ops/.test(t)) return serviceIcons.support;
  if (/security|privacy/.test(t)) return serviceIcons.security;
  if (/commerce|store|shop/.test(t)) return serviceIcons.ecommerce;
  return serviceIcons.default;
}

export default function ServiceCard({ service }: { service: Service }) {
  const icon = pickIcon(service);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow hover:-translate-y-1 transition-transform border border-accent/30 dark:border-neutral-800"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary text-white grid place-items-center">{icon}</div>
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
