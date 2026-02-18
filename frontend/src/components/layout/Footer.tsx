import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchPages, fetchSections, subscribe } from "../../api/endpoints";
import { Page, Section } from "../../types";

type FooterLink = { label_ar: string; label_en: string; href: string };

const parseFooterLinks = (raw?: string): FooterLink[] => {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length === 1) {
        return { label_ar: parts[0], label_en: parts[0], href: "#" };
      }
      if (parts.length === 2) {
        return { label_ar: parts[0], label_en: parts[0], href: parts[1] };
      }
      return { label_ar: parts[0], label_en: parts[1] || parts[0], href: parts[2] || "#" };
    });
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");
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

  const footerSection = sections
    ?.filter((sec) => sec.section_type === "footer" && (!homePage || sec.page === homePage.id))
    .sort((a, b) => a.order - b.order)[0];

  const footerExtra = (footerSection?.extra || {}) as Record<string, string>;

  const aboutTitle = isAr
    ? footerSection?.title || t("شريكك التقني للنمو", "Your integrated growth partner")
    : footerExtra.title_en || footerSection?.title || t("شريكك التقني للنمو", "Your integrated growth partner");

  const aboutBody = isAr
    ? footerSection?.content ||
      t(
        "نصمم ونبني منتجات رقمية ونطلق حملات تسويق أداء عبر فريق واحد يجمع الإستراتيجية والإبداع والهندسة.",
        "We design, build, and scale digital experiences through one team of strategists, creatives, and engineers."
      )
    : footerExtra.content_en ||
      footerSection?.content ||
      t(
        "نصمم ونبني منتجات رقمية ونطلق حملات تسويق أداء عبر فريق واحد يجمع الإستراتيجية والإبداع والهندسة.",
        "We design, build, and scale digital experiences through one team of strategists, creatives, and engineers."
      );

  const linksTitle = isAr ? footerExtra.links_title_ar || t("روابط مهمة", "Navigation") : footerExtra.links_title_en || t("روابط مهمة", "Navigation");
  const linksItems = parseFooterLinks(footerExtra.links_items);

  const newsletterTitle = isAr
    ? footerExtra.newsletter_title_ar || t("اشترك في التحديثات", "Get updates")
    : footerExtra.newsletter_title_en || t("اشترك في التحديثات", "Get updates");

  const newsletterBody = isAr
    ? footerExtra.newsletter_body_ar || t("محتوى شهري عن البرمجة والتسويق والنمو.", "")
    : footerExtra.newsletter_body_en || t("", "Monthly insights on product and growth.");

  const newsletterPlaceholder = isAr
    ? footerExtra.newsletter_placeholder_ar || t("بريدك الإلكتروني", "Your email")
    : footerExtra.newsletter_placeholder_en || t("بريدك الإلكتروني", "Your email");

  const newsletterButton = isAr
    ? footerExtra.newsletter_button_ar || t("اشترك", "Subscribe")
    : footerExtra.newsletter_button_en || t("اشترك", "Subscribe");

  const newsletterSuccess = isAr
    ? footerExtra.newsletter_success_ar || t("تم الاشتراك بنجاح.", "Thanks for subscribing.")
    : footerExtra.newsletter_success_en || t("تم الاشتراك بنجاح.", "Thanks for subscribing.");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await subscribe(email);
    setStatus("sent");
    setEmail("");
  };

  return (
    <footer className="mt-10 border-t border-accent/30 dark:border-neutral-800 bg-secondary text-white dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr_1fr]">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">LAVA</p>
              <h3 className="mt-1 text-xl md:text-2xl font-bold">{aboutTitle}</h3>
            </div>
            <div className="text-sm text-white/80 leading-7" dangerouslySetInnerHTML={{ __html: aboutBody }} />
            <div className="flex gap-2 text-xs text-white/70">
              <span className="px-3 py-1 rounded-full border border-white/20">Software Development</span>
              <span className="px-3 py-1 rounded-full border border-white/20">Digital Marketing</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">{linksTitle}</h4>
            {linksItems.length ? (
              <ul className="space-y-2 text-sm text-white/80">
                {linksItems.map((item, idx) => (
                  <li key={`${item.href}-${idx}`}>
                    <a href={item.href} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {isAr ? item.label_ar : item.label_en}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/70">
                {t("أضف روابط الفوتر من قسم الأقسام.", "Add footer links from the sections manager.")}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">{newsletterTitle}</h4>
            {newsletterBody ? <p className="text-sm text-white/80">{newsletterBody}</p> : null}
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterPlaceholder}
                className="w-full rounded-xl px-3 py-2 text-secondary border border-white/20 bg-white placeholder:text-secondary/50"
              />
              <button type="submit" className="bg-primary px-4 py-2 rounded-xl text-white w-full hover:bg-primary/90 transition-colors">
                {newsletterButton}
              </button>
            </form>
            {status === "sent" ? <p className="text-green-200 text-sm">{newsletterSuccess}</p> : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-xs py-3 text-white/65">
        (c) {new Date().getFullYear()} LAVA - {t("جميع الحقوق محفوظة", "All rights reserved")}
      </div>
    </footer>
  );
}
