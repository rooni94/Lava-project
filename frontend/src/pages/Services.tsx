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

  return (
    <Layout>
      <MetaHead
        title={isAr ? "خدمات لافا" : "Services | LAVA"}
        description={
          isAr
            ? "حلول برمجية وتصميم منتجات رقمية من الفكرة حتى الإطلاق."
            : "Software engineering, UX/UI design, and product strategy delivered by integrated teams."
        }
      />
      <section className="py-14 container mx-auto px-4 space-y-6 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "خدمات لافا" : "LAVA services"}
          subtitle={
            isAr ? "حلول متكاملة تشمل الاستراتيجية، التصميم، والتطوير." : "End-to-end capabilities covering strategy, design, development, and launch."
          }
        />
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
