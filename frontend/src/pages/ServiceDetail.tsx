import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import SectionTitle from "../components/ui/SectionTitle";
import { useTranslation } from "react-i18next";

const steps = {
  ar: ["اكتشاف الاحتياج", "تصميم الحل", "البناء والاختبار", "الإطلاق والتحسين"],
  en: ["Discovery & alignment", "Solution design", "Build & test", "Launch & improve"],
};
const tech = ["React/TypeScript", "Django/Node", "PostgreSQL/Redis", "AWS/GCP", "Docker/Git"];
const useCases = {
  ar: ["بوابات خدمات", "لوحات تحكم", "متاجر إلكترونية", "أنظمة أعمال", "تطبيقات جوال"],
  en: ["Service portals", "Admin dashboards", "E-commerce", "Business systems", "Mobile apps"],
};

export default function ServiceDetail() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const listSteps = isAr ? steps.ar : steps.en;
  const listUseCases = isAr ? useCases.ar : useCases.en;
  return (
    <Layout>
      <MetaHead
        title={isAr ? "تفاصيل الخدمة" : "Service details"}
        description={
          isAr ? "كيف ننفذ المشاريع من الفكرة إلى الإطلاق." : "How we take projects from idea to launch with clarity and quality."
        }
      />
      <section className="py-14 container mx-auto px-4 space-y-10 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "رحلة تنفيذ الخدمة" : "Our delivery journey"}
          subtitle={isAr ? "خطوات واضحة لضمان جودة المنتج." : "Clear phases to keep quality high and progress visible."}
        />

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-6 shadow space-y-3">
          <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 mb-2">
            {isAr ? "مراحل العمل" : "Project phases"}
          </h3>
          <ul className="flex flex-wrap gap-3">
            {listSteps.map((s, i) => (
              <li key={s} className="px-4 py-2 rounded-full bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700">
                {i + 1}. {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-6 shadow space-y-2">
          <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 mb-2">
            {isAr ? "التقنيات" : "Technologies"}
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-secondary/80 dark:text-neutral-300">
            {tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-6 shadow space-y-2">
          <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 mb-2">
            {isAr ? "أمثلة استخدام" : "Use cases"}
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-secondary/80 dark:text-neutral-300">
            {listUseCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>

        <div className="bg-primary text-white rounded-2xl p-6 shadow text-center space-y-2">
          <h3 className="text-2xl font-bold">{isAr ? "ابدأ مشروعك معنا" : "Start your project with us"}</h3>
          <p>{isAr ? "نقدم استشارة مجانية لتحديد أفضل مسار للإنجاز." : "Book a quick call and we'll outline the fastest, safest path to delivery."}</p>
          <a href="/contact" className="inline-block px-6 py-3 rounded-full bg-white text-primary font-semibold">
            {isAr ? "احجز مكالمة" : "Book a call"}
          </a>
        </div>
      </section>
    </Layout>
  );
}
