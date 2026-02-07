import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { applyToJob, fetchJobOpenings } from "../api/endpoints";
import Skeleton from "../components/ui/Skeleton";
import { JobOpening } from "../types";

const typeLabels = {
  ar: {
    full_time: "دوام كامل",
    part_time: "دوام جزئي",
    contract: "متعاقد",
    intern: "تدريب",
  },
  en: {
    full_time: "Full time",
    part_time: "Part time",
    contract: "Contract",
    intern: "Internship",
  },
} as const;

type ApplyForm = {
  job_id: string;
  full_name: string;
  email: string;
  phone?: string;
  portfolio?: string;
  linkedin?: string;
  cover_letter?: string;
  resume: FileList;
};

export default function CareersPage() {
  const { data, isLoading } = useQuery<JobOpening[]>({
    queryKey: ["jobs"],
    queryFn: () => fetchJobOpenings({ is_active: true, ordering: "-created_at" }),
  });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const { register, handleSubmit, reset, setValue, watch } = useForm<ApplyForm>({
    defaultValues: { job_id: "" },
  });

  const jobsCount = data?.length ?? 0;
  const watchJobId = watch("job_id") || selectedJobId;
  const selectedJob = useMemo(
    () => data?.find((job) => String(job.id) === String(watchJobId)) || null,
    [data, watchJobId]
  );

  const apply = useMutation({
    mutationFn: (payload: FormData) => applyToJob(payload),
    onSuccess: () => {
      toast.success(t("تم استلام طلبك بنجاح.", "Application received successfully."));
      reset({ job_id: selectedJobId || "" });
    },
    onError: () => toast.error(t("تعذر إرسال الطلب، حاول مرة أخرى.", "Unable to submit your application.")),
  });

  const onSubmit = async (values: ApplyForm) => {
    if (!values.job_id) {
      toast.error(t("يرجى اختيار الوظيفة أولاً.", "Please select a job first."));
      return;
    }
    const resumeFile = values.resume?.[0];
    if (!resumeFile) {
      toast.error(t("يرجى إرفاق السيرة الذاتية.", "Please upload your CV."));
      return;
    }
    const extras = [
      values.portfolio ? `${t("الموقع/الملف", "Portfolio")}: ${values.portfolio}` : "",
      values.linkedin ? `${t("LinkedIn", "LinkedIn")}: ${values.linkedin}` : "",
    ].filter(Boolean);

    const cover = [values.cover_letter || "", extras.length ? "\n" + extras.join("\n") : ""].join("").trim();

    const formData = new FormData();
    formData.append("job", values.job_id);
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    if (values.phone) formData.append("phone", values.phone);
    if (cover) formData.append("cover_letter", cover);
    formData.append("resume", resumeFile);

    apply.mutate(formData);
  };

  return (
    <Layout>
      <MetaHead
        title={isAr ? "انضم لفريق لافا" : "Join the LAVA team"}
        description={isAr ? "فرص وظيفية في التطوير، التصميم، وإدارة المنتجات." : "Roles across engineering, design, and product."}
      />

      <section className="py-14 container mx-auto px-4 space-y-10 text-secondary dark:text-neutral-100">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/12 via-rose-50 to-white dark:from-primary/20 dark:via-neutral-900 dark:to-neutral-950 border border-accent/40 dark:border-neutral-800 shadow-2xl">
          <div className="absolute -left-14 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center px-6 py-10 md:px-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary/60 dark:text-neutral-400">
                {isAr ? "فرص التوظيف" : "Careers"}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-secondary dark:text-white">
                {isAr ? "نبني منتجات رقمية قوية — وانضمامك يصنع الفرق" : "We ship digital products. Your impact matters."}
              </h1>
              <p className="text-secondary/80 dark:text-neutral-200 max-w-2xl">
                {isAr
                  ? "بيئة مرنة، تحديات تقنية حقيقية، وتعلّم مستمر ضمن فريق يجمع بين التصميم والهندسة والنمو." 
                  : "A flexible environment, real technical challenges, and continuous learning with a multidisciplinary team."}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-secondary/70 dark:text-neutral-300">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {isAr ? "عمل مرن" : "Flexible work"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {isAr ? "مشاريع متنوعة" : "Diverse projects"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-accent/50 dark:border-neutral-700">
                  {isAr ? "نمو مهني" : "Career growth"}
                </span>
              </div>
            </div>

            <div className="bg-white/85 dark:bg-neutral-900/80 border border-accent/40 dark:border-neutral-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-secondary/60 dark:text-neutral-400">{t("الوظائف المفتوحة", "Open roles")}</div>
                  <div className="text-lg font-semibold text-secondary dark:text-white">{jobsCount} {t("وظائف", "roles")}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/30">
                  {t("تحديث مستمر", "Updated" )}
                </span>
              </div>
              <ul className={`${isAr ? "pr-4 list-disc" : "pl-4 list-disc"} text-sm text-secondary/70 dark:text-neutral-300 space-y-2`}>
                <li>{isAr ? "نظام مراجعة واضح" : "Clear review process"}</li>
                <li>{isAr ? "مقابلات مركزة" : "Focused interviews"}</li>
                <li>{isAr ? "تغذية راجعة سريعة" : "Fast feedback"}</li>
              </ul>
              <a href="#apply" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white">
                {t("تقديم طلب", "Apply now")}
              </a>
            </div>
          </div>
        </div>

        <SectionTitle
          title={isAr ? "الوظائف المتاحة" : "Open positions"}
          subtitle={isAr ? "اختر الدور الأنسب لقدراتك وابدأ التقديم فوراً." : "Pick the role that fits your skills and apply."}
        />

        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : data && data.length ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {data.map((job) => (
              <div key={job.id} className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-6 shadow space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">{job.title}</h3>
                    <p className="text-sm text-secondary/70 dark:text-neutral-300">
                      {job.department || t("عام", "General")} · {job.employment_type ? typeLabels[isAr ? "ar" : "en"][job.employment_type as keyof typeof typeLabels.en] : t("دوام كامل", "Full time")}
                    </p>
                    <p className="text-sm text-secondary/70 dark:text-neutral-300">
                      {t("الموقع", "Location")}: {job.location || t("عن بعد", "Remote")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const id = String(job.id);
                      setSelectedJobId(id);
                      setValue("job_id", id, { shouldValidate: true });
                      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-full bg-primary text-white text-sm"
                  >
                    {t("قدم الآن", "Apply")}
                  </button>
                </div>

                <p className="text-sm text-secondary/80 dark:text-neutral-300">{job.description}</p>

                {job.requirements?.length ? (
                  <div>
                    <div className="text-sm font-semibold text-secondary dark:text-neutral-100 mb-2">{t("المتطلبات", "Requirements")}</div>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req) => (
                        <span key={req} className="px-3 py-1 rounded-full bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700 text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {job.benefits?.length ? (
                  <div className="text-sm text-secondary/70 dark:text-neutral-300">
                    <span className="font-semibold text-secondary dark:text-neutral-100">{t("المزايا", "Benefits")}: </span>
                    {job.benefits.join(" · ")}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary/70 dark:text-neutral-300">{t("لا توجد وظائف متاحة حالياً.", "No roles are available right now.")}</p>
        )}

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start" id="apply">
          <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-6 shadow space-y-4">
            <h3 className="text-xl font-bold text-secondary dark:text-neutral-50">{t("نموذج التقديم", "Application form")}</h3>
            <p className="text-sm text-secondary/70 dark:text-neutral-300">
              {t("طلب الوظائف منفصل عن طلب الباقات والخدمات.", "Job applications are separate from service requests.")}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">{t("اختر الوظيفة", "Select role")}</label>
                <select
                  {...register("job_id", { required: true })}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                >
                  <option value="">{t("اختر", "Choose")}</option>
                  {data?.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">{t("الاسم الكامل", "Full name")}</label>
                  <input
                    {...register("full_name", { required: true })}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder={t("اكتب اسمك", "Your name")}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">{t("البريد الإلكتروني", "Email")}</label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">{t("رقم التواصل", "Phone")}</label>
                  <input
                    {...register("phone")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder={t("+9665xxxxxxxx", "+9665xxxxxxxx")}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">{t("رابط الأعمال/الموقع", "Portfolio URL")}</label>
                  <input
                    {...register("portfolio")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">LinkedIn</label>
                  <input
                    {...register("linkedin")}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">{t("السيرة الذاتية", "Resume")}</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    {...register("resume", { required: true })}
                    className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  />
                  <p className="text-xs text-secondary/60 dark:text-neutral-400 mt-1">
                    {t("يُقبل PDF أو DOC/DOCX — يتم فحص السيرة الذاتية تلقائياً.", "PDF or DOC/DOCX — CV is scanned for malware.")}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">{t("نبذة مختصرة", "Short note")}</label>
                <textarea
                  rows={4}
                  {...register("cover_letter")}
                  className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                  placeholder={
                    t(
                      "عرّفنا بنفسك وبما يميزك ولماذا يناسبك هذا الدور.",
                      "Tell us about your experience and why you're a fit for this role."
                    )
                  }
                />
              </div>

              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg w-full" disabled={apply.isPending}>
                {apply.isPending ? t("جاري الإرسال...", "Submitting...") : t("إرسال الطلب", "Submit application")}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-surface dark:bg-neutral-900 p-6 rounded-2xl border border-accent/50 dark:border-neutral-800 shadow space-y-3">
              <h4 className="font-bold text-secondary dark:text-neutral-50">{t("مراحل التوظيف", "Hiring steps")}</h4>
              <ol className={`${isAr ? "pr-5" : "pl-5"} list-decimal text-sm text-secondary/80 dark:text-neutral-300 space-y-2`}>
                <li>{t("مراجعة السيرة الذاتية والفحص الأمني", "CV review and security scan")}</li>
                <li>{t("مكالمة تعريفية قصيرة", "Quick intro call")}</li>
                <li>{t("مهمة عملية أو مقابلة تقنية", "Technical interview or task")}</li>
                <li>{t("قرار نهائي وعرض وظيفي", "Final decision and offer")}</li>
              </ol>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-accent/40 dark:border-neutral-800 shadow space-y-4">
              <h4 className="font-bold text-secondary dark:text-neutral-50">{t("لماذا LAVA؟", "Why LAVA?")}</h4>
              <ul className={`${isAr ? "pr-4 list-disc" : "pl-4 list-disc"} text-sm text-secondary/70 dark:text-neutral-300 space-y-2`}>
                <li>{t("مشاريع حقيقية وتأثير مباشر", "Real projects with tangible impact")}</li>
                <li>{t("تطوير مهني ودورات داخلية", "Career growth and internal training")}</li>
                <li>{t("ثقافة واضحة مبنية على النتائج", "Outcome-driven culture")}</li>
              </ul>
            </div>

            {selectedJob ? (
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-accent/40 dark:border-neutral-800 shadow space-y-2">
                <div className="text-xs text-secondary/60 dark:text-neutral-400">{t("الوظيفة المحددة", "Selected role")}</div>
                <div className="text-lg font-semibold text-secondary dark:text-neutral-100">{selectedJob.title}</div>
                <div className="text-sm text-secondary/70 dark:text-neutral-300">
                  {selectedJob.department || t("عام", "General")} · {selectedJob.location || t("عن بعد", "Remote")}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </Layout>
  );
}
