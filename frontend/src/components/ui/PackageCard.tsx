import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package } from "../../types";
import { formatRiyal, renderRiyalText } from "../../utils/currency";

type Props = {
  item: Package;
};

export default function PackageCard({ item }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const title = isAr ? item.title_ar : item.title_en;
  const short = isAr ? item.short_description_ar : item.short_description_en;
  const desc = isAr ? item.description_ar : item.description_en;
  const priceNote = isAr ? item.price_note : item.price_note_en || item.price_note;
  const showPrice = item.show_price !== false;
  const bullets =
    desc
      ?.split("\n")
      .map((l) => l.trim())
      .filter(Boolean) || [];

  return (
    <article className="rounded-3xl border border-accent/40 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/90 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.1)] hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.14)] transition flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-secondary/60 dark:text-neutral-400">
            {item.category ? (isAr ? item.category.name_ar : item.category.name_en) : isAr ? "باقات" : "Packages"}
          </p>
          <h3 className="theme-h3 font-semibold text-secondary dark:text-neutral-50">{title}</h3>
          {short ? <p className="text-sm text-secondary/75 dark:text-neutral-300">{short}</p> : null}
        </div>
        {item.featured ? (
          <span className="px-3 py-1 rounded-full text-xs bg-primary text-white shadow">{isAr ? "مميزة" : "Featured"}</span>
        ) : null}
      </div>

      {bullets.length ? (
        <ul className={`space-y-1 text-sm text-secondary/80 dark:text-neutral-200 ${isAr ? "pr-4 list-disc" : "pl-4 list-disc"}`}>
          {bullets.slice(0, 6).map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center justify-between pt-2">
        <div>
          {showPrice ? (
            <>
              {priceNote ? <div className="text-xs text-secondary/60 dark:text-neutral-400">{renderRiyalText(priceNote)}</div> : null}
              <div className="text-xl font-bold text-secondary dark:text-neutral-100">{formatRiyal(item.price, "")}</div>
            </>
          ) : (
            <div className="text-sm font-semibold text-secondary/80 dark:text-neutral-200">{isAr ? "السعر عند الطلب" : "Price on request"}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Link to="/contact" className="px-3 py-2 rounded-full bg-primary text-white text-sm shadow hover:shadow-md">
            {isAr ? "اطلب عرض" : "Request quote"}
          </Link>
          <Link to={`/packages/${item.id}`} className="px-3 py-2 rounded-full border border-primary text-primary text-sm hover:bg-primary/10">
            {isAr ? "المزيد" : "Details"}
          </Link>
        </div>
      </div>
    </article>
  );
}
