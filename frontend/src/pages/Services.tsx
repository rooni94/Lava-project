import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchServices } from "../api/endpoints";
import ServiceCard from "../components/ui/ServiceCard";
import Skeleton from "../components/ui/Skeleton";
import { Service } from "../types";
import Reveal from "../components/ui/Reveal";

const isSoftwareService = (service: Service) => {
  const text = `${service.title} ${service.title_en || ""} ${service.description} ${service.description_en || ""} ${service.icon || ""}`.toLowerCase();
  return /(web|website|app|mobile|system|erp|crm|platform|code|dev|cloud|dashboard)/.test(text);
};

export default function ServicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["services-page"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { software, marketing } = useMemo(() => {
    const services = data || [];
    return {
      software: services.filter(isSoftwareService),
      marketing: services.filter((service) => !isSoftwareService(service)),
    };
  }, [data]);

  const process = isAr
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

  return (
    <Layout>
      <MetaHead
        title={isAr ? "خدمات LAVA" : "LAVA services"}
        description={
          isAr
            ? "حلول متكاملة تجمع تطوير البرمجيات والتسويق الرقمي ضمن فريق واحد."
            : "Integrated software and digital marketing services delivered by one coordinated team."
        }
      />

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
                {isAr ? "مسارين في نظام واحد" : "Dual-track execution"}
              </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
        {isAr ? "خدمات متكاملة: برمجة، تسويق، تصميم، إنتاج" : "Integrated Services: Programming, Marketing, Design, Production"}
      </h1>
              <p className="text-secondary/75 dark:text-neutral-300 max-w-3xl leading-8">
                {isAr
                  ? "نصمم المنتجات ونبنيها ونسوقها ضمن فريق واحد، لذلك لا يوجد تعارض بين الإطلاق التقني والأهداف التسويقية."
                  : "We design, build, and scale products with one integrated team so technical launches and growth goals move together."}
               نحن نركز على برمجة سعودية و تسويق رقمي و تصميم مواقع و إنتاج فيديوهات و تطوير تطبيقات.</p>
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
              title={isAr ? "خدمات التطوير البرمجي" : "Software development services"}
              subtitle={
                isAr
                  ? "منصات ويب وتطبيقات وأنظمة أعمال مبنية للاستقرار والتوسع."
                  : "Web platforms, apps, and business systems built for long-term scale."
              }
            />

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
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
              title={isAr ? "خدمات التسويق الرقمي" : "Digital marketing services"}
              subtitle={
                isAr
                  ? "محتوى وإنتاج مرئي وحملات أداء مرتبطة ببيانات حقيقية."
                  : "Content, production, and performance campaigns tied to measurable outcomes."
              }
            />

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
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
