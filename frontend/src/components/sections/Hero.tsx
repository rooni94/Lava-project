import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchPages, fetchSections, fetchSiteSettings } from "../../api/endpoints";
import Skeleton from "../ui/Skeleton";
import { Page, Section } from "../../types";

const cardMotion = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const { data, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
  const { data: pages } = useQuery<Page[]>({
    queryKey: ["pages-public"],
    queryFn: fetchPages,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
  const homePage = pages?.find((p) => p.slug === "home");
  const { data: sections } = useQuery<Section[]>({
    queryKey: ["sections-public", homePage?.id],
    queryFn: () => fetchSections(homePage?.id),
    enabled: !!homePage?.id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const heroSection = sections?.find((sec) => sec.section_type === "hero");
  const heroExtra = (heroSection?.extra || {}) as Record<string, string>;
  const heroTitle = isAr
    ? heroSection?.title || data?.hero_title || "LAVA Tech: حلول رقمية وتسويق أداء ينمّي أعمالك"
    : heroExtra?.title_en || heroSection?.title || "LAVA Tech: digital products and growth marketing that scale";
  const heroSubtitle = isAr
    ? heroSection?.content ||
      data?.hero_subtitle ||
      "من بناء الهوية والمحتوى إلى تطوير المواقع والتطبيقات وأنظمة ERP/CRM، فريق واحد يسلّم تجربة متكاملة ونتائج قابلة للقياس."
    : heroExtra?.content_en ||
      heroSection?.content ||
      "From brand, content, and strategy to web/apps and ERP/CRM systems, one team delivers cohesive experiences and measurable results.";

  return (
    <section className="relative overflow-hidden py-16 md:py-20 text-secondary dark:text-neutral-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(var(--color-primary),0.14),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(var(--color-secondary),0.1),transparent_36%)] dark:bg-[radial-gradient(circle_at_8%_10%,rgba(var(--color-primary),0.18),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(255,255,255,0.06),transparent_36%)]" />
      <div className="container relative mx-auto px-4 grid lg:grid-cols-[1.08fr_0.92fr] gap-8 items-center">
        <div className="space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
          >
            {isAr ? "برمجة + تسويق رقمي" : "Engineering + digital marketing"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-extrabold leading-snug text-secondary dark:text-neutral-50"
          >
            {heroTitle}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-secondary/80 dark:text-neutral-300 leading-8 max-w-3xl"
            dangerouslySetInnerHTML={{ __html: heroSubtitle }}
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }} className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-primary text-white shadow-[0_12px_28px_rgba(var(--color-primary),0.34)] hover:-translate-y-0.5 transition-transform"
            >
              {isAr ? "اطلب عرض" : "Book a call"}
            </Link>
            <Link
              to="/portfolio"
              className="px-6 py-3 rounded-full border border-secondary/40 text-secondary dark:border-neutral-500 dark:text-neutral-100 hover:border-primary hover:text-primary transition-colors"
            >
              {isAr ? "تصفح الأعمال" : "View portfolio"}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap gap-2 text-xs"
          >
            <span className="px-3 py-1 rounded-full border border-accent/60 bg-white/80 dark:bg-neutral-900/70 dark:border-neutral-700">
              {isAr ? "Software Development" : "Software Development"}
            </span>
            <span className="px-3 py-1 rounded-full border border-accent/60 bg-white/80 dark:bg-neutral-900/70 dark:border-neutral-700">
              {isAr ? "Digital Marketing" : "Digital Marketing"}
            </span>
            <span className="px-3 py-1 rounded-full border border-accent/60 bg-white/80 dark:bg-neutral-900/70 dark:border-neutral-700">
              {isAr ? "ERP/CRM" : "ERP/CRM"}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="surface-glass rounded-3xl p-6 shadow-[0_18px_42px_rgba(15,23,42,0.14)]"
        >
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-secondary/60 dark:text-neutral-400">
                  {isAr ? "مؤشرات سريعة" : "Quick snapshot"}
                </p>
                <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">
                  {isAr ? "فريق واحد للتنفيذ الشامل" : "One integrated delivery team"}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Stat label={isAr ? "مشاريع منجزة" : "Delivered projects"} value={50} suffix="+" />
                <Stat label={isAr ? "عملاء موثوقون" : "Trusted clients"} value={30} suffix="+" />
                <Stat label={isAr ? "سنوات خبرة" : "Years of experience"} value={5} suffix="+" />
                <Stat label={isAr ? "رضا العملاء" : "Client satisfaction"} value={98} suffix="%" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <motion.div variants={cardMotion} className="p-4 rounded-2xl bg-surface/90 dark:bg-neutral-900/70 border border-accent/60 dark:border-neutral-800 text-center">
      <div className="text-2xl font-bold text-primary mb-1">
        <CountUp end={value} suffix={suffix} duration={2} />
      </div>
      <div className="text-xs md:text-sm text-secondary/70 dark:text-neutral-300">{label}</div>
    </motion.div>
  );
}
