import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPages } from "../../api/endpoints";
import { Page } from "../../types";

export default function PageGuard({ slug, children }: { slug: string; children: ReactNode }) {
  const { data: pages, isLoading } = useQuery<Page[]>({
    queryKey: ["pages-public"],
    queryFn: fetchPages,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  if (isLoading) {
    return <div className="p-6 text-center text-secondary">{t("جارٍ التحقق من الصفحة...", "Checking page access...")}</div>;
  }

  const isEnabled = !pages ? true : pages.some((page) => page.slug === slug && page.status === "published");

  if (!isEnabled) {
    if (slug === "home") {
      return (
        <div className="min-h-screen flex items-center justify-center text-center text-secondary p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{t("الصفحة غير متاحة", "Page unavailable")}</h1>
            <p className="text-secondary/70">{t("تم تعطيل هذه الصفحة من لوحة التحكم.", "This page is currently disabled.")}</p>
          </div>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
