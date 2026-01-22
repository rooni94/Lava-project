import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchProjects } from "../api/endpoints";
import ProjectCard from "../components/ui/ProjectCard";
import Skeleton from "../components/ui/Skeleton";

export default function PortfolioPage() {
  const { data, isLoading } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <Layout>
      <MetaHead
        title={isAr ? "أعمالنا" : "Portfolio | LAVA"}
        description={
          isAr
            ? "نماذج مختارة من المشاريع التي أنجزناها لعملائنا."
            : "Selected digital products, platforms, and brands we delivered."
        }
      />
      <section className="py-14 container mx-auto px-4 space-y-8 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "أعمال مختارة" : "Featured work"}
          subtitle={
            isAr
              ? "مشاريع رقمية وهوية بصرية وأنظمة أعمال تم تنفيذها بمعايير عالية."
              : "Digital products, identities, and business systems launched with high standards."
          }
        />
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
