import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { applyTheme, getInitialTheme } from "../../utils/theme";
import { useTranslation } from "react-i18next";
import { fetchPages } from "../../api/endpoints";
import { Page } from "../../types";

const navLinks = [
  { to: "/", label: { ar: "الرئيسية", en: "Home" } },
  { to: "/about", label: { ar: "من نحن", en: "About" } },
  { to: "/services", label: { ar: "الخدمات", en: "Services" } },
  { to: "/packages", label: { ar: "الباقات", en: "Packages" } },
  { to: "/portfolio", label: { ar: "الأعمال", en: "Portfolio" } },
  { to: "/blog", label: { ar: "المدونة", en: "Blog" } },
  { to: "/careers", label: { ar: "الوظائف", en: "Careers" } },
  { to: "/contact", label: { ar: "تواصل معنا", en: "Contact" } },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a8 8 0 1 0 11.5 11.5z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const { data: pages } = useQuery<Page[]>({ queryKey: ["pages-public"], queryFn: fetchPages });
  const enabledSlugs = new Set((pages || []).filter((page) => page.status === "published").map((page) => page.slug));
  const visibleLinks = pages ? navLinks.filter((link) => !link.slug || enabledSlugs.has(link.slug)) : navLinks;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleLanguage = () => i18n.changeLanguage(isAr ? "en" : "ar");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/85 dark:bg-neutral-900/85 dark:text-neutral-100 border-b border-accent/30 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <img src="/logo.PNG" alt="LAVA Logo" className="h-16 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-secondary dark:text-neutral-200 hover:text-primary"}`
                }
              >
                {t(link.label.ar, link.label.en)}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-accent/60 dark:border-neutral-700 flex items-center justify-center text-secondary dark:text-neutral-100 hover:border-primary transition-colors"
              aria-label={t("تبديل الوضع", "Toggle theme")}
              title={t("تبديل الوضع", "Toggle theme")}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-full border border-accent/60 dark:border-neutral-700 text-secondary dark:text-neutral-100 hover:border-primary transition-colors"
            >
              {isAr ? "EN" : "AR"}
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-full bg-primary text-white text-sm shadow hover:shadow-md transition-shadow"
            >
              {t("لوحة التحكم", "Dashboard")}
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-accent/60 dark:border-neutral-700 flex items-center justify-center text-secondary dark:text-neutral-100"
              aria-label={t("تبديل الوضع", "Toggle theme")}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-full border border-accent/60 dark:border-neutral-700 text-secondary dark:text-neutral-100"
            >
              {isAr ? "EN" : "AR"}
            </button>
            <button
              className="w-10 h-10 rounded-full border border-accent/60 dark:border-neutral-700 flex items-center justify-center text-secondary dark:text-neutral-100"
              onClick={() => setOpen((v) => !v)}
              aria-label={t("فتح القائمة", "Toggle navigation")}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 shadow-inner overflow-hidden border-t border-accent/30 dark:border-neutral-800"
          >
            <div className="flex flex-col px-4 pb-4 gap-2 text-secondary dark:text-neutral-100">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="py-2 border-b border-accent/30 dark:border-neutral-800"
                >
                  {t(link.label.ar, link.label.en)}
                </NavLink>
              ))}
              <Link to="/dashboard" onClick={() => setOpen(false)} className="py-2 text-primary font-semibold">
                {t("لوحة التحكم", "Dashboard")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
