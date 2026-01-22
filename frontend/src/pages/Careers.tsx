import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchJobOpenings } from "../api/endpoints";
import Skeleton from "../components/ui/Skeleton";
import { Link } from "react-router-dom";

export default function CareersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: fetchJobOpenings });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <Layout>
      <MetaHead
        title={isAr ? "انضم لفريق لافا" : "Join the LAVA team"}
        description={isAr ? "نبحث عن مواهب تبني منتجات تقنية عالية الجودة." : "We look for talent that ships high-quality technical products."}
      />
      <section className="py-14 container mx-auto px-4 space-y-8 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "وظائف شاغرة" : "Open roles"}
          subtitle={isAr ? "فرص عمل في مجالات التطوير، التصميم، وإدارة المنتجات." : "Opportunities across engineering, design, and product management."}
        />
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : data && data.length ? (
          <div className="grid md:grid-cols-2 gap-6">
            {data.map((job) => (
              <div key={job.id} className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-6 shadow space-y-3">
                <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">{job.title}</h3>
                <p className="text-sm text-secondary/80 dark:text-neutral-300">
                  {job.department || (isAr ? "عام" : "General")} - {job.employment_type === "full_time" ? (isAr ? "دوام كامل" : "Full time") : (isAr ? "دوام جزئي" : "Part time")}
                </p>
                <p className="text-sm text-secondary/80 dark:text-neutral-300">{isAr ? "الموقع:" : "Location:"} {job.location || (isAr ? "عن بعد" : "Remote")}</p>
                <p className="text-sm text-secondary/80 dark:text-neutral-300">{job.description}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {job.requirements?.slice(0, 4).map((req: string) => (
                    <span key={req} className="px-3 py-1 rounded-full bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700 text-xs">
                      {req}
                    </span>
                  ))}
                </div>
                <Link to="/contact" className="inline-block px-5 py-2 rounded-full bg-primary text-white">
                  {isAr ? "قدم الآن" : "Apply now"}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary/70 dark:text-neutral-300">{isAr ? "لا توجد وظائف متاحة حاليًا." : "No roles are available right now."}</p>
        )}
      </section>
    </Layout>
  );
}
