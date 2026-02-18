import { ReactNode, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import { fetchContactInfo, fetchPackages, submitContact } from "../api/endpoints";
import { Package } from "../types";
import { formatRiyal, renderRiyalText } from "../utils/currency";

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

const stageOptions = {
  ar: ["فكرة أولية", "تصميم جاهز", "منتج قائم يحتاج تطوير", "إطلاق عاجل", "غير محدد"],
  en: ["Early idea", "Design ready", "Existing product to upgrade", "Urgent launch", "Not sure yet"],
} as const;

const timelineOptions = {
  ar: ["أقل من شهر", "1-2 شهر", "2-3 أشهر", "3-6 أشهر", "حسب العرض"],
  en: ["Less than 1 month", "1-2 months", "2-3 months", "3-6 months", "Depends on proposal"],
} as const;

const paymentMethods = [
  { name: "Stripe", logo: "/payments/stripe.svg" },
  { name: "Tappy", logo: "/payments/tappy.svg" },
  { name: "Tamara", logo: "/payments/tamara.svg" },
  { name: "Apple Pay", logo: "/payments/apple-pay.svg" },
  { name: "Visa", logo: "/payments/visa.svg" },
  { name: "Mada", logo: "/payments/mada.svg" },
];

type ContactForm = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  website?: string;
  inquiry: "web" | "mobile" | "erp" | "other";
  topic: "sales" | "support";
  package_type: "service" | "bundle";
  package_interest?: string;
  budget?: string;
  timeline?: string;
  stage?: string;
  payment_method?: string;
  message: string;
};

