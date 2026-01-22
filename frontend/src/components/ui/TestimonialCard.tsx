import { useTranslation } from "react-i18next";
import { Client } from "../../types";

export default function TestimonialCard({ client }: { client: Client }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const displayText =
    client.testimonial ||
    client.quote ||
    (isAr
      ? "تجربة إيجابية مع فريق لافا في السرعة والجودة والالتزام."
      : "A positive experience with LAVA - the team moved fast, kept quality high, and communicated clearly.");

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow border border-accent/30 dark:border-neutral-800 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary text-white grid place-items-center font-bold">
          {client.name.substring(0, 1)}
        </div>
        <div>
          <h4 className="font-bold text-secondary dark:text-neutral-50">{client.name}</h4>
          <p className="text-xs text-secondary/70 dark:text-neutral-300">
            {isAr ? "التقييم" : "Rating"} {client.rating ?? 5}/5
          </p>
        </div>
      </div>
      <p className="text-sm text-secondary/80 dark:text-neutral-300 leading-7">{displayText}</p>
    </div>
  );
}
