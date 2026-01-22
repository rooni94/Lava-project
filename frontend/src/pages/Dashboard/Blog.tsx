import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { bulkBlog, createBlogPost, deleteBlogPost, fetchBlogPosts, updateBlogPost } from "../../api/endpoints";
import Skeleton from "../../components/ui/Skeleton";
import RichEditor from "../../components/dashboard/RichEditor";
import { BlogPost } from "../../types";

export default function DashboardBlog() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<BlogPost[]>({ queryKey: ["blog-admin"], queryFn: fetchBlogPosts });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const save = useMutation({
    mutationFn: () =>
      editingId ? updateBlogPost(editingId, { title, excerpt, content }) : createBlogPost({ title, excerpt, content, is_published: true }),
    onSuccess: () => {
      toast.success(editingId ? t("تم تحديث المقال", "Post updated") : t("تم إضافة مقال جديد", "Post created"));
      setTitle("");
      setExcerpt("");
      setContent("");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["blog-admin"] });
    },
    onError: () => toast.error(t("تعذر الحفظ، حاول مرة أخرى", "Unable to save the post")),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteBlogPost(id),
    onSuccess: () => {
      toast.success(t("تم حذف المقال", "Post deleted"));
      qc.invalidateQueries({ queryKey: ["blog-admin"] });
    },
    onError: () => toast.error(t("تعذر الحذف", "Unable to delete the post")),
  });

  const bulkMutate = useMutation({
    mutationFn: (action: "publish" | "delete") => bulkBlog(action, selected),
    onSuccess: () => {
      toast.success(t("تم تنفيذ الإجراء على العناصر المحددة", "Action applied to selected posts"));
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["blog-admin"] });
    },
    onError: () => toast.error(t("فشل الإجراء الجماعي", "Bulk action failed")),
  });

  const startEditSelected = () => {
    if (selected.length !== 1) return;
    const post = data?.find((p) => p.id === selected[0]);
    if (post) {
      setEditingId(post.id);
      setTitle(post.title);
      setExcerpt(post.excerpt || "");
      setContent(post.content || "");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4 text-secondary dark:text-neutral-100">
        <h1 className="text-2xl font-bold text-secondary dark:text-neutral-50">{t("المدونة", "Blog")}</h1>
        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-3 shadow-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("عنوان المقال", "Post title")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder={t("ملخص قصير", "Short excerpt")}
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
          />
          <RichEditor value={content} onChange={setContent} placeholder={t("محتوى المقال", "Post content")} />
          <button onClick={() => save.mutate()} className="bg-primary text-white px-4 py-2 rounded-lg" disabled={!title || !content}>
            {editingId ? t("حفظ التعديلات", "Save changes") : t("نشر مقال", "Publish post")}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setExcerpt("");
                setContent("");
              }}
              className="text-sm text-secondary dark:text-neutral-300 underline"
            >
              {t("إلغاء التعديل", "Cancel editing")}
            </button>
          )}
        </div>
        <div className="bg-white dark:bg-neutral-900 border rounded-xl border-accent/30 dark:border-neutral-800 p-4 space-y-2 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            <button
              disabled={selected.length !== 1}
              onClick={startEditSelected}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-60"
            >
              {t("تعديل", "Edit")}
            </button>
            <button
              disabled={!selected.length}
              onClick={() => bulkMutate.mutate("publish")}
              className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-60"
            >
              {t("نشر", "Publish")}
            </button>
            <button
              disabled={!selected.length}
              onClick={() => bulkMutate.mutate("delete")}
              className="px-3 py-1 bg-red-100 text-red-700 rounded disabled:opacity-60"
            >
              {t("حذف", "Delete")}
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-3 text-secondary dark:text-neutral-50">{t("قائمة المقالات", "Post list")}</h2>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="space-y-2">
              {data?.map((post) => (
                <label key={post.id} className="flex items-center justify-between border-b border-accent/20 dark:border-neutral-800 py-2 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(post.id)}
                      onChange={(e) =>
                        setSelected((prev) => (e.target.checked ? [...prev, post.id] : prev.filter((id) => id !== post.id)))
                      }
                    />
                    <div>
                      <p className="font-bold text-secondary dark:text-neutral-50">{post.title}</p>
                      <p className="text-sm text-secondary/70 dark:text-neutral-300 line-clamp-1">{post.excerpt}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(post.id);
                        setTitle(post.title);
                        setExcerpt(post.excerpt || "");
                        setContent(post.content || "");
                      }}
                      className="text-blue-600 dark:text-blue-400 text-sm"
                    >
                      {t("تعديل", "Edit")}
                    </button>
                    <button onClick={() => remove.mutate(post.id)} className="text-red-600 dark:text-red-400 text-sm">
                      {t("حذف", "Delete")}
                    </button>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
