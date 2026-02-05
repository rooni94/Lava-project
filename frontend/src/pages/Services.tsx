import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchServices } from "../api/endpoints";
import ServiceCard from "../components/ui/ServiceCard";
import Skeleton from "../components/ui/Skeleton";

export default function ServicesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["services-page"], queryFn: fetchServices });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const hybridServices = isAr
    ? [
        {
          title: "كتابة المحتوى وصناعة الرسائل",
          desc: "نكتب لنؤثر: محتوى ومفاهيم ورسائل تمس جمهورك وتدعم حملاتك.",
          bullets: ["محتوى المواقع", "محتوى السوشيال", "مقالات ومدونات", "نصوص إعلانية وVideo scripts", "هوية لفظية (Tone of Voice)"],
        },
        {
          title: "التصميم والهوية البصرية",
          desc: "هوية متكاملة تخدم الهدف التجاري وتُحفظ في الذاكرة.",
          bullets: ["شعارات وأدلة هوية", "تصاميم سوشيال وإعلانات", "UI/UX للمواقع والتطبيقات"],
        },
        {
          title: "إنتاج الفيديو والموشن جرافيك",
          desc: "فيديو يشرح ويقنع ويترك أثراً، من فكرة النص حتى المونتاج.",
          bullets: ["فيديوهات تسويقية", "موشن جرافيك", "Reels & Shorts", "فيديوهات تعريفية", "مونتاج احترافي"],
        },
        {
          title: "إدارة التسويق الرقمي والإعلانات",
          desc: "نستثمر الميزانية ولا نصرفها، مع تحليل وتحسين مستمر.",
          bullets: ["حملات Google Ads", "إعلانات Meta", "استراتيجيات نمو", "تحسين الأداء والتحليل", "تقارير دورية واضحة"],
        },
        {
          title: "برمجة المواقع والتطبيقات والأنظمة",
          desc: "مواقع وتطبيقات ولوحات تحكم قابلة للتوسع تدعم حملاتك وتسويقك.",
          bullets: ["مواقع احترافية ومتاجر", "تطبيقات ويب وموبايل", "أنظمة ولوحات تحكم مخصصة", "تكاملات وواجهات API"],
        },
      ]
    : [
        {
          title: "Content & Messaging",
          desc: "Words that move people and fuel campaigns.",
          bullets: ["Website copy", "Social content", "Articles & blogs", "Ad copy & video scripts", "Verbal identity / TOV"],
        },
        {
          title: "Design & Brand Identity",
          desc: "Memorable visuals built for business impact.",
          bullets: ["Logos & brand systems", "Social & ad creatives", "UI/UX for web & apps"],
        },
        {
          title: "Video & Motion Graphics",
          desc: "Story-driven video that explains, convinces, and sticks.",
          bullets: ["Marketing videos", "Motion graphics", "Reels & Shorts", "Corporate explainers", "Pro editing"],
        },
        {
          title: "Digital Marketing & Ads",
          desc: "We invest budgets with measurable returns.",
          bullets: ["Google Ads management", "Meta (FB/IG) ads", "Growth strategies", "Performance optimization", "Clear periodic reporting"],
        },
        {
          title: "Web, Apps, and Systems",
          desc: "Scalable sites, apps, and dashboards that power campaigns.",
          bullets: ["Professional sites & eCommerce", "Web & mobile apps", "Custom systems & dashboards", "APIs and integrations"],
        },
      ];

  return (
    <Layout>
      <MetaHead
        title={isAr ? "خدمات LAVA التسويق والبرمجة" : "LAVA marketing & engineering services"}
        description={
          isAr
            ? "كتابة محتوى، تصميم وهوية، موشن جرافيك، حملات وإعلانات، مع برمجة مواقع وتطبيقات وأنظمة مخصصة."
            : "Content, design, motion, campaigns, plus web/app/system development under one integrated team."
        }
      />
      <section className="py-14 container mx-auto px-4 space-y-6 text-secondary dark:text-neutral-100">
      <SectionTitle
        title={isAr ? "خدمات LAVA" : "LAVA services"}
        subtitle={
          isAr
            ? "نحلل ونخطط ونكتب ونصمم وننتج موشن جرافيك، ثم ننفذ مواقع وتطبيقات وأنظمة ولوحات تحكم لدعم الحملات وتحويل الزوار لعملاء."
            : "We plan, write, design, and produce motion, then build sites, apps, systems, and dashboards that power campaigns and turn visitors into customers."
        }
      />
      {/* قسم موحد: خدمات تسويق + برمجة */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hybridServices.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">{item.title}</h3>
            <p className="text-sm text-secondary/80 dark:text-neutral-300">{item.desc}</p>
            <ul className={`${isAr ? "pr-4 list-disc" : "pl-4 list-disc"} space-y-1 text-sm text-secondary/75 dark:text-neutral-300`}>
              {item.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}

        {isLoading ? (
          <Skeleton className="h-40 w-full col-span-full" />
        ) : (
          data?.map((service) => <ServiceCard key={service.id} service={service} />)
        )}
      </div>
      </section>
    </Layout>
  );
}
