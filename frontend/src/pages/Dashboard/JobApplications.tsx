import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Skeleton from "../../components/ui/Skeleton";
import { fetchJobApplications, replyJobApplication, updateJobApplication } from "../../api/endpoints";
import { JobApplication } from "../../types";

const statusLabels = {
  ar: {
    new: "جديد",
    review: "قيد المراجعة",
    interview: "مقابلة",
    hired: "تم التعيين",
    rejected: "مرفوض",
  },
  en: {
    new: "New",
    review: "In review",
    interview: "Interview",
    hired: "Hired",
    rejected: "Rejected",
  },
};

function getDefaultReply(name: string, lang?: string) {
  if (lang === "ar") {
    return {
      subject: "رد على طلب التوظيف - LAVA",
      body: `مرحباً ${name}،\n\nشكرًا لتقديمك. نراجع الآن طلبك وسنعود إليك خلال 24 ساعة عمل.\n\nتحياتنا،\nفريق LAVA`,
    };
  }
  return {
    subject: "Re: Your application - LAVA",
    body: `Hello ${name},\n\nThanks for applying. We are reviewing your application and will get back within 24 business hours.\n\nBest regards,\nLAVA Team`,
  };
}

export default function DashboardJobApplications() {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const { data, isLoading } = useQuery<JobApplication[]>({
    queryKey: ["job-applications"],
    queryFn: () => fetchJobApplications({ ordering: "-created_at" }),
  });

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replySubject, setReplySubject] = useState<string>("");
  const [replyBody, setReplyBody] = useState<string>("");

  const filtered = useMemo(() => {
    const list = data || [];
    return list.filter((app) => {
      if (statusFilter && app.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return app.full_name?.toLowerCase().includes(q) || app.email?.toLowerCase().includes(q) || app.job_title?.toLowerCase().includes(q);
    });
  }, [data, statusFilter, search]);

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateJobApplication(id, { status }),
    onSuccess: () => {
      toast.success(t("تم تحديث الحالة", "Status updated"));
      qc.invalidateQueries({ queryKey: ["job-applications"] });
    },
    onError: () => toast.error(t("تعذر تحديث الحالة", "Failed to update status")),
  });

  const sendReply = useMutation({
    mutationFn: ({ id, subject, body }: { id: number; subject?: string; body: string }) => replyJobApplication(id, { subject, body }),
    onSuccess: () => {
      toast.success(t("تم إرسال الرد", "Reply sent"));
      setReplyingId(null);
      setReplySubject("");
      setReplyBody("");
      qc.invalidateQueries({ queryKey: ["job-applications"] });
    },
    onError: () => toast.error(t("تعذر إرسال الرد", "Failed to send reply")),
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-secondary/60">{t("طلبات التوظيف الواردة", "Incoming job applications")}</p>
            <h1 className="text-3xl font-bold text-secondary">{t("طلبات التوظيف", "Job applications")}</h1>
          </div>
          <div className="text-sm text-secondary/60">{t("الإجمالي:", "Total:")} {filtered.length}</div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("بحث بالاسم أو البريد أو الوظيفة", "Search by name, email, or role")}
            className="flex-1 min-w-[240px] border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          >
            <option value="">{t("كل الحالات", "All statuses")}</option>
            <option value="new">{t("جديد", "New")}</option>
            <option value="review">{t("قيد المراجعة", "In review")}</option>
            <option value="interview">{t("مقابلة", "Interview")}</option>
            <option value="hired">{t("تم التعيين", "Hired")}</option>
            <option value="rejected">{t("مرفوض", "Rejected")}</option>
          </select>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : filtered.length ? (
            <div className="space-y-3">
              {filtered.map((app) => (
                <div key={app.id} className="border border-accent/30 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-secondary dark:text-neutral-100">{app.full_name}</div>
                      <div className="text-sm text-secondary/70 dark:text-neutral-300">{app.email} {app.phone ? `· ${app.phone}` : ""}</div>
                      <div className="text-xs text-secondary/60 dark:text-neutral-400">{app.job_title || `#${app.job}`}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status || "new"}
                        onChange={(e) => updateStatus.mutate({ id: app.id, status: e.target.value })}
                        className="border rounded-lg px-3 py-1 bg-white dark:bg-neutral-900 dark:border-neutral-700 text-sm"
                      >
                        {Object.entries(statusLabels[isAr ? "ar" : "en"]).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700 text-xs"
                        >
                          {t("السيرة الذاتية", "Resume")}
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {app.cover_letter ? (
                    <p className="text-sm text-secondary/80 dark:text-neutral-200 whitespace-pre-wrap">{app.cover_letter}</p>
                  ) : null}

                  {replyingId === app.id ? (
                    <div className="space-y-2">
                      <input
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                        placeholder={t("عنوان الرسالة", "Subject")}
                      />
                      <textarea
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700 min-h-[140px]"
                        placeholder={t("نص الرد", "Reply message")}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => sendReply.mutate({ id: app.id, subject: replySubject, body: replyBody })}
                          className="px-4 py-2 rounded bg-primary text-white"
                          disabled={!replyBody}
                        >
                          {t("إرسال الرد", "Send reply")}
                        </button>
                        <button
                          onClick={() => {
                            setReplyingId(null);
                            setReplySubject("");
                            setReplyBody("");
                          }}
                          className="px-4 py-2 rounded border"
                        >
                          {t("إلغاء", "Cancel")}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button
                      onClick={() => {
                        const defaults = getDefaultReply(app.full_name, app.language);
                        setReplyingId(app.id);
                        setReplySubject(defaults.subject);
                        setReplyBody(defaults.body);
                      }}
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700"
                    >
                      {t("رد", "Reply")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-secondary/70 dark:text-neutral-300">{t("لا توجد طلبات توظيف حالياً.", "No applications yet.")}</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
