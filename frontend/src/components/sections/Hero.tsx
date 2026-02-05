import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchSiteSettings } from "../../api/endpoints";
import Skeleton from "../ui/Skeleton";

export default function Hero() {
  const { data, isLoading } = useQuery({ queryKey: ["site-settings"], queryFn: fetchSiteSettings });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const heroTitle = isAr
    ? data?.hero_title || "LAVA – تسويق، محتوى، وتصميم يلتقي مع برمجة وأنظمة متينة"
    : data?.hero_title_en || "LAVA – Marketing, content, design meet solid engineering";
  const heroSubtitle = isAr
    ? data?.hero_subtitle ||
      "نحو نمو بلا حدود عبر الإبداع والبرمجة: نصوغ الرسالة ونطلق الحملات ونبني المواقع والتطبيقات ولوحات التحكم لقياس الأثر."
    : data?.hero_subtitle_en ||
      "Limitless growth through creativity and code: we craft the story, launch campaigns, and build the sites, apps, and dashboards that deliver measurable impact.";
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
          <p className="text-secondary/80 dark:text-neutral-300 leading-8">{heroSubtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-primary text-white shadow hover:shadow-md transition-shadow"
            >
              {isAr ? "احجز مكالمة" : "Book a call"}
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
