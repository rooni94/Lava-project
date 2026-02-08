import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Skeleton from "../../components/ui/Skeleton";
import { deleteMessage, fetchMessages, replyMessage, updateMessage } from "../../api/endpoints";
import { ContactMessage } from "../../types";

const statusLabels = {
  ar: {
    new: "جديدة",
    replied: "تم الرد",
    resolved: "مغلقة",
  },
  en: {
    new: "New",
    replied: "Replied",
    resolved: "Closed",
  },
};

const serviceLabels = {
  ar: {
    web: "ويب",
    mobile: "جوال",
    erp: "ERP/CRM",
    other: "أخرى",
  },
  en: {
    web: "Web",
    mobile: "Mobile",
    erp: "ERP/CRM",
    other: "Other",
  },
};

const topicLabels = {
  ar: {
    sales: "طلبات الباقات والخدمات",
    support: "دعم فني ومشاكل",
    general: "رسائل عامة",
  },
  en: {
    sales: "Sales & packages",
    support: "Support & issues",
    general: "General",
  },
};

function getDefaultReply(msg: ContactMessage) {
  const lang = msg.language === "ar" ? "ar" : "en";
  if (lang === "ar") {
    return {
      subject: "رد على رسالتك - LAVA",
      body: `مرحباً ${msg.name}،\n\nشكرًا لتواصلك معنا. يسعدنا مساعدتك، وسنكون معك خطوة بخطوة.\n\nتحياتنا،\nفريق LAVA`,
    };
  }
  return {
    subject: "Re: Your message - LAVA",
    body: `Hello ${msg.name},\n\nThanks for reaching out. We're happy to help and will guide you step-by-step.\n\nBest regards,\nLAVA Team`,
  };
}

