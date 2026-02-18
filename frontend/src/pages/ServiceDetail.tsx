import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import Skeleton from "../components/ui/Skeleton";
import Reveal from "../components/ui/Reveal";
import { fetchService } from "../api/endpoints";
import { Service } from "../types";

const steps = {
  ar: [
    { title: "اكتشاف الاحتياج", body: "نفهم الهدف التجاري واحتياج المستخدم وقيود التنفيذ." },
    { title: "تصميم الحل", body: "نحدد المعمارية وتجربة المستخدم وخطة التسليم." },
    { title: "البناء والاختبار", body: "تنفيذ تدريجي مع اختبارات وتجهيزات جاهزية الإطلاق." },
    { title: "الإطلاق والتحسين", body: "متابعة الأداء بعد الإطلاق وتحسين مستمر بناء على البيانات." },
  ],
  en: [
    { title: "Discovery", body: "Align on business goals, user needs, and delivery constraints." },
    { title: "Solution design", body: "Define architecture, UX direction, and sprint delivery plan." },
    { title: "Build and validate", body: "Incremental implementation with testing and launch readiness checks." },
    { title: "Launch and optimize", body: "Track outcomes and refine continuously using real signals." },
  ],
};

const stack = ["React/TypeScript", "Django/Node", "PostgreSQL/Redis", "AWS/GCP", "Docker/Git"];

const useCases = {
  ar: ["بوابات خدمات", "لوحات تحكم", "متاجر إلكترونية", "أنظمة أعمال", "تطبيقات جوال"],
  en: ["Service portals", "Admin dashboards", "E-commerce", "Business systems", "Mobile apps"],
};

export default function ServiceDetail() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data, isLoading } = useQuery<Service | undefined>({
    queryKey: ["service", id],
    queryFn: () => fetchService(String(id)),
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

  const title = data ? (isAr ? data.title : data.title_en || data.title) : isAr ? "تفاصيل الخدمة" : "Service details";
  const description = data
    ? isAr
      ? data.description
      : data.description_en || data.description
    : isAr
      ? "كيف ننفذ المشاريع من الفكرة إلى الإطلاق."
      : "How we take projects from idea to launch with clarity and quality.";

  const features = data
    ? isAr
      ? data.features || []
      : data.features_en?.length
        ? data.features_en
        : data.features || []
    : [];

  const flow = isAr ? steps.ar : steps.en;
  const cases = isAr ? useCases.ar : useCases.en;

  return (
    <Layout>
      <MetaHead title={title} description={description} image={data?.image} />

      <section className="py-14 container mx-auto px-4 space-y-8 text-secondary dark:text-neutral-100">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -left-14 -top-16 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -right-14 -bottom-16 h-60 w-60 rounded-full bg-secondary/10 blur-3xl dark:bg-white/6" />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-secondary/60 dark:text-neutral-400">
                {isAr ? "تفاصيل الخدمة" : "Service blueprint"}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{title}</h1>
              <p className="text-secondary/80 dark:text-neutral-300 leading-8 whitespace-pre-wrap">{description}</p>

              {features.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-xs text-secondary/75 dark:text-neutral-300">
                  {features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full border border-accent/55 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/65"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              {flow.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.07}>
                  <div className="rounded-2xl border border-accent/45 dark:border-neutral-700 bg-white/75 dark:bg-neutral-900/65 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-secondary/60 dark:text-neutral-400">
                      {isAr ? `المرحلة ${index + 1}` : `Step ${index + 1}`}
                    </div>
                    <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50 mt-1">{step.title}</h3>
                    <p className="text-sm text-secondary/75 dark:text-neutral-300 leading-7 mt-2">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal>
            <div className="neo-panel p-5 md:p-6 h-full space-y-3">
              <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">{isAr ? "التقنيات" : "Technology stack"}</h3>
              <ul className={`${isAr ? "pr-4" : "pl-4"} list-disc space-y-2 text-secondary/80 dark:text-neutral-300`}>
                {stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="neo-panel p-5 md:p-6 h-full space-y-3">
              <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">{isAr ? "أمثلة استخدام" : "Typical use cases"}</h3>
              <ul className={`${isAr ? "pr-4" : "pl-4"} list-disc space-y-2 text-secondary/80 dark:text-neutral-300`}>
                {cases.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="neo-panel p-6 md:p-8 relative overflow-hidden text-center space-y-4">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
            <h3 className="text-2xl md:text-3xl font-bold text-secondary dark:text-neutral-50 relative">
              {isAr ? "ابدأ مشروعك معنا" : "Let us scope your project"}
            </h3>
            <p className="text-secondary/80 dark:text-neutral-300 max-w-2xl mx-auto relative">
              {isAr
                ? "نحدد معك النطاق والزمن وخطة التنفيذ في مكالمة قصيرة قبل بدء العمل."
                : "In one short call, we map scope, timeline, and the right delivery model for your goals."}
            </p>
            <a
              href="/contact"
              className="relative inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold shadow-[0_12px_30px_rgba(var(--color-primary),0.35)]"
            >
              {isAr ? "احجز مكالمة" : "Book a call"}
            </a>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}
