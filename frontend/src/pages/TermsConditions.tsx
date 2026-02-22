import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import Skeleton from "../components/ui/Skeleton";
import { fetchPageBySlug } from "../api/endpoints";

export default function TermsConditions() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", "terms-conditions"],
    queryFn: () => fetchPageBySlug("terms-conditions"),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  const arabicSection = page?.sections?.find((sec) => 
    sec.title.includes("الشروط") || sec.title === "الشروط والأحكام"
  );
  
  const englishSection = page?.sections?.find((sec) => 
    sec.title.includes("Terms") || sec.title === "Terms & Conditions"
  );

  const contentSection = isAr ? arabicSection : englishSection;
  const fallbackSection = arabicSection || englishSection || page?.sections?.[0];

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary dark:text-neutral-50 mb-4">
              {page?.title || (isAr ? "الشروط والأحكام" : "Terms & Conditions")}
            </h1>
          </div>

          {fallbackSection ? (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                dangerouslySetInnerHTML={{ __html: fallbackSection.content }}
                className="text-secondary dark:text-neutral-300"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-neutral-500">
                {isAr ? "الشروط والأحكام قيد التحديث..." : "Terms & conditions are being updated..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