export default function DashboardMessages() {
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") || "";
  const normalizedTopic =
    topicParam && ["sales", "support", "general", "all"].includes(topicParam) ? topicParam : "sales";

  const { data, isLoading } = useQuery<ContactMessage[]>({ queryKey: ["messages"], queryFn: () => fetchMessages() });

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [topicFilter, setTopicFilter] = useState<string>(normalizedTopic);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replySubject, setReplySubject] = useState<string>("");
  const [replyBody, setReplyBody] = useState<string>("");

  useEffect(() => {
    if (normalizedTopic !== topicFilter) {
      setTopicFilter(normalizedTopic);
    }
  }, [normalizedTopic, topicFilter]);

  const filtered = useMemo(() => {
    const list = data || [];
    return list.filter((msg) => {
      const msgTopic = msg.topic || "sales";
      if (topicFilter && topicFilter !== "all" && msgTopic !== topicFilter) return false;
      if (statusFilter && msg.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        msg.name?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q) ||
        msg.message?.toLowerCase().includes(q)
      );
    });
  }, [data, statusFilter, search, topicFilter]);

  const markStatus = useMutation({
    mutationFn: ({ id, status, is_handled }: { id: number; status?: string; is_handled?: boolean }) =>
      updateMessage(id, { status, ...(typeof is_handled === "boolean" ? { is_handled } : {}) }),
    onSuccess: () => {
      toast.success(t("تم تحديث الرسالة", "Message updated"));
      qc.invalidateQueries({ queryKey: ["messages"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: () => toast.error(t("تعذر التحديث", "Update failed")),
  });

  const sendReply = useMutation({
    mutationFn: ({ id, subject, body }: { id: number; subject?: string; body: string }) => replyMessage(id, { subject, body }),
    onSuccess: () => {
      toast.success(t("تم إرسال الرد", "Reply sent"));
      setReplyingId(null);
      setReplySubject("");
      setReplyBody("");
      qc.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => toast.error(t("تعذر إرسال الرد", "Failed to send reply")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteMessage(id),
    onSuccess: () => {
      toast.success(t("تم حذف الرسالة", "Message deleted"));
      qc.invalidateQueries({ queryKey: ["messages"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Delete failed")),
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-secondary/60">{t("استعراض طلبات التواصل الواردة", "Review incoming contact requests")}</p>
            <h1 className="text-3xl font-bold text-secondary">{t("رسائل التواصل", "Contact messages")}</h1>
          </div>
          <div className="text-sm text-secondary/60">{t("الإجمالي:", "Total:")} {filtered.length}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["sales", "support", "general", "all"] as const).map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setTopicFilter(topic);
                setSearchParams(topic === "sales" ? { topic: "sales" } : { topic });
              }}
              className={`px-3 py-1.5 rounded-full text-sm ${topicFilter === topic ? "bg-primary text-white" : "border border-accent/50 dark:border-neutral-700"}`}
            >
              {topic === "all"
                ? t("كل الرسائل", "All messages")
                : isAr
                  ? topicLabels.ar[topic]
                  : topicLabels.en[topic]}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("بحث بالاسم أو البريد أو الرسالة", "Search by name, email, or message")}
            className="flex-1 min-w-[240px] border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          >
            <option value="">{t("كل الحالات", "All statuses")}</option>
            <option value="new">{t("جديدة", "New")}</option>
            <option value="replied">{t("تم الرد", "Replied")}</option>
            <option value="resolved">{t("مغلقة", "Closed")}</option>
          </select>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : filtered.length ? (
            <div className="space-y-3">
              {filtered.map((msg) => {
                const msgTopic = msg.topic || "sales";
                const topicText = isAr
                  ? topicLabels.ar[msgTopic as keyof typeof topicLabels.ar]
                  : topicLabels.en[msgTopic as keyof typeof topicLabels.en];
                return (
                  <div key={msg.id} className="border border-accent/30 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-secondary dark:text-neutral-100">{msg.name}</div>
                        <div className="text-sm text-secondary/70 dark:text-neutral-300">{msg.email} {msg.phone ? `· ${msg.phone}` : ""}</div>
                        <div className="text-xs text-secondary/60 dark:text-neutral-400">
                          {msg.service_type ? (isAr ? serviceLabels.ar[msg.service_type as keyof typeof serviceLabels.ar] : serviceLabels.en[msg.service_type as keyof typeof serviceLabels.en]) : t("غير محدد", "Unspecified")}
                          {topicText ? ` · ${topicText}` : ""}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs bg-surface dark:bg-neutral-800 border border-accent/40 dark:border-neutral-700">
                          {msg.status ? (isAr ? statusLabels.ar[msg.status as keyof typeof statusLabels.ar] : statusLabels.en[msg.status as keyof typeof statusLabels.en]) : t("جديدة", "New")}
                        </span>
                        {msg.is_handled ? (
                          <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">{t("تمت المعالجة", "Handled")}</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">{t("غير معالج", "Unassigned")}</span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-secondary/80 dark:text-neutral-200 whitespace-pre-wrap">{msg.message}</p>

                    {replyingId === msg.id ? (
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
                            onClick={() => sendReply.mutate({ id: msg.id, subject: replySubject, body: replyBody })}
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
                          const defaults = getDefaultReply(msg);
                          setReplyingId(msg.id);
                          setReplySubject(defaults.subject);
                          setReplyBody(defaults.body);
                        }}
                        className="px-3 py-1 rounded bg-blue-100 text-blue-700"
                      >
                        {t("رد", "Reply")}
                      </button>
                      <button
                        onClick={() => markStatus.mutate({ id: msg.id, status: "replied", is_handled: true })}
                        className="px-3 py-1 rounded bg-indigo-100 text-indigo-700"
                      >
                        {t("تم الرد", "Mark replied")}
                      </button>
                      <button
                        onClick={() => markStatus.mutate({ id: msg.id, status: "resolved", is_handled: true })}
                        className="px-3 py-1 rounded bg-green-100 text-green-700"
                      >
                        {t("إغلاق", "Close")}
                      </button>
                      {!msg.is_handled ? (
                        <button
                          onClick={() => markStatus.mutate({ id: msg.id, is_handled: true })}
                          className="px-3 py-1 rounded bg-yellow-100 text-yellow-700"
                        >
                          {t("وضع كمُعالج", "Mark handled")}
                        </button>
                      ) : null}
                      <button
                        onClick={() => {
                          if (window.confirm(t("حذف الرسالة؟", "Delete this message?"))) remove.mutate(msg.id);
                        }}
                        className="px-3 py-1 rounded bg-red-100 text-red-700"
                      >
                        {t("حذف", "Delete")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-secondary/70 dark:text-neutral-300">{t("لا توجد رسائل حالياً.", "No messages yet.")}</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
