import SectionTitle from "../ui/SectionTitle";
import ServiceCard from "../ui/ServiceCard";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fetchServices } from "../../api/endpoints";
import { Service } from "../../types";

const quickServices = {
  ar: [
    {
      id: 1,
      title: "تسويق محتوى وحملات + برمجة",
      description: "استراتيجية، كتابة، تصميم، موشن، وإدارة الإعلانات مع صفحات ومواقع وأتمتة تدعم التحويل.",
    },
    {
      id: 2,
      title: "تصميم وهوية بصرية",
      description: "شعارات، أدلة هوية، واجهات رقمية، وسوشيال ميديا بتوجه تجاري.",
    },
    {
      id: 3,
      title: "برمجة مواقع وأنظمة",
      description: "مواقع React/Next، متاجر، تطبيقات، ولوحات تحكم قابلة للتوسع.",
    },
    {
      id: 4,
      title: "إنتاج فيديو وموشن",
      description: "فيديوهات تسويقية، موشن جرافيك، وأصول جاهزة للإعلانات والمنصات الاجتماعية.",
    },
  ],
  en: [
    {
      id: 1,
      title: "Content & campaigns + build",
      description: "Strategy, copy, design, motion, paid ads, plus landing pages and automation that convert.",
    },
    {
      id: 2,
      title: "Design & identity",
      description: "Logos, brand systems, UI kits, and social visuals that sell.",
    },
    {
      id: 3,
      title: "Web & systems engineering",
      description: "React/Next sites, eCommerce, apps, and scalable dashboards.",
    },
    {
      id: 4,
      title: "Video & motion production",
      description: "Campaign videos, motion assets, and social-first edits for performance ads.",
    },
  ],
};

export default function ServicesPreview() {
  const { data: services } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const list: Service[] = services && services.length ? services.slice(0, 4) : isAr ? quickServices.ar : quickServices.en;

  return (
    <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100">
      <div className="relative overflow-hidden rounded-[28px] border border-accent/40 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 p-6 md:p-8">
        <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl dark:bg-white/5" />
        <div className="relative">
          <SectionTitle
            title={isAr ? "خدمات نبنيها يوميًا" : "Services we deliver daily"}
            subtitle={
              isAr
                ? "نقسم التنفيذ إلى مسارين متكاملين: هندسة المنتجات + التسويق الرقمي لنحصل على أثر واضح وقابل للقياس."
                : "We combine product engineering with digital marketing in one coordinated delivery model."
            }
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {list.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </motion.div>

          <div className="mt-6 text-center">
            <a
              href="/services"
              className="inline-block px-6 py-3 rounded-full bg-primary text-white shadow-[0_12px_26px_rgba(var(--color-primary),0.3)] hover:-translate-y-0.5 transition-transform"
            >
              {isAr ? "اكتشف بقية الخدمات" : "Explore all services"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
