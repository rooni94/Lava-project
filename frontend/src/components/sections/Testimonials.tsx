import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchClients } from "../../api/endpoints";
import SectionTitle from "../ui/SectionTitle";
import TestimonialCard from "../ui/TestimonialCard";
import { Client } from "../../types";

const fallback = {
  ar: [
    {
      id: 1,
      name: "شركة الشرق",
      testimonial:
        "لافا كانت شريكًا تقنيًا موثوقًا؛ نفذوا لوحة تحكم متينة مع تجربة مستخدم رائعة.",
      rating: 5,
    },
    {
      id: 2,
      name: "منظومة نماء",
      testimonial: "التواصل سريع، وخطوات العمل واضحة، والنتيجة مطابقة للمتطلبات.",
      rating: 5,
    },
  ],
  en: [
    {
      id: 1,
      name: "Eastward Group",
      testimonial:
        "LAVA was a reliable technical partner - delivering a robust admin panel and a polished experience on schedule.",
      rating: 5,
    },
    {
      id: 2,
      name: "Nama Ventures",
      testimonial: "Communication was fast, the delivery plan was clear, and the final product matched the requirements.",
      rating: 5,
    },
  ],
};

export default function Testimonials() {
  const { data: clients } = useQuery<Client[]>({ queryKey: ["clients"], queryFn: fetchClients });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const list: Client[] = clients && clients.length ? clients : isAr ? fallback.ar : fallback.en;

  return (
    <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100">
      <SectionTitle
        title={isAr ? "شهادات عملائنا" : "Client testimonials"}
        subtitle={isAr ? "قصص نجاح من عملاء وثقوا بنا لبناء منتجاتهم." : "Success stories from teams that trusted us with their products."}
      />
      <div className="grid md:grid-cols-3 gap-6">
        {list.slice(0, 3).map((client) => (
          <TestimonialCard key={client.id} client={client} />
        ))}
      </div>
    </section>
  );
}
