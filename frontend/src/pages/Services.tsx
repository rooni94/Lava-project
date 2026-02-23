import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchServices, fetchPageBySlug } from "../api/endpoints";
import ServiceCard from "../components/ui/ServiceCard";
import Skeleton from "../components/ui/Skeleton";
import { Service, Page, Section } from "../types";
import Reveal from "../components/ui/Reveal";

const isSoftwareService = (service: Service) => {
  const text = `${service.title} ${service.title_en || ""} ${service.description} ${service.description_en || ""} ${service.icon || ""}`.toLowerCase();
  return /(web|website|app|mobile|system|erp|crm|platform|code|dev|cloud|dashboard)/.test(text);
};

const getExtraString = (section: Section, key: string): string => {
  const extra = (section.extra || {}) as Record<string, unknown>;
  const raw = extra[key];
  return typeof raw === "string" ? raw : "";
};

type ProcessStep = { title: string; body: string };

function extractProcessSteps(sections: Section[], isAr: boolean): ProcessStep[] {
  const steps = sections
    .filter((s) => s.section_type === "process_step")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (!steps.length) {
    return isAr
      ? [
          { title: "استكشاف", body: "تحليل الهدف التجاري واحتياج المستخدم والنطاق الفني." },
          { title: "تصميم الحل", body: "بناء تصور المنتج والرسالة التسويقية في مسار موحد." },
          { title: "التنفيذ", body: "تطوير + إنتاج + حملات بإيقاع أسبوعي واضح." },
          { title: "التحسين", body: "قراءة النتائج وتحسين التجربة والعائد بشكل مستمر." },
        ]
      : [
          { title: "Discovery", body: "Analyze business goals, user needs, and technical constraints." },
          { title: "Solution design", body: "Shape product direction and campaign narrative as one system." },
          { title: "Build", body: "Ship engineering, production, and campaigns in weekly cycles." },
          { title: "Optimize", body: "Use real performance data to refine both product and growth." },
        ];
  }

  return steps.map((step) => ({
    title: isAr ? step.title : getExtraString(step, "title_en") || step.title,
    body: isAr ? step.content : getExtraString(step, "content_en") || step.content,
  }));
}

function extractHeroContent(sections: Section[], isAr: boolean) {
  const heroSection = sections.find((s) => s.section_type === "hero");
  if (!heroSection) {
    return {
      badge: isAr ? "مسارين في نظام واحد" : "Dual-track execution",
      title: isAr ? "هندسة برمجيات + تسويق أداء في منظومة واحدة" : "Software engineering + performance marketing in one system",
      subtitle: isAr
        ? "نصمم المنتجات ونبنيها ونسوقها ضمن فريق واحد، لذلك لا يوجد تعارض بين الإطلاق التقني والأهداف التسويقية."
        : "We design, build, and scale products with one integrated team so technical launches and growth goals move together.",
    };
  }

  return {
    badge: isAr ? getExtraString(heroSection, "badge_ar") || heroSection.title : getExtraString(heroSection, "badge_en") || getExtraString(heroSection, "title_en") || heroSection.title,
    title: isAr ? heroSection.content : getExtraString(heroSection, "title_en") || heroSection.content,
    subtitle: isAr ? getExtraString(heroSection, "subtitle_ar") || "" : getExtraString(heroSection, "subtitle_en") || "",
  };
}

function extractSectionTitle(sections: Section[], sectionType: string, isAr: boolean) {
  const section = sections.find((s) => s.section_type === sectionType);
  if (!section) return { title: "", subtitle: "" };
  return {
    title: isAr ? section.title : getExtraString(section, "title_en") || section.title,
    subtitle: isAr ? section.content : getExtraString(section, "content_en") || section.content,
  };
}

