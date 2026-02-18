import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { applyTheme, getInitialTheme } from "../../utils/theme";
import { fetchPages, fetchSections } from "../../api/endpoints";
import { Page, Section } from "../../types";

const navLinks = [
  { to: "/", label: { ar: "الرئيسية", en: "Home" }, slug: "home" },
  { to: "/about", label: { ar: "من نحن", en: "About" }, slug: "about" },
  { to: "/services", label: { ar: "الخدمات", en: "Services" }, slug: "services" },
  { to: "/packages", label: { ar: "الباقات", en: "Packages" }, slug: "packages" },
  { to: "/portfolio", label: { ar: "الأعمال", en: "Portfolio" }, slug: "portfolio" },
  { to: "/blog", label: { ar: "المدونة", en: "Blog" }, slug: "blog" },
  { to: "/careers", label: { ar: "الوظائف", en: "Careers" }, slug: "careers" },
  { to: "/contact", label: { ar: "تواصل معنا", en: "Contact" }, slug: "contact" },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());
  const drawerRef = useRef<HTMLElement | null>(null);
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const { data: pages } = useQuery<Page[]>({
    queryKey: ["pages-public"],
    queryFn: fetchPages,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const homePage = pages?.find((p) => p.slug === "home");
  const { data: sections } = useQuery<Section[]>({
    queryKey: ["sections-public"],
    queryFn: () => fetchSections(),
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const headerSection = sections
    ?.filter((sec) => sec.section_type === "header" && (!homePage || sec.page === homePage.id))
    .sort((a, b) => a.order - b.order)[0];

  const headerExtra = (headerSection?.extra || {}) as Record<string, string>;
  const logoUrl = headerExtra.logo_url || "/logo.PNG";
  const logoAlt = isAr ? headerExtra.logo_alt_ar || "LAVA" : headerExtra.logo_alt_en || "LAVA";
  const rawHeight = headerExtra.logo_height ? Number(headerExtra.logo_height) : 0;
  const logoHeight = Number.isFinite(rawHeight) && rawHeight > 0 ? rawHeight : 58;

  const enabledSlugs = new Set((pages || []).filter((page) => page.status === "published").map((page) => page.slug));
  const visibleLinks = pages ? navLinks.filter((link) => !link.slug || enabledSlugs.has(link.slug)) : navLinks;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (drawerRef.current && target && !drawerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const toggleLanguage = () => {
    i18n.changeLanguage(isAr ? "en" : "ar");
  };
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const logoBox = (
    <span className="inline-flex h-12 w-[102px] max-w-[38vw] items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 border border-accent/45 dark:border-neutral-700 shadow-sm px-2">
      <img src={logoUrl} alt={logoAlt} className="max-w-full w-auto" style={{ maxHeight: `${Math.min(logoHeight, 46)}px` }} />
    </span>
  );

  const mobileMenuButton = (
    <button
      className="w-9 h-9 rounded-full border border-accent/60 dark:border-neutral-700 bg-white/85 dark:bg-neutral-900 flex items-center justify-center text-secondary dark:text-neutral-100"
      onClick={() => setOpen(true)}
      aria-label={t("فتح القائمة", "Open navigation")}
    >
      <MenuIcon />
    </button>
  );

  const mobileActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLanguage}
        className="px-3 py-1.5 rounded-full border border-accent/60 dark:border-neutral-700 bg-white/85 dark:bg-neutral-900 text-xs font-semibold text-secondary dark:text-neutral-100"
      >
        {isAr ? "EN" : "AR"}
      </button>
      <button
        onClick={toggleTheme}
        className="w-9 h-9 rounded-full border border-accent/60 dark:border-neutral-700 bg-white/85 dark:bg-neutral-900 flex items-center justify-center text-secondary dark:text-neutral-100"
        aria-label={t("تبديل الوضع", "Toggle theme")}
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-accent/30 dark:border-neutral-800 bg-white/72 dark:bg-neutral-950/72 backdrop-blur-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="neo-panel px-3 py-2 md:px-5 md:py-3">
          <div className="hidden lg:flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center min-w-0">
              {logoBox}
            </Link>

            <nav className="flex items-center gap-1 rounded-full border border-accent/45 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 px-2 py-1">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 rounded-full text-sm transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-[0_10px_26px_rgba(var(--color-primary),0.33)]"
                        : "text-secondary dark:text-neutral-200 hover:bg-primary/10 hover:text-primary"
                    }`
                  }
                >
                  {t(link.label.ar, link.label.en)}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full border border-accent/60 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 flex items-center justify-center text-secondary dark:text-neutral-100 hover:border-primary transition-colors"
                aria-label={t("تبديل الوضع", "Toggle theme")}
              >
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </button>
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-full border border-accent/60 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 text-sm font-semibold text-secondary dark:text-neutral-100 hover:border-primary transition-colors"
              >
                {isAr ? "EN" : "AR"}
              </button>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-[0_12px_28px_rgba(var(--color-primary),0.34)] hover:-translate-y-0.5 transition-transform"
              >
                {isAr ? "ابدأ مشروعك" : "Start project"}
              </Link>
            </div>
          </div>

          <div className="lg:hidden relative h-12">
            {isAr ? (
              <>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">{mobileMenuButton}</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2">{mobileActions}</div>
                <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex" aria-label="LAVA home">
                  {logoBox}
                </Link>
              </>
            ) : (
              <>
                <div className="absolute left-0 top-1/2 -translate-y-1/2">{mobileMenuButton}</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">{mobileActions}</div>
                <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex" aria-label="LAVA home">
                  {logoBox}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/48 backdrop-blur-[1px] pointer-events-none lg:hidden"
            />

            <motion.aside
              ref={drawerRef}
              initial={{ x: isAr ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? "100%" : "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed top-0 ${isAr ? "right-0" : "left-0"} z-[60] w-[82vw] min-w-[250px] max-w-[560px] p-3 lg:hidden`}
            >
              <div className="max-h-[78dvh] overflow-hidden rounded-[28px] border border-accent/60 dark:border-neutral-700 bg-white/98 dark:bg-neutral-900/96 shadow-[0_20px_44px_rgba(15,23,42,0.22)] dark:shadow-[0_22px_42px_rgba(0,0,0,0.38)] backdrop-blur-[1px] p-4 text-secondary dark:text-neutral-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Link to="/" onClick={() => setOpen(false)}>
                    {logoBox}
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-9 h-9 rounded-full border border-accent/60 dark:border-neutral-700 bg-white/85 dark:bg-neutral-900 flex items-center justify-center"
                    aria-label={t("إغلاق القائمة", "Close menu")}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="h-px bg-accent/35 dark:bg-neutral-700" />

                <nav className="overflow-y-auto flex flex-col gap-2 max-h-[50dvh]">
                  {visibleLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `py-2.5 px-3 rounded-xl border transition whitespace-nowrap ${
                          isActive
                            ? "bg-primary text-white border-primary"
                            : "bg-white/90 dark:bg-neutral-900/85 border-accent/45 dark:border-neutral-700 hover:border-primary/40 hover:bg-primary/10"
                        }`
                      }
                    >
                      {t(link.label.ar, link.label.en)}
                    </NavLink>
                  ))}
                </nav>

                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-primary text-white text-center font-semibold whitespace-nowrap"
                >
                  {isAr ? "ابدأ مشروعك" : "Start project"}
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
