import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { bulkTeamDelete, createTeam, deleteTeam, fetchTeam, updateTeam } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import { TeamMember } from "../../types";

export default function DashboardTeam() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<TeamMember[]>({ queryKey: ["team-admin"], queryFn: fetchTeam });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const save = useMutation({
    mutationFn: () => (editingId ? updateTeam(editingId, { name, position }) : createTeam({ name, position })),
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث العضو", "Member updated") : t("تم إضافة عضو جديد", "Member added"));
      setName("");
      setPosition("");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["team-admin"] });
    },
    onError: () => toast.error(t("تعذر الحفظ", "Unable to save member")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteTeam(id),
    onSuccess: () => {
      toast.success(t("تم حذف العضو", "Member deleted"));
      qc.invalidateQueries({ queryKey: ["team-admin"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete member")),
  });

  const bulkDelete = useMutation({
    mutationFn: () => bulkTeamDelete(selected),
    onSuccess: () => {
      toast.success(t("تم حذف الأعضاء المحددين", "Selected members deleted"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["team-admin"] });
    },
    onError: () => toast.error(t("تعذر الحذف الجماعي", "Bulk delete failed")),
  });

  const startEdit = () => {
    if (selected.length !== 1) return;
    const item = data?.find((m) => m.id === selected[0]);
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setPosition(item.position);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("الفريق", "Team")}</h1>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <div className="grid md:grid-cols-3 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("الاسم", "Name")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder={t("المسمى الوظيفي", "Role / title")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <button onClick={() => save.mutate()} className="bg-primary text-white rounded-lg px-4 py-2" disabled={!name || !position}>
              {editingId ? t("حفظ التعديلات", "Save changes") : t("إضافة عضو", "Add member")}
            </button>
          </div>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setName("");
                setPosition("");
              }}
              className="text-sm text-secondary dark:text-neutral-300 underline"
            >
              {t("إلغاء التعديل", "Cancel editing")}
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-60" disabled={selected.length !== 1} onClick={startEdit}>
                {t("تعديل", "Edit")}
              </button>
              {selected.length > 0 && (
                <button onClick={() => bulkDelete.mutate()} className="text-sm text-red-600 dark:text-red-400 underline">
                  {t("حذف المحدد", "Delete selected")} ({selected.length})
                </button>
              )}
            </div>
            <h2 className="font-semibold text-secondary dark:text-neutral-50">{t("قائمة الفريق", "Team list")}</h2>
          </div>

          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-surface dark:bg-neutral-900 text-secondary dark:text-neutral-50">
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("تحديد", "Select")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("الاسم", "Name")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("المسمى الوظيفي", "Role")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("الإجراءات", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((member) => (
                    <tr key={member.id} className="border-t border-accent/20 dark:border-neutral-800">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(member.id)}
                          onChange={(e) =>
                            setSelected((prev) => (e.target.checked ? [...prev, member.id] : prev.filter((id) => id !== member.id)))
                          }
                        />
                      </td>
                      <td className="p-2">{member.name}</td>
                      <td className="p-2">{member.position}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(member.id);
                            setName(member.name);
                            setPosition(member.position);
                          }}
                          className="text-blue-600 dark:text-blue-400 text-sm"
                        >
                          {t("تعديل", "Edit")}
                        </button>
                        <button onClick={() => remove.mutate(member.id)} className="text-red-600 dark:text-red-400 text-sm underline">
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
