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
    ? footerSection?.title || t("شريكك التقني لبناء منتجات موثوقة", "Your product partner for dependable launches")
    : footerExtra.title_en || footerSection?.title || t("شريكك التقني لبناء منتجات موثوقة", "Your product partner for dependable launches");
  const aboutBody = isAr
    ? footerSection?.content ||
      t(
        "نبني تطبيقات ويب وجوال، ونصمم واجهات وتجارب مستخدم، مع فريق يجمع بين الاستراتيجية والتقنية.",
        "We design and ship web and mobile apps, create thoughtful interfaces, and build scalable platforms with a team that blends strategy, design, and engineering."
      )
    : footerExtra.content_en ||
      footerSection?.content ||
      t(
        "نبني تطبيقات ويب وجوال، ونصمم واجهات وتجارب مستخدم، مع فريق يجمع بين الاستراتيجية والتقنية.",
        "We design and ship web and mobile apps, create thoughtful interfaces, and build scalable platforms with a team that blends strategy, design, and engineering."
      );
  const linksTitle = isAr ? footerExtra.links_title_ar || t("روابط مهمة", "Useful links") : footerExtra.links_title_en || t("روابط مهمة", "Useful links");
  const linksItems = parseFooterLinks(footerExtra.links_items);
  const newsletterTitle = isAr
    ? footerExtra.newsletter_title_ar || t("اشترك في النشرة", "Join our newsletter")
    : footerExtra.newsletter_title_en || t("اشترك في النشرة", "Join our newsletter");
  const newsletterBody = isAr
    ? footerExtra.newsletter_body_ar || ""
    : footerExtra.newsletter_body_en || "";
  const newsletterPlaceholder = isAr
    ? footerExtra.newsletter_placeholder_ar || t("بريدك الإلكتروني", "Your email")
    : footerExtra.newsletter_placeholder_en || t("بريدك الإلكتروني", "Your email");
  const newsletterButton = isAr
    ? footerExtra.newsletter_button_ar || t("اشترك الآن", "Subscribe")
    : footerExtra.newsletter_button_en || t("اشترك الآن", "Subscribe");
  const newsletterSuccess = isAr
    ? footerExtra.newsletter_success_ar || t("تم الاشتراك بنجاح.", "Thanks for subscribing.")
    : footerExtra.newsletter_success_en || t("تم الاشتراك بنجاح.", "Thanks for subscribing.");
  const paymentsTitle = isAr
    ? footerExtra.payments_title_ar || t("طرق الدفع الآمنة", "Secure payment methods")
    : footerExtra.payments_title_en || t("طرق الدفع الآمنة", "Secure payment methods");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await subscribe(email);
    setStatus("sent");
    setEmail("");
  };

  return (
    <footer className="bg-secondary text-white dark:bg-neutral-950 dark:text-neutral-100 border-t border-white/10 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-bold text-lg mb-3">
            {aboutTitle}
          </h3>
          <div className="text-sm text-white/80 dark:text-neutral-300" dangerouslySetInnerHTML={{ __html: aboutBody }} />
        </div>
        <div>
          <h4 className="font-semibold mb-3">{linksTitle}</h4>
          {linksItems.length ? (
            <ul className="space-y-2 text-sm text-white/80 dark:text-neutral-300">
              {linksItems.map((item, idx) => (
                <li key={`${item.href}-${idx}`}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {isAr ? item.label_ar : item.label_en}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/70 dark:text-neutral-400">
              {t("أضف روابط الفوتر من قسم الأقسام.", "Add footer links from the sections manager.")}
            </p>
          )}
        </div>
        <div>
          <h4 className="font-semibold mb-3">{newsletterTitle}</h4>
          {newsletterBody ? <p className="text-sm text-white/80 dark:text-neutral-300 mb-3">{newsletterBody}</p> : null}
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletterPlaceholder}
              className="w-full rounded-lg px-3 py-2 text-secondary dark:text-neutral-100 border border-accent/50 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            />
            <button type="submit" className="bg-primary px-4 py-2 rounded-lg text-white w-full">
              {newsletterButton}
            </button>
          </form>
          {status === "sent" && (
            <p className="text-green-200 dark:text-green-300 text-sm mt-2">{newsletterSuccess}</p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-white/90 dark:text-neutral-100">
            {paymentsTitle}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { src: "/payments/stripe.svg", alt: "Stripe" },
              { src: "/payments/tappy.svg", alt: "Tappy" },
              { src: "/payments/tamara.svg", alt: "Tamara" },
              { src: "/payments/apple-pay.svg", alt: "Apple Pay" },
              { src: "/payments/visa.svg", alt: "Visa" },
              { src: "/payments/mada.svg", alt: "Mada" },
            ].map((logo) => (
              <span
                key={logo.alt}
                className="inline-flex items-center justify-center rounded-md bg-white/90 border border-white/10 px-2 py-1 shadow-sm"
              >
                <img src={logo.src} alt={logo.alt} className="h-6 w-auto" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 dark:border-neutral-800 text-center text-xs py-3 text-white/70 dark:text-neutral-400">
        (c) {new Date().getFullYear()} LAVA - {t("جميع الحقوق محفوظة", "All rights reserved")}
      </div>
    </footer>
  );
}