export default function ContactPage() {
  const { data: contactInfo } = useQuery({ queryKey: ["contact-info"], queryFn: fetchContactInfo });
  const { data: packages } = useQuery<Package[]>({
    queryKey: ["packages", "contact"],
    queryFn: () => fetchPackages({ product_type: "service", ordering: "-featured" }),
  });

  const { register, handleSubmit, reset, watch } = useForm<ContactForm>({
    defaultValues: { inquiry: "web", package_type: "service", topic: "sales" },
  });

  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const options = isAr ? inquiryOptions.ar : inquiryOptions.en;
  const stages = isAr ? stageOptions.ar : stageOptions.en;
  const timelines = isAr ? timelineOptions.ar : timelineOptions.en;

  const featured = useMemo(() => packages?.filter((p) => p.featured).slice(0, 3) ?? [], [packages]);
  const watchPackageType = watch("package_type");

  const onSubmit = async (values: ContactForm) => {
    const label = (ar: string, en: string) => (isAr ? ar : en);
    const extraLines = [
      label("— تفاصيل الطلب —", "--- Request details ---"),
      values.company ? `${label("المنشأة", "Company")}: ${values.company}` : "",
      values.website ? `${label("الموقع", "Website")}: ${values.website}` : "",
      `${label("نوع الخدمة", "Service type")}: ${options.find((o) => o.value === values.inquiry)?.label || values.inquiry}`,
      `${label("نوع الرسالة", "Message type")}: ${values.topic === "support" ? label("دعم فني", "Support") : label("طلب باقة/خدمة", "Sales / Package")}`,
      `${label("نوع الباقة", "Package type")}: ${values.package_type === "bundle" ? label("باقة", "Bundle") : label("خدمة", "Service")}`,
      values.package_interest ? `${label("الباقة المرغوبة", "Package preference")}: ${values.package_interest}` : "",
      values.stage ? `${label("مرحلة المشروع", "Project stage")}: ${values.stage}` : "",
      values.timeline ? `${label("المدة المتوقعة", "Timeline")}: ${values.timeline}` : "",
      values.budget ? `${label("الميزانية", "Budget")}: ${values.budget}` : "",
      values.payment_method ? `${label("طريقة الدفع المفضلة", "Preferred payment")}: ${values.payment_method}` : "",
    ].filter(Boolean);

    const fullMessage = `${values.message}\n\n${extraLines.join("\n")}`.trim();

    try {
      await submitContact({
        name: values.name,
        email: values.email,
        message: fullMessage,
        service_type: values.inquiry,
        topic: values.topic,
        language: i18n.language,
        phone: values.phone,
      });

      reset({ inquiry: values.inquiry, package_type: values.package_type, topic: values.topic });
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
      <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl dark:bg-white/5" />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {isAr ? "طلب باقة أو خدمة" : "Request a package"}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-secondary dark:text-white">
                {isAr ? "أرسل طلبك واستلم عرضاً دقيقاً" : "Send your brief and get a precise proposal"}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-200 max-w-2xl leading-8">
                {isAr
                  ? "نراجع الهدف والنطاق والميزانية، ثم نرسل خطة عمل واضحة وجدولاً زمنيًا خلال 24–48 ساعة عمل."
                  : "We review goals, scope, and budget, then deliver a clear plan and timeline within 24–48 business hours."}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-secondary/70 dark:text-neutral-300">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {isAr ? "تطوير ويب وجوال" : "Web & mobile"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {isAr ? "أنظمة أعمال" : "Business systems"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {isAr ? "تصميم ومحتوى وتسويق" : "Design, content & marketing"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-accent/45 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 p-5 shadow-lg space-y-3">
              <div className="text-sm text-secondary/60 dark:text-neutral-400">{isAr ? "ماذا ستحصل؟" : "What you get"}</div>
              <div className="text-lg font-semibold text-secondary dark:text-white">
                {isAr ? "عرض سعر + خطة تنفيذ واضحة" : "Proposal + delivery plan"}
              </div>
              <ul className={`text-sm text-secondary/70 dark:text-neutral-300 space-y-2 ${isAr ? "pr-4 list-disc" : "pl-4 list-disc"}`}>
                <li>{isAr ? "نطاق العمل التفصيلي" : "Detailed scope and deliverables"}</li>
                <li>{isAr ? "مدة التنفيذ والمراحل" : "Timeline with milestones"}</li>
                <li>{isAr ? "التكلفة والدفعات" : "Cost and payment plan"}</li>
                <li>{isAr ? "التقنيات والأدوات المقترحة" : "Recommended tech stack"}</li>
              </ul>
              <div className="text-xs text-secondary/60 dark:text-neutral-400">
                {isAr ? "متوسط الرد: 24–48 ساعة عمل" : "Average response: 24–48 business hours"}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="space-y-6">
            <SectionTitle
              title={isAr ? "بيانات الطلب" : "Request details"}
              subtitle={
                isAr
                  ? "املأ البيانات الأساسية لنرسل عرضًا دقيقًا يناسب نطاقك وميزانيتك."
                  : "Fill in the essentials so we can send an accurate proposal."}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="neo-panel p-5 md:p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr ? "الاسم الكامل" : "Full name"}>
                  <input {...register("name", { required: true })} className="field-input" placeholder={isAr ? "اكتب اسمك" : "Your name"} />
                </Field>
                <Field label={isAr ? "المنشأة" : "Company"}>
                  <input {...register("company")} className="field-input" placeholder={isAr ? "اسم الشركة (اختياري)" : "Company name (optional)"} />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr ? "البريد الإلكتروني" : "Email"}>
                  <input type="email" {...register("email", { required: true })} className="field-input" placeholder="name@email.com" />
                </Field>
                <Field label={isAr ? "رقم التواصل" : "Phone"}>
                  <input {...register("phone")} className="field-input" placeholder="+9665xxxxxxxx" />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr ? "الموقع الإلكتروني" : "Website"}>
                  <input {...register("website")} className="field-input" placeholder="https://example.com" />
                </Field>
                <Field label={isAr ? "نوع الخدمة" : "Service type"}>
                  <select {...register("inquiry")} className="field-input">
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr ? "نوع الرسالة" : "Message type"}>
                  <select {...register("topic")} className="field-input">
                    <option value="sales">{isAr ? "طلب باقة/خدمة" : "Sales / Package"}</option>
                    <option value="support">{isAr ? "دعم فني أو مشكلة" : "Support / Issue"}</option>
                  </select>
                </Field>
                <Field label={isAr ? "طريقة الدفع المفضلة" : "Preferred payment method"}>
                  <select {...register("payment_method")} className="field-input">
                    <option value="">{isAr ? "بدون تحديد" : "No preference"}</option>
                    {paymentMethods.map((method) => (
                      <option key={method.name} value={method.name}>{method.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr ? "نوع الطلب" : "Request type"}>
                  <select {...register("package_type")} className="field-input">
                    <option value="service">{isAr ? "خدمة منفردة" : "Single service"}</option>
                    <option value="bundle">{isAr ? "باقة كاملة" : "Full package"}</option>
                  </select>
                </Field>
                <Field label={isAr ? "الباقة المرغوبة" : "Package preference"}>
                  <select {...register("package_interest")} className="field-input">
                    <option value="">{isAr ? "غير محدد" : "Not sure yet"}</option>
                    {packages?.map((pkg) => (
                      <option key={pkg.id} value={isAr ? pkg.title_ar : pkg.title_en}>{isAr ? pkg.title_ar : pkg.title_en}</option>
                    ))}
                  </select>
                  <p className="text-xs text-secondary/60 dark:text-neutral-400 mt-1">
                    {watchPackageType === "bundle"
                      ? isAr
                        ? "اختر الباقة الأقرب، وسنقترح التعديلات المناسبة."
                        : "Pick the closest bundle and we'll tailor the scope."
                      : isAr
                        ? "اختياري إذا كنت تريد خدمة محددة."
                        : "Optional if you need a specific service."}
                  </p>
                </Field>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label={isAr ? "مرحلة المشروع" : "Project stage"}>
                  <select {...register("stage")} className="field-input">
                    <option value="">{isAr ? "اختر المرحلة" : "Select stage"}</option>
                    {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                  </select>
                </Field>
                <Field label={isAr ? "المدة المتوقعة" : "Timeline"}>
                  <select {...register("timeline")} className="field-input">
                    <option value="">{isAr ? "اختر المدة" : "Select timeline"}</option>
                    {timelines.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}
                  </select>
                </Field>
                <Field label={isAr ? "الميزانية" : "Budget"}>
                  <input {...register("budget")} className="field-input" placeholder={isAr ? "مثال: 15,000 - 30,000 ريال" : "e.g. SAR 15,000 - 30,000"} />
                </Field>
              </div>

              <Field label={isAr ? "وصف الطلب" : "Project brief"}>
                <textarea
                  rows={5}
                  {...register("message", { required: true })}
                  className="field-input"
                  placeholder={
                    isAr
                      ? "اشرح الهدف، المزايا المطلوبة، الفئات المستهدفة، وأي ملاحظات خاصة."
                      : "Share goals, required features, target audience, and any special notes."
                  }
                />
              </Field>

              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl w-full shadow-[0_12px_24px_rgba(var(--color-primary),0.3)]">
                {isAr ? "إرسال الطلب الآن" : "Send request"}
              </button>
              <p className="text-xs text-secondary/60 dark:text-neutral-400">{isAr ? "نرد عادة خلال 24–48 ساعة عمل." : "We usually respond within 24–48 business hours."}</p>
            </form>
          </div>

          <aside className="space-y-5">
            <SideCard title={isAr ? "خطوات العمل" : "Delivery steps"}>
              <ol className={`${isAr ? "pr-5" : "pl-5"} list-decimal text-sm text-secondary/80 dark:text-neutral-300 space-y-2`}>
                <li>{isAr ? "مراجعة الطلب وتحديد النطاق" : "Review request and define scope"}</li>
                <li>{isAr ? "إرسال العرض والجدول الزمني" : "Send proposal and timeline"}</li>
                <li>{isAr ? "توقيع العقد وخطة الدفعات" : "Agreement and payment plan"}</li>
                <li>{isAr ? "بدء التنفيذ والمتابعة" : "Start delivery with updates"}</li>
              </ol>
            </SideCard>

            {featured.length ? (
              <SideCard title={isAr ? "باقات مميزة" : "Featured packages"}>
                <div className="space-y-3">
                  {featured.map((pkg) => {
                    const title = isAr ? pkg.title_ar : pkg.title_en;
                    const note = isAr ? pkg.price_note : pkg.price_note_en || pkg.price_note;
                    const short = isAr ? pkg.short_description_ar : pkg.short_description_en;
                    return (
                      <div key={pkg.id} className="border border-accent/30 dark:border-neutral-800 rounded-xl p-3 bg-white/80 dark:bg-neutral-900/70">
                        <div className="text-xs text-secondary/60 dark:text-neutral-400">
                          {pkg.category ? (isAr ? pkg.category.name_ar : pkg.category.name_en) : isAr ? "باقات" : "Packages"}
                        </div>
                        <div className="font-semibold text-secondary dark:text-neutral-100">{title}</div>
                        {short ? <div className="text-xs text-secondary/70 dark:text-neutral-300">{short}</div> : null}
                        <div className="text-xs text-secondary/70 dark:text-neutral-300 mt-1">
                          {pkg.show_price === false ? (isAr ? "السعر عند الطلب" : "Price on request") : note ? renderRiyalText(note) : formatRiyal(pkg.price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <a href="/packages" className="mt-3 inline-flex text-primary text-sm underline">
                  {isAr ? "كل الباقات" : "All packages"}
                </a>
              </SideCard>
            ) : null}

            <SideCard title={isAr ? "بيانات التواصل" : "Contact details"}>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">{contactInfo?.location || (isAr ? "الرياض - السعودية" : "Riyadh, Saudi Arabia")}</p>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">{isAr ? "الهاتف:" : "Phone:"} {contactInfo?.phone || "+966 11 123 4567"}</p>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">{isAr ? "البريد:" : "Email:"} {contactInfo?.email || "info@lava-tech.sa"}</p>
              <p className="text-sm text-secondary/80 dark:text-neutral-300">
                {isAr ? "ساعات العمل:" : "Working hours:"} {contactInfo?.working_hours || (isAr ? "الأحد - الخميس، 8 ص - 6 م" : "Sunday - Thursday, 8 AM - 6 PM")}
              </p>
            </SideCard>
          </aside>
        </div>

        <div className="neo-panel p-6">
          <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50 mb-3">
            {isAr ? "معلومات تساعدنا على تقدير أدق" : "Info that helps us estimate accurately"}
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-secondary/80 dark:text-neutral-300">
            <div className="rounded-xl border border-accent/30 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/60">
              <div className="font-semibold mb-2">{isAr ? "الهدف التجاري" : "Business goal"}</div>
              <div>{isAr ? "زيادة المبيعات، جذب عملاء، أو أتمتة العمليات." : "Sales growth, lead generation, or operations automation."}</div>
            </div>
            <div className="rounded-xl border border-accent/30 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/60">
              <div className="font-semibold mb-2">{isAr ? "نطاق المزايا" : "Feature scope"}</div>
              <div>{isAr ? "الخصائص الأساسية والمزايا الإضافية المطلوبة." : "Core features plus any advanced add-ons."}</div>
            </div>
            <div className="rounded-xl border border-accent/30 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/60">
              <div className="font-semibold mb-2">{isAr ? "البيانات والمحتوى" : "Content readiness"}</div>
              <div>{isAr ? "الشعار، النصوص، الصور، أو الحاجة لإعدادها." : "Logos, copy, assets, or need for content creation."}</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="neo-panel p-5 space-y-3">
      <h4 className="font-bold text-secondary dark:text-neutral-50">{title}</h4>
      {children}
    </div>
  );
}
