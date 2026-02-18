import { useTranslation } from "react-i18next";
import { renderRiyalText } from "../../utils/currency";
import { Client } from "../../types";
import { motion } from "framer-motion";

export default function TestimonialCard({ client }: { client: Client }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const featured = client.testimonials?.find((item) => item.is_featured) || client.testimonials?.[0];
  const displayText =
    (isAr
      ? featured?.quote || client.testimonial || client.quote
      : featured?.quote_en || featured?.quote || client.testimonial_en || client.testimonial || client.quote) ||
    (isAr
      ? "تجربة إيجابية مع فريق لافا في السرعة والجودة والالتزام."
      : "A positive experience with LAVA - the team moved fast, kept quality high, and communicated clearly.");
  const rating = featured?.rating ?? client.rating ?? 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden p-6 bg-white/90 dark:bg-neutral-900/85 rounded-3xl shadow-[0_12px_34px_rgba(15,23,42,0.1)] border border-accent/35 dark:border-neutral-800 space-y-3"
    >
      <div className="absolute -top-14 -right-12 h-28 w-28 rounded-full bg-primary/12 blur-2xl" />
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white grid place-items-center font-bold shadow-sm">
          {client.name.substring(0, 1)}
        </div>
        <div>
          <h4 className="font-bold text-secondary dark:text-neutral-50">{client.name}</h4>
          <p className="text-xs text-secondary/70 dark:text-neutral-300">
            {isAr ? "التقييم" : "Rating"} {rating}/5
          </p>
        </div>
      </div>
      <p className="text-sm text-secondary/80 dark:text-neutral-300 leading-7 relative">{renderRiyalText(displayText)}</p>
    </motion.div>
  );
}
