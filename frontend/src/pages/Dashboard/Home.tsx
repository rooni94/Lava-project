import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchDashboardStats } from "../../api/endpoints";
import StatCard from "../../components/ui/StatCard";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

type Activity = { action: string; actor?: string | null; created_at?: string };
type DashboardStats = {
  services: number;
  projects: number;
  blog_posts: number;
  team: number;
  clients: number;
  messages: number;
  subscribers: number;
  site_settings: number;
  jobs: number;
  applications: number;
  recent_activity: Activity[];
};

export default function DashboardHome() {
  const { data } = useQuery<DashboardStats>({ queryKey: ["dashboard-stats"], queryFn: fetchDashboardStats });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("لوحة التحكم", "Dashboard")}</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard label={t("الخدمات", "Services")} value={data?.services ?? 0} />
          <StatCard label={t("الأعمال", "Projects")} value={data?.projects ?? 0} />
          <StatCard label={t("المدونة", "Blog posts")} value={data?.blog_posts ?? 0} />
          <StatCard label={t("العملاء", "Clients")} value={data?.clients ?? 0} />
          <StatCard label={t("رسائل التواصل", "Messages")} value={data?.messages ?? 0} />
          <StatCard label={t("المشتركون بالنشرة", "Newsletter subscribers")} value={data?.subscribers ?? 0} />
        </div>
        {data?.recent_activity && (
          <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4">
            <h2 className="text-lg font-semibold mb-3 text-secondary dark:text-neutral-50">
              {t("آخر الأنشطة", "Recent activity")}
            </h2>
            <ul className="space-y-2 text-sm text-secondary/80 dark:text-neutral-300">
              {data.recent_activity.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between border-b border-accent/20 dark:border-neutral-800 pb-2">
                  <span>{item.action}</span>
                  <span className="text-secondary/60 dark:text-neutral-400">
                    {item.actor || t("النظام", "System automation")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
