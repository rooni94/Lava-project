import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchPages, fetchSections, fetchSiteSettings } from "../../api/endpoints";
import Skeleton from "../ui/Skeleton";
import { Page, Section } from "../../types";

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
    <section className="gradient-hero py-16 text-secondary dark:text-neutral-100">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold leading-snug text-secondary dark:text-neutral-50"
          >
            {heroTitle}
          </motion.h1>
          <div
            className="text-secondary/80 dark:text-neutral-300 leading-8"
            dangerouslySetInnerHTML={{ __html: heroSubtitle }}
          />
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-primary text-white shadow hover:shadow-md transition-shadow"
            >
              {isAr ? "اطلب عرض" : "Book a call"}
            </Link>
            <Link
              to="/portfolio"
              className="px-6 py-3 rounded-full border border-secondary text-secondary dark:border-neutral-500 dark:text-neutral-100 hover:border-primary"
            >
              {isAr ? "تصفح الأعمال" : "View portfolio"}
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-neutral-900 shadow-xl rounded-3xl p-6 border border-accent/40 dark:border-neutral-800 min-h-[180px]"
        >
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Stat label={isAr ? "مشاريع منجزة" : "Delivered projects"} value={50} suffix="+" />
              <Stat label={isAr ? "عملاء موثوقون" : "Trusted clients"} value={30} suffix="+" />
              <Stat label={isAr ? "سنوات خبرة" : "Years of experience"} value={5} suffix="+" />
              <Stat label={isAr ? "رضا العملاء" : "Client satisfaction"} value={98} suffix="%" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="p-4 rounded-2xl bg-surface dark:bg-neutral-900 border border-accent/60 dark:border-neutral-800 text-center">
      <div className="text-2xl font-bold text-primary mb-1">
        <CountUp end={value} suffix={suffix} duration={2} />
      </div>
      <div className="text-sm text-secondary/70 dark:text-neutral-300">{label}</div>
    </div>
  );
}
