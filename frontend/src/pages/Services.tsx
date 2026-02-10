import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchServices } from "../api/endpoints";
import ServiceCard from "../components/ui/ServiceCard";
import Skeleton from "../components/ui/Skeleton";

export default function ServicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["services-page"],
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <Skeleton className="h-40 w-full col-span-full" />
        ) : data?.length ? (
          data.map((service) => <ServiceCard key={service.id} service={service} />)
        ) : (
          <div className="col-span-full text-secondary/70 dark:text-neutral-300">
            {isAr ? "لا توجد خدمات متاحة حالياً." : "No services available yet."}
          </div>
        )}
      </div>
      </section>
    </Layout>
  );
}
