import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { bulkJobs, createJobOpening, deleteJobOpening, fetchJobOpenings, updateJobOpening } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import { JobOpening } from "../../types";

type Job = { id: number; title: string; department?: string; is_active: boolean };

export default function DashboardJobs() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<JobOpening[]>({ queryKey: ["jobs-admin"], queryFn: () => fetchJobOpenings() });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const save = useMutation({
    mutationFn: () => (editingId ? updateJobOpening(editingId, { title, department }) : createJobOpening({ title, department, is_active: true })),
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث الوظيفة", "Job updated") : t("تم إضافة وظيفة جديدة", "Job added"));
      setTitle("");
      setDepartment("");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["jobs-admin"] });
    },
    onError: () => toast.error(t("تعذر الحفظ", "Unable to save job")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteJobOpening(id),
    onSuccess: () => {
      toast.success(t("تم حذف الوظيفة", "Job deleted"));
      qc.invalidateQueries({ queryKey: ["jobs-admin"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete job")),
  });

  const bulk = useMutation({
    mutationFn: (action: "publish" | "delete" | "close") => bulkJobs(action, selected),
    onSuccess: () => {
      toast.success(t("تم تنفيذ الإجراء على العناصر المحددة", "Action applied to selected jobs"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["jobs-admin"] });
    },
    onError: () => toast.error(t("فشل الإجراء الجماعي", "Bulk action failed")),
  });

  const startEditSelected = () => {
    if (selected.length !== 1) return;
    const job = data?.find((j) => j.id === selected[0]);
    if (job) {
      setEditingId(job.id);
      setTitle(job.title);
      setDepartment(job.department || "");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("الوظائف", "Jobs")}</h1>
        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <div className="grid md:grid-cols-3 gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("عنوان الوظيفة", "Job title")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder={t("القسم", "Department")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <button onClick={() => save.mutate()} className="bg-primary text-white rounded-lg px-4 py-2" disabled={!title}>
              {editingId ? t("حفظ التعديلات", "Save changes") : t("إضافة وظيفة", "Add job")}
            </button>
          </div>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setDepartment("");
              }}
              className="text-sm text-secondary dark:text-neutral-300 underline"
            >
              {t("إلغاء التعديل", "Cancel editing")}
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 text-sm">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-60" disabled={selected.length !== 1} onClick={startEditSelected}>
                {t("تعديل", "Edit")}
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-60" disabled={!selected.length} onClick={() => bulk.mutate("publish")}>
                {t("تفعيل", "Activate")} ({selected.length || 0})
              </button>
              <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded disabled:opacity-60" disabled={!selected.length} onClick={() => bulk.mutate("close")}>
                {t("إيقاف", "Deactivate")} ({selected.length || 0})
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded disabled:opacity-60" disabled={!selected.length} onClick={() => bulk.mutate("delete")}>
                {t("حذف", "Delete")} ({selected.length || 0})
              </button>
            </div>
            <h2 className="font-semibold text-secondary dark:text-neutral-50">{t("قائمة الوظائف", "Jobs list")}</h2>
          </div>

          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-surface dark:bg-neutral-900 text-secondary dark:text-neutral-50">
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("تحديد", "Select")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("العنوان", "Title")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("القسم", "Department")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("الحالة", "Status")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("الإجراءات", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((job: Job) => (
                    <tr key={job.id} className="border-t border-accent/20 dark:border-neutral-800">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(job.id)}
                          onChange={(e) =>
                            setSelected((prev) => (e.target.checked ? [...prev, job.id] : prev.filter((id) => id !== job.id)))
                          }
                        />
                      </td>
                      <td className="p-2">{job.title}</td>
                      <td className="p-2">{job.department || "-"}</td>
                      <td className="p-2">{job.is_active ? t("مفعّلة", "Active") : t("مغلقة", "Closed")}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(job.id);
                            setTitle(job.title);
                            setDepartment(job.department || "");
                          }}
                          className="text-blue-600 dark:text-blue-400 text-sm"
                        >
                          {t("تعديل", "Edit")}
                        </button>
                        <button onClick={() => remove.mutate(job.id)} className="text-red-600 dark:text-red-400 text-sm underline">
                          {t("حذف", "Delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
