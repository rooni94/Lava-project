import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import Skeleton from "../components/ui/Skeleton";
import { fetchPackage } from "../api/endpoints";
import { Package } from "../types";
import { formatRiyal, renderRiyalText } from "../utils/currency";

function splitLines(text?: string) {
  return (
    text
      ?.split("\n")
      .map((l) => l.trim())
      .filter(Boolean) || []
  );
}

export default function PackageDetail() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data, isLoading } = useQuery<Package | undefined>({
    queryKey: ["package", id],
    queryFn: () => fetchPackage(String(id)),
    enabled: !!id,
  });

  if (isLoading || !data) {
    return (
      <Layout>
        <section className="py-14 container mx-auto px-4">
          <Skeleton className="h-64 w-full" />
        </section>
      </Layout>
    );
  }

  const title = isAr ? data.title_ar : data.title_en;
  const short = isAr ? data.short_description_ar : data.short_description_en;
  const desc = isAr ? data.description_ar : data.description_en;
  const priceNote = isAr ? data.price_note : data.price_note_en || data.price_note;
  const bullets = splitLines(desc);

  return (
    <Layout>
      <MetaHead title={title} description={short || desc} />
      <section className="py-14 container mx-auto px-4 space-y-8 text-secondary dark:text-neutral-100">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/12 via-rose-50 to-white dark:from-primary/20 dark:via-neutral-900 dark:to-neutral-950 border border-accent/40 dark:border-neutral-800 shadow-2xl p-6 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {data.category ? (isAr ? data.category.name_ar : data.category.name_en) : isAr ? "باقات LAVA" : "LAVA packages"}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white">{title}</h1>
              {short ? <p className="text-secondary/80 dark:text-neutral-200 text-lg">{short}</p> : null}
              <div className="flex flex-wrap gap-2 text-sm text-secondary/70 dark:text-neutral-300">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {isAr ? "السعر:" : "Price:"} {formatRiyal(data.price, priceNote)}
                </span>
                {data.featured ? (
                  <span className="px-3 py-1 rounded-full bg-primary text-white">{isAr ? "مميزة" : "Featured"}</span>
                ) : null}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/contact"
                className="px-5 py-3 rounded-full bg-primary text-white shadow hover:shadow-md text-sm"
              >
                {isAr ? "اطلب عرض سعر" : "Request proposal"}
              </Link>
              <Link
                to="/packages"
                className="px-5 py-3 rounded-full border border-primary text-primary text-sm hover:bg-primary/10"
              >
                {isAr ? "العودة للباقات" : "Back to packages"}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="space-y-4">
            {bullets.length ? (
              <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50 mb-2">{isAr ? "محتويات الباقة" : "What's included"}</h3>
                <ul className={`${isAr ? "pr-5 list-disc text-right" : "pl-5 list-disc"} space-y-1 text-secondary/80 dark:text-neutral-300`}>
                  {bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "مناسبة لـ" : "Best for"}</h3>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">
                {isAr
                  ? "مناسبة للفرق التي تحتاج إطلاقًا سريعًا بجودة عالية وتكامل بين التصميم والتقنية."
                  : "Ideal for teams that need a fast launch with aligned design and engineering."}
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50 mb-2">{isAr ? "الاستثمار" : "Investment"}</h3>
              <p className="text-2xl font-bold text-secondary dark:text-neutral-100">{formatRiyal(data.price)}</p>
              {priceNote ? <p className="text-sm text-secondary/70 dark:text-neutral-300">{renderRiyalText(priceNote)}</p> : null}
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-2">
              <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "خطوات طلب الباقة" : "Request steps"}</h3>
              <ol className={`${isAr ? "pr-5" : "pl-5"} list-decimal space-y-1 text-sm text-secondary/80 dark:text-neutral-300`}>
                <li>{isAr ? "شارك الهدف والنطاق والميزانية والموعد المتوقع." : "Share goals, scope, budget, and target timeline."}</li>
                <li>{isAr ? "نراجع الاحتياج ونرسل عرضًا وجدولًا خلال 24–48 ساعة عمل." : "We review the scope and send a proposal with timeline within 24–48 business hours."}</li>
                <li>{isAr ? "بعد الاعتماد نوقّع العقد ونصدر الفاتورة." : "After approval we sign the agreement and issue the invoice."}</li>
                <li>{isAr ? "نبدأ التنفيذ بعد الدفعة المبدئية وفق الاتفاق." : "Delivery starts after the initial payment per agreement."}</li>
              </ol>
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50">{isAr ? "طرق الدفع المتاحة" : "Payment options"}</h3>
              <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-neutral-300">
                {["Stripe", "Tappy", "Tamara", "Apple Pay", "Visa", "Mada"].map((method) => (
                  <span
                    key={method}
                    className="px-3 py-1 rounded-full border border-accent/50 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70"
                  >
                    {method}
                  </span>
                ))}
              </div>
              <p className="text-xs text-secondary/70 dark:text-neutral-300">
                {isAr
                  ? "بوابات دفع آمنة داخل السعودية وخارجها، مع إمكانية جدولة الدفعات حسب الاتفاق."
                  : "Secure local and international gateways, with installment scheduling available on request."}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
