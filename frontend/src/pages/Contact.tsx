import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import { fetchContactInfo, fetchPackages, submitContact } from "../api/endpoints";
import { Package } from "../types";

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
  ar: [
    "فكرة أولية",
    "تصميم جاهز",
    "منتج قائم يحتاج تطوير",
    "إطلاق عاجل",
    "غير محدد",
  ],
  en: [
    "Early idea",
    "Design ready",
    "Existing product to upgrade",
    "Urgent launch",
    "Not sure yet",
  ],
} as const;

const timelineOptions = {
  ar: [
    "أقل من شهر",
    "1-2 شهر",
    "2-3 أشهر",
    "3-6 أشهر",
    "حسب العرض",
  ],
  en: [
    "Less than 1 month",
    "1-2 months",
    "2-3 months",
    "3-6 months",
    "Depends on proposal",
  ],
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
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/12 via-rose-50 to-white dark:from-primary/20 dark:via-neutral-900 dark:to-neutral-950 border border-accent/40 dark:border-neutral-800 shadow-2xl">
          <div className="absolute -left-14 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-center px-6 py-10 md:px-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {isAr ? "طلب باقة أو خدمة" : "Request a package"}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-secondary dark:text-white">
                {isAr ? "أرسل طلبك واستلم عرضاً مفصلاً" : "Send your brief and get a detailed proposal"}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-200 max-w-2xl">
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
            <div className="bg-white/85 dark:bg-neutral-900/80 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="text-sm text-secondary/60 dark:text-neutral-400">{isAr ? "ماذا سنرسل لك؟" : "What you get"}</div>
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
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="space-y-6">
            <SectionTitle
              title={isAr ? "بيانات الطلب" : "Request details"}
              subtitle={
                isAr
                  ? "املأ البيانات الأساسية لنرسل لك عرضاً دقيقاً يناسب نطاقك وميزانيتك."
                  : "Fill in the essentials so we can send an accurate proposal."}
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow border border-accent/30 dark:border-neutral-800 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">{isAr ? "الاسم الكامل" : "Full name"}</label>
                  <input
                    {...register("name", { required: true })}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder={isAr ? "اكتب اسمك" : "Your name"}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">{isAr ? "المنشأة" : "Company"}</label>
                  <input
                    {...register("company")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder={isAr ? "اسم الشركة (اختياري)" : "Company name (optional)"}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                  <label className="block text-sm mb-1">{isAr ? "رقم التواصل" : "Phone"}</label>
                  <input
                    {...register("phone")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder={isAr ? "+9665xxxxxxxx" : "+9665xxxxxxxx"}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">{isAr ? "الموقع الإلكتروني" : "Website"}</label>
                  <input
                    {...register("website")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder={isAr ? "https://example.com" : "https://example.com"}
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
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">{isAr ? "نوع الرسالة" : "Message type"}</label>
                  <select
                    {...register("topic")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  >
                    <option value="sales">{isAr ? "طلب باقة/خدمة" : "Sales / Package"}</option>
                    <option value="support">{isAr ? "دعم فني أو مشكلة" : "Support / Issue"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{isAr ? "طريقة الدفع المفضلة" : "Preferred payment method"}</label>
                  <select
                    {...register("payment_method")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  >
                    <option value="">{isAr ? "بدون تحديد" : "No preference"}</option>
                    {paymentMethods.map((method) => (
                      <option key={method.name} value={method.name}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">{isAr ? "نوع الطلب" : "Request type"}</label>
                  <select
                    {...register("package_type")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  >
                    <option value="service">{isAr ? "خدمة منفردة" : "Single service"}</option>
                    <option value="bundle">{isAr ? "باقة كاملة" : "Full package"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{isAr ? "الباقة المرغوبة" : "Package preference"}</label>
                  <select
                    {...register("package_interest")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  >
                    <option value="">{isAr ? "غير محدد" : "Not sure yet"}</option>
                    {packages?.map((pkg) => (
                      <option key={pkg.id} value={isAr ? pkg.title_ar : pkg.title_en}>
                        {isAr ? pkg.title_ar : pkg.title_en}
                      </option>
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
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">{isAr ? "مرحلة المشروع" : "Project stage"}</label>
                  <select
                    {...register("stage")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  >
                    <option value="">{isAr ? "اختر المرحلة" : "Select stage"}</option>
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{isAr ? "المدة المتوقعة" : "Timeline"}</label>
                  <select
                    {...register("timeline")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  >
                    <option value="">{isAr ? "اختر المدة" : "Select timeline"}</option>
                    {timelines.map((timeline) => (
                      <option key={timeline} value={timeline}>
                        {timeline}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{isAr ? "الميزانية" : "Budget"}</label>
                  <input
                    {...register("budget")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder={isAr ? "مثال: 15,000 - 30,000 ريال" : "e.g. SAR 15,000 - 30,000"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">{isAr ? "وصف الطلب" : "Project brief"}</label>
                <textarea
                  rows={5}
                  {...register("message", { required: true })}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  placeholder={
                    isAr
                      ? "اشرح الهدف، المزايا المطلوبة، الفئات المستهدفة، وأي ملاحظات خاصة." 
                      : "Share goals, required features, target audience, and any special notes."
                  }
                />
              </div>

              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg w-full">
                {isAr ? "إرسال الطلب الآن" : "Send request"}
              </button>
              <p className="text-xs text-secondary/60 dark:text-neutral-400">
                {isAr ? "نرد عادة خلال 24–48 ساعة عمل." : "We usually respond within 24–48 business hours."}
              </p>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="bg-surface dark:bg-neutral-900 p-6 rounded-2xl border border-accent/50 dark:border-neutral-800 shadow space-y-3">
              <h4 className="font-bold text-secondary dark:text-neutral-50">{isAr ? "خطوات العمل" : "Delivery steps"}</h4>
              <ol className={`${isAr ? "pr-5" : "pl-5"} list-decimal text-sm text-secondary/80 dark:text-neutral-300 space-y-2`}>
                <li>{isAr ? "مراجعة الطلب وتحديد النطاق" : "Review request and define scope"}</li>
                <li>{isAr ? "إرسال العرض والجدول الزمني" : "Send proposal and timeline"}</li>
                <li>{isAr ? "توقيع العقد وخطة الدفعات" : "Agreement and payment plan"}</li>
                <li>{isAr ? "بدء التنفيذ والمتابعة" : "Start delivery with updates"}</li>
              </ol>
            </div>

            <div className="bg-surface dark:bg-neutral-900 p-6 rounded-2xl border border-accent/50 dark:border-neutral-800 shadow space-y-3">
              <h4 className="font-bold text-secondary dark:text-neutral-50">{isAr ? "طرق الدفع" : "Payment options"}</h4>
              <div className="flex flex-wrap items-center gap-2">
                {paymentMethods.map((method) => (
                  <span key={method.name} className="inline-flex items-center justify-center rounded-md bg-white border border-accent/20 px-2 py-1">
                    <img src={method.logo} alt={method.name} className="h-6 w-auto" loading="lazy" />
                  </span>
                ))}
              </div>
              <p className="text-xs text-secondary/70 dark:text-neutral-300">
                {isAr
                  ? "بوابات دفع آمنة داخل السعودية وخارجها، مع إمكانية جدولة الدفعات حسب الاتفاق."
                  : "Secure local and international gateways, with installment scheduling available on request."}
              </p>
            </div>

            {featured.length ? (
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-accent/40 dark:border-neutral-800 shadow space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-secondary dark:text-neutral-50">{isAr ? "باقات مميزة" : "Featured packages"}</h4>
                  <a href="/packages" className="text-primary text-sm underline">
                    {isAr ? "كل الباقات" : "All packages"}
                  </a>
                </div>
                <div className="space-y-3">
                  {featured.map((pkg) => {
                    const title = isAr ? pkg.title_ar : pkg.title_en;
                    const note = isAr ? pkg.price_note : pkg.price_note_en || pkg.price_note;
                    const short = isAr ? pkg.short_description_ar : pkg.short_description_en;
                    return (
                      <div key={pkg.id} className="border border-accent/30 dark:border-neutral-800 rounded-xl p-3">
                        <div className="text-sm text-secondary/60 dark:text-neutral-400">
                          {pkg.category ? (isAr ? pkg.category.name_ar : pkg.category.name_en) : isAr ? "باقات" : "Packages"}
                        </div>
                        <div className="font-semibold text-secondary dark:text-neutral-100">{title}</div>
                        {short ? <div className="text-xs text-secondary/70 dark:text-neutral-300">{short}</div> : null}
                        <div className="text-xs text-secondary/70 dark:text-neutral-300 mt-1">
                          {note ? note : `${pkg.price} ${pkg.currency}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="bg-surface dark:bg-neutral-900 p-6 rounded-2xl border border-accent/50 dark:border-neutral-800 shadow space-y-2">
              <h4 className="font-bold text-secondary dark:text-neutral-50">{isAr ? "بيانات التواصل" : "Contact details"}</h4>
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
          </aside>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-secondary dark:text-neutral-50 mb-3">
            {isAr ? "معلومات تساعدنا على تقدير أدق" : "Info that helps us estimate accurately"}
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-secondary/80 dark:text-neutral-300">
            <div className="rounded-xl border border-accent/30 dark:border-neutral-800 p-4">
              <div className="font-semibold mb-2">{isAr ? "الهدف التجاري" : "Business goal"}</div>
              <div>{isAr ? "زيادة المبيعات، جذب عملاء، أو أتمتة العمليات." : "Sales growth, lead generation, or operations automation."}</div>
            </div>
            <div className="rounded-xl border border-accent/30 dark:border-neutral-800 p-4">
              <div className="font-semibold mb-2">{isAr ? "نطاق المزايا" : "Feature scope"}</div>
              <div>{isAr ? "الخصائص الأساسية والمزايا الإضافية المطلوبة." : "Core features plus any advanced add-ons."}</div>
            </div>
            <div className="rounded-xl border border-accent/30 dark:border-neutral-800 p-4">
              <div className="font-semibold mb-2">{isAr ? "البيانات والمحتوى" : "Content readiness"}</div>
              <div>{isAr ? "الشعار، النصوص، الصور، أو الحاجة لإعدادها." : "Logos, copy, assets, or need for content creation."}</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
