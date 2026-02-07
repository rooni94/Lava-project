import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { subscribe } from "../../api/endpoints";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

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
            {t("شريكك التقني لبناء منتجات موثوقة", "Your product partner for dependable launches")}
          </h3>
          <p className="text-sm text-white/80 dark:text-neutral-300">
            {t(
              "نبني تطبيقات ويب وجوال، ونصمم واجهات وتجارب مستخدم، مع فريق يجمع بين الاستراتيجية والتقنية.",
              "We design and ship web and mobile apps, create thoughtful interfaces, and build scalable platforms with a team that blends strategy, design, and engineering."
            )}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t("خدمات مختارة", "Featured services")}</h4>
          <ul className="space-y-2 text-sm text-white/80 dark:text-neutral-300">
            <li>{t("تطوير مواقع وتطبيقات", "Web & mobile engineering")}</li>
            <li>{t("أنظمة أعمال (ERP/CRM)", "Business systems (ERP/CRM)")}</li>
            <li>{t("تصميم UX/UI", "UX/UI design")}</li>
            <li>{t("تسريع المنتج وإطلاقه", "Product acceleration & launch")}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t("اشترك في النشرة", "Join our newsletter")}</h4>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("بريدك الإلكتروني", "Your email")}
              className="w-full rounded-lg px-3 py-2 text-secondary dark:text-neutral-100 border border-accent/50 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            />
            <button type="submit" className="bg-primary px-4 py-2 rounded-lg text-white w-full">
              {t("اشترك الآن", "Subscribe")}
            </button>
          </form>
          {status === "sent" && (
            <p className="text-green-200 dark:text-green-300 text-sm mt-2">
              {t("تم الاشتراك بنجاح.", "Thanks for subscribing.")}
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-white/90 dark:text-neutral-100">
            {t("طرق الدفع الآمنة", "Secure payment methods")}
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
