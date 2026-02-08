import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navItems = [
  { to: "/dashboard", label: { ar: "لوحة التحكم", en: "Dashboard" } },
  { to: "/dashboard/services", label: { ar: "الخدمات", en: "Services" } },
  { to: "/dashboard/projects", label: { ar: "الأعمال", en: "Projects" } },
  { to: "/dashboard/blog", label: { ar: "المدونة", en: "Blog" } },
  { to: "/dashboard/team", label: { ar: "الفريق", en: "Team" } },
  { to: "/dashboard/clients", label: { ar: "العملاء", en: "Clients" } },
  { to: "/dashboard/packages", label: { ar: "الباقات", en: "Packages" } },
  { to: "/dashboard/jobs", label: { ar: "الوظائف", en: "Jobs" } },
  { to: "/dashboard/messages", query: "sales", label: { ar: "رسائل الباقات والخدمات", en: "Sales & packages" } },
  { to: "/dashboard/messages", query: "support", label: { ar: "رسائل الدعم الفني", en: "Support messages" } },
  { to: "/dashboard/messages", query: "general", label: { ar: "رسائل عامة", en: "General messages" } },
  { to: "/dashboard/job-applications", label: { ar: "طلبات التوظيف", en: "Applications" } },
  { to: "/dashboard/support-chat", label: { ar: "دعم العملاء", en: "Support chat" } },
  { to: "/dashboard/media", label: { ar: "المكتبة", en: "Media Library" } },
  { to: "/dashboard/sections", label: { ar: "الأقسام", en: "Sections" } },
  { to: "/dashboard/pages", label: { ar: "الصفحات", en: "Pages" } },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/dashboard/login");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-[260px,1fr] bg-gradient-to-b from-surface to-white dark:from-neutral-900 dark:to-neutral-950 text-secondary dark:text-neutral-100">
      <aside className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-r border-accent/30 dark:border-neutral-800 shadow-sm p-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-secondary/60 dark:text-neutral-400">
              {t("لوحة التحكم", "Admin console")}
            </p>
            <p className="text-xl font-bold text-primary">LAVA</p>
          </div>
          <Link to="/" className="px-3 py-2 rounded-full bg-primary text-white text-xs shadow hover:shadow-md">
            {t("العودة للموقع", "Back to site")}
          </Link>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const params = new URLSearchParams(location.search);
            const topic = params.get("topic") || "sales";
            const active = item.to === "/dashboard/messages"
              ? location.pathname.startsWith(item.to) && (!item.query || item.query === topic)
              : location.pathname.startsWith(item.to);
            const target = item.query ? `${item.to}?topic=${item.query}` : item.to;
            return (
              <Link
                key={item.to + (item.query || "")}
                to={target}
                className={`block px-3 py-2 rounded-xl transition-colors ${
                  active ? "bg-primary text-white shadow" : "hover:bg-surface hover:text-primary dark:hover:bg-neutral-800"
                }`}
              >
                {t(item.label.ar, item.label.en)}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mt-auto text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          {t("تسجيل الخروج", "Sign out")}
        </button>
      </aside>
      <div className="min-h-screen bg-white/50 dark:bg-neutral-900/40">
        <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-neutral-900/80 border-b border-accent/20 dark:border-neutral-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary/70 dark:text-neutral-300">
                {t("مرحبًا بك في لوحة التحكم", "Welcome to the dashboard")}
              </p>
              <p className="text-lg font-semibold text-secondary dark:text-neutral-50">
                {t("إدارة المحتوى والموقع", "Manage site content and data")}
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 rounded-full border border-primary text-primary text-sm hover:bg-primary/5 dark:hover:bg-primary/10"
            >
              {t("زيارة الموقع", "Visit website")}
            </Link>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
