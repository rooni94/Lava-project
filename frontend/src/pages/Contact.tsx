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
    { value: "web", label: "مواقع ومتاجر إلكترونية" },
    { value: "mobile", label: "تطبيقات الجوال" },
    { value: "erp", label: "أنظمة ERP/CRM" },
    { value: "other", label: "تسويق وهوية / أخرى" },
  ],
  en: [
    { value: "web", label: "Websites & ecommerce" },
    { value: "mobile", label: "Mobile apps" },
    { value: "erp", label: "ERP/CRM systems" },
    { value: "other", label: "Marketing & branding / Other" },
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
      toast.success(
        isAr
          ? "تم استلام طلبك، سنعاود التواصل خلال 24–48 ساعة عمل."
          : "We received your request. Expect a reply within 24–48 business hours."
      );
    } catch {
      toast.error(isAr ? "تعذر إرسال الطلب، حاول مرة أخرى." : "Unable to send your request. Please try again.");
    }
  };

  return (
    <Layout>
      <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "اطلب خدمة أو باقة" : "Request a service or package"}
          subtitle={
            isAr
              ? "صف لنا الهدف ونطاق العمل والميزانية لنرسل عرضًا وجدولًا واضحًا خلال 24–48 ساعة عمل."
              : "Share your goals, scope, and budget to receive a clear proposal within 24–48 business hours."
          }
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
                placeholder={isAr ? "اكتب اسمك" : "Your name"}
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
                placeholder="+9665xxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">{isAr ? "نوع الخدمة" : "Service type"}</label>
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
                placeholder={
                  isAr ? "اشرح الهدف والنطاق والموعد المتوقع والميزانية التقريبية." : "Share goals, scope, timeline, and estimated budget."
                }
              />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg">
              {isAr ? "أرسل الطلب" : "Send request"}
            </button>
            <p className="text-xs text-secondary/60 dark:text-neutral-400">
              {isAr ? "نرد عادة خلال 24–48 ساعة عمل." : "We usually respond within 24–48 business hours."}
            </p>
          </form>
          <div className="space-y-4">
            <div className="bg-surface dark:bg-neutral-900 p-6 rounded-2xl border border-accent/50 dark:border-neutral-800 shadow">
              <h4 className="font-bold text-secondary dark:text-neutral-50 mb-2">{isAr ? "خطوات طلب الخدمة والدفع" : "Request & payment steps"}</h4>
              <ul className={`space-y-2 text-sm text-secondary/80 dark:text-neutral-300 list-disc ${isAr ? "pr-4 text-right" : "pl-4"}`}>
                <li>{isAr ? "عرّفنا بالنشاط والهدف والنطاق والميزانية المتوقعة." : "Share your business context, goals, scope, and budget."}</li>
                <li>{isAr ? "نراجع الاحتياج ونقترح الحل والجدول خلال 24–48 ساعة عمل." : "We propose the right solution and timeline within 24–48 business hours."}</li>
                <li>{isAr ? "بعد الموافقة نوقّع العقد ونصدر الفاتورة ونحدد خطة الدفعات." : "After approval we sign, issue the invoice, and confirm the payment plan."}</li>
                <li>{isAr ? "نبدأ التنفيذ مع مدير مشروع وتحديثات منتظمة حتى التسليم." : "Delivery starts with a dedicated PM and clear milestone updates."}</li>
              </ul>
              <p className="text-xs text-secondary/70 dark:text-neutral-300 mt-3">
                {isAr
                  ? "طرق الدفع المتاحة: Stripe، Tappy، Tamara، Apple Pay، Visa، Mada (السعودية). تتوفر الدفعات حسب الاتفاق."
                  : "Payment methods: Stripe, Tappy, Tamara, Apple Pay, Visa, Mada (Saudi Arabia). Installments available on request."}
              </p>
            </div>
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
          </div>
        </div>
      </section>
    </Layout>
  );
}
