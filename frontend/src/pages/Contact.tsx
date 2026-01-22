import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import { fetchContactInfo, submitContact } from "../api/endpoints";

type ContactForm = {
  name: string;
  email: string;
  phone?: string;
  inquiry: "web" | "mobile" | "erp" | "other";
  message: string;
};

const inquiryOptions = {
  ar: [
    { value: "web", label: "تطوير مواقع" },
    { value: "mobile", label: "تطبيقات جوال" },
    { value: "erp", label: "أنظمة ERP/CRM" },
    { value: "other", label: "خدمة أخرى" },
  ],
  en: [
    { value: "web", label: "Web platforms" },
    { value: "mobile", label: "Mobile apps" },
    { value: "erp", label: "ERP/CRM systems" },
    { value: "other", label: "Other service" },
  ],
} as const;

export default function ContactPage() {
  const { data: contactInfo } = useQuery({ queryKey: ["contact-info"], queryFn: fetchContactInfo });
  const { register, handleSubmit, reset } = useForm<ContactForm>({ defaultValues: { inquiry: "web" } });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const options = isAr ? inquiryOptions.ar : inquiryOptions.en;

  const onSubmit = async (values: ContactForm) => {
    try {
      await submitContact({
        name: values.name,
        email: values.email,
        message: values.message,
        service_type: values.inquiry,
        phone: values.phone,
      });
      reset({ inquiry: values.inquiry });
      toast.success(isAr ? "تم استلام رسالتك، سنعاود التواصل خلال 24 ساعة." : "We received your message. Expect a reply within one business day.");
    } catch {
      toast.error(isAr ? "تعذر إرسال الرسالة، حاول مرة أخرى." : "Unable to send your message. Please try again.");
    }
  };

  return (
    <Layout>
      <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "تواصل معنا" : "Contact us"}
          subtitle={isAr ? "نساعدك في تحويل فكرتك إلى منتج رقمي بأعلى جودة." : "We help turn ideas into reliable digital products."}
        />
        <div className="grid md:grid-cols-2 gap-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow border border-accent/30 dark:border-neutral-800 space-y-4"
          >
            <div>
              <label className="block text-sm mb-1">{isAr ? "الاسم الكامل" : "Full name"}</label>
              <input
                {...register("name", { required: true })}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                placeholder={isAr ? "الاسم" : "Your name"}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                placeholder="name@email.com"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">{isAr ? "رقم التواصل (اختياري)" : "Phone (optional)"}</label>
              <input
                {...register("phone")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                placeholder="+9665xxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">{isAr ? "نوع المشروع" : "Project type"}</label>
              <select
                {...register("inquiry")}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">{isAr ? "الرسالة" : "Message"}</label>
              <textarea
                rows={4}
                {...register("message", { required: true })}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                placeholder={isAr ? "اذكر فكرة المشروع وهدفك الرئيسي" : "Tell us about the idea, goals, and timeline."}
              />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg">
              {isAr ? "أرسل الرسالة" : "Send message"}
            </button>
            <p className="text-xs text-secondary/60 dark:text-neutral-400">
              {isAr ? "نرد عادة خلال يوم عمل واحد." : "We usually respond within one business day."}
            </p>
          </form>
          <div className="space-y-4">
            <div className="bg-surface dark:bg-neutral-900 p-6 rounded-2xl border border-accent/50 dark:border-neutral-800 shadow">
              <h4 className="font-bold text-secondary dark:text-neutral-50 mb-2">{isAr ? "بيانات التواصل" : "Contact details"}</h4>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">
                {contactInfo?.location || (isAr ? "الرياض - السعودية" : "Riyadh, Saudi Arabia")}
              </p>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">
                {isAr ? "الهاتف:" : "Phone:"} {contactInfo?.phone || "+966 11 123 4567"}
              </p>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">
                {isAr ? "البريد:" : "Email:"} {contactInfo?.email || "info@lava-tech.sa"}
              </p>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">
                {isAr ? "ساعات العمل:" : "Working hours:"}{" "}
                {contactInfo?.working_hours || (isAr ? "الأحد - الخميس، 8 ص - 6 م" : "Sunday - Thursday, 8 AM - 6 PM")}
              </p>
            </div>
            <div className="bg-surface dark:bg-neutral-900 p-6 rounded-2xl border border-accent/50 dark:border-neutral-800 shadow">
              <h4 className="font-bold text-secondary dark:text-neutral-50 mb-2">{isAr ? "لماذا لافا؟" : "Why partner with LAVA?"}</h4>
              <ul className="space-y-2 text-sm text-secondary/80 dark:text-neutral-300 list-disc pl-4">
                <li>{isAr ? "خطط تنفيذ واضحة وجدول زمني واقعي." : "Clear execution plans with realistic timelines."}</li>
                <li>{isAr ? "تواصل مباشر مع فريق العمل ومسؤول الحساب." : "Direct communication with the delivery team and account lead."}</li>
                <li>{isAr ? "اختبارات جودة وأمن قبل الإطلاق." : "Quality and security checks before launch."}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