export default function ServicesPage() {
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ["services-page"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: page } = useQuery<Page | null>({
    queryKey: ["page", "services"],
    queryFn: async () => {
      try {
        return await fetchPageBySlug("services");
      } catch {
        return null;
      }
    },
  });

  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { software, marketing } = useMemo(() => {
    const services = servicesData || [];
    return {
      software: services.filter(isSoftwareService),
      marketing: services.filter((service) => !isSoftwareService(service)),
    };
  }, [servicesData]);

  const sections = useMemo(() => page?.sections ?? [], [page]);
  const hero = useMemo(() => extractHeroContent(sections, isAr), [sections, isAr]);
  const process = useMemo(() => extractProcessSteps(sections, isAr), [sections, isAr]);
  const softwareSection = useMemo(() => extractSectionTitle(sections, "section_title", isAr), [sections, isAr]);
  const marketingSection = useMemo(() => {
    const marketingSections = sections.filter((s) => s.section_type === "section_title" && s.order >= 20);
    const section = marketingSections[0];
    if (!section) return { title: "", subtitle: "" };
    return {
      title: isAr ? section.title : getExtraString(section, "title_en") || section.title,
      subtitle: isAr ? section.content : getExtraString(section, "content_en") || section.content,
    };
  }, [sections, isAr]);

  const pageTitle = page ? (isAr ? page.title : page.title_en || page.title) : isAr ? "خدمات LAVA" : "LAVA services";
  const pageDescription = page ? (isAr ? page.meta_description : page.meta_description_en || page.meta_description) : isAr ? "حلول متكاملة تجمع تطوير البرمجيات والتسويق الرقمي ضمن فريق واحد." : "Integrated software and digital marketing services delivered by one coordinated team.";

  return (
    <Layout>
      <MetaHead title={pageTitle} description={pageDescription} />

      <section className="py-14 container mx-auto px-4 space-y-10 text-secondary dark:text-neutral-100">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -top-24 -left-16 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl dark:bg-white/5" />
          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {hero.badge}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-secondary dark:text-neutral-50">
                {hero.title}
              </h1>
              {hero.subtitle && (
                <p className="text-secondary/75 dark:text-neutral-300 max-w-3xl leading-8">
                  {hero.subtitle}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {process.map((step, idx) => (
                <Reveal key={step.title} delay={idx * 0.08}>
                  <div className="rounded-2xl border border-accent/45 dark:border-neutral-700 bg-white/75 dark:bg-neutral-900/65 p-4 h-full">
                    <div className="text-xs uppercase tracking-[0.16em] text-secondary/60 dark:text-neutral-400">
                      {isAr ? `المرحلة ${idx + 1}` : `Step ${idx + 1}`}
                    </div>
                    <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50 mt-1">{step.title}</h3>
                    <p className="text-sm text-secondary/75 dark:text-neutral-300 leading-7 mt-2">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-10">
          <section className="space-y-6">
            <SectionTitle
              align="start"
              title={softwareSection.title || (isAr ? "خدمات التطوير البرمجي" : "Software development services")}
              subtitle={softwareSection.subtitle || (isAr ? "منصات ويب وتطبيقات وأنظمة أعمال مبنية للاستقرار والتوسع." : "Web platforms, apps, and business systems built for long-term scale.")}
            />

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {servicesLoading ? (
                <Skeleton className="h-40 w-full col-span-full" />
              ) : software.length ? (
                software.map((service) => <ServiceCard key={service.id} service={service} />)
              ) : (
                <div className="col-span-full text-secondary/70 dark:text-neutral-300">
                  {isAr ? "لا توجد خدمات تطوير منشورة حالياً." : "No software services published yet."}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle
              align="start"
              title={marketingSection.title || (isAr ? "خدمات التسويق الرقمي" : "Digital marketing services")}
              subtitle={marketingSection.subtitle || (isAr ? "محتوى وإنتاج مرئي وحملات أداء مرتبطة ببيانات حقيقية." : "Content, production, and performance campaigns tied to measurable outcomes.")}
            />

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {servicesLoading ? (
                <Skeleton className="h-40 w-full col-span-full" />
              ) : marketing.length ? (
                marketing.map((service) => <ServiceCard key={service.id} service={service} />)
              ) : (
                <div className="col-span-full text-secondary/70 dark:text-neutral-300">
                  {isAr ? "لا توجد خدمات تسويق منشورة حالياً." : "No marketing services published yet."}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </Layout>
  );
}
