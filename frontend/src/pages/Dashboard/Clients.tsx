import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  bulkClientDelete,
  createClient,
  createTestimonial,
  deleteClient,
  deleteTestimonial,
  fetchClients,
  updateClient,
  updateTestimonial,
} from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import { Client } from "../../types";

export default function DashboardClients() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Client[]>({ queryKey: ["clients-admin"], queryFn: fetchClients });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [testimonialAr, setTestimonialAr] = useState("");
  const [testimonialEn, setTestimonialEn] = useState("");
  const [testimonialId, setTestimonialId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name, rating };
      let clientId = editingId;

      if (editingId) {
        await updateClient(editingId, payload);
      } else {
        const created = await createClient(payload);
        clientId = created?.data?.id;
      }

      if (!clientId) throw new Error("Unable to resolve client id");

      const quoteAr = testimonialAr.trim();
      const quoteEn = testimonialEn.trim();

      if (quoteAr || quoteEn) {
        const testimonialPayload = {
          client: clientId,
          quote: quoteAr || quoteEn,
          quote_en: quoteEn,
          rating,
          is_featured: true,
        };

        if (testimonialId) {
          await updateTestimonial(testimonialId, testimonialPayload);
        } else {
          await createTestimonial(testimonialPayload);
        }
      } else if (testimonialId) {
        await deleteTestimonial(testimonialId);
      }
    },
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث العميل", "Client updated") : t("تم إضافة العميل", "Client added"));
      setName("");
      setRating(5);
      setTestimonialAr("");
      setTestimonialEn("");
      setTestimonialId(null);
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["clients-admin"] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => toast.error(t("تعذر حفظ العميل", "Unable to save client")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteClient(id),
    onSuccess: () => {
      toast.success(t("تم حذف العميل", "Client deleted"));
      qc.invalidateQueries({ queryKey: ["clients-admin"] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => toast.error(t("تعذر حذف العميل", "Unable to delete client")),
  });

  const bulkDelete = useMutation({
    mutationFn: () => bulkClientDelete(selected),
    onSuccess: () => {
      toast.success(t("تم حذف العملاء المحددين", "Selected clients deleted"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["clients-admin"] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => toast.error(t("تعذر الحذف الجماعي", "Bulk delete failed")),
  });

  const startEditSelected = () => {
    if (selected.length !== 1) return;
    const client = data?.find((c) => c.id === selected[0]);
    if (client) {
      const testimonial = client.testimonials?.find((item) => item.is_featured) || client.testimonials?.[0];
      setEditingId(client.id);
      setName(client.name);
      setRating(testimonial?.rating ?? client.rating ?? 5);
      setTestimonialId(testimonial?.id ?? null);
      setTestimonialAr(testimonial?.quote || client.testimonial || "");
      setTestimonialEn(testimonial?.quote_en || client.testimonial_en || "");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("العملاء", "Clients")}</h1>

        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <h2 className="font-semibold text-secondary dark:text-neutral-50">
            {editingId ? t("تعديل العميل", "Edit client") : t("إضافة عميل", "Add client")}
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("اسم العميل", "Client name")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder={t("التقييم (1-5)", "Rating (1-5)")}
              className="border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <button onClick={() => save.mutate()} className="bg-primary text-white rounded-lg px-4 py-2" disabled={!name}>
              {editingId ? t("حفظ التعديلات", "Save changes") : t("إضافة عميل", "Add client")}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <textarea
              value={testimonialAr}
              onChange={(e) => setTestimonialAr(e.target.value)}
              placeholder={t("شهادة العميل (عربي)", "Client testimonial (Arabic)")}
              className="border rounded-lg px-3 py-2 min-h-[96px] bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
            <textarea
              value={testimonialEn}
              onChange={(e) => setTestimonialEn(e.target.value)}
              placeholder={t("شهادة العميل (English)", "Client testimonial (English)")}
              className="border rounded-lg px-3 py-2 min-h-[96px] bg-white dark:bg-neutral-900 dark:border-neutral-700"
            />
          </div>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setName("");
                setRating(5);
                setTestimonialAr("");
                setTestimonialEn("");
                setTestimonialId(null);
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
              <button
                disabled={selected.length !== 1}
                onClick={startEditSelected}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-60"
              >
                {t("تعديل", "Edit")}
              </button>
              {selected.length > 0 && (
                <button onClick={() => bulkDelete.mutate()} className="text-sm text-red-600 underline">
                  {t("حذف المحدد", "Delete selected")} ({selected.length})
                </button>
              )}
            </div>
            <h2 className="font-semibold text-secondary dark:text-neutral-50">{t("قائمة العملاء", "Client list")}</h2>
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
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("التقييم", "Rating")}</th>
                    <th className={`p-2 ${isAr ? "text-right" : "text-left"}`}>{t("الإجراءات", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((client) => (
                    <tr key={client.id} className="border-t border-accent/20 dark:border-neutral-800">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(client.id)}
                          onChange={(e) =>
                            setSelected((prev) => (e.target.checked ? [...prev, client.id] : prev.filter((id) => id !== client.id)))
                          }
                        />
                      </td>
                      <td className="p-2">{client.name}</td>
                      <td className="p-2">{client.rating ?? "-"}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => {
                            const testimonial = client.testimonials?.find((item) => item.is_featured) || client.testimonials?.[0];
                            setEditingId(client.id);
                            setName(client.name);
                            setRating(testimonial?.rating ?? client.rating ?? 5);
                            setTestimonialId(testimonial?.id ?? null);
                            setTestimonialAr(testimonial?.quote || client.testimonial || "");
                            setTestimonialEn(testimonial?.quote_en || client.testimonial_en || "");
                          }}
                          className="text-blue-600 dark:text-blue-400 text-sm"
                        >
                          {t("تعديل", "Edit")}
                        </button>
                        <button onClick={() => remove.mutate(client.id)} className="text-red-600 dark:text-red-400 text-sm underline">
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
