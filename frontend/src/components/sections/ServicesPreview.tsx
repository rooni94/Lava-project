import SectionTitle from "../ui/SectionTitle";
import ServiceCard from "../ui/ServiceCard";
import { useQuery } from "@tanstack/react-query";
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
  ],
};

export default function ServicesPreview() {
  const { data: services } = useQuery<Service[]>({ queryKey: ["services"], queryFn: fetchServices });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const list: Service[] = services && services.length ? services.slice(0, 3) : isAr ? quickServices.ar : quickServices.en;

  return (
    <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100">
      <SectionTitle
        title={isAr ? "خدمات نبنيها يوميًا" : "Services we deliver daily"}
        subtitle={
          isAr
            ? "حلول مرنة من الفكرة حتى الإطلاق مع فرق متعددة التخصصات."
            : "Flexible, end-to-end teams that move from strategy to launch with accountable delivery."
        }
      />
      <div className="grid md:grid-cols-3 gap-6">
        {list.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href="/services"
          className="inline-block px-6 py-3 rounded-full bg-primary text-white hover:shadow-md transition-shadow"
        >
          {isAr ? "اكتشف بقية الخدمات" : "Explore all services"}
        </a>
      </div>
    </section>
  );
}
