import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import Skeleton from "../components/ui/Skeleton";
import { createComment, fetchBlogPost } from "../api/endpoints";
import { Comment } from "../types";
import MetaHead from "../components/MetaHead";
import { renderRiyalText } from "../utils/currency";

type CommentForm = {
  name: string;
  email: string;
  content: string;
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const qc = useQueryClient();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug || ""),
    enabled: Boolean(slug),
  });

  const { register, handleSubmit, reset } = useForm<CommentForm>();

  const commentMutation = useMutation({
    mutationFn: (values: CommentForm) =>
      createComment({
        ...values,
        post: data?.id as number,
      }),
    onSuccess: () => {
      toast.success(isAr ? "تم إرسال التعليق بنجاح." : "Comment submitted.");
      reset();
      qc.invalidateQueries({ queryKey: ["blog-post", slug] });
    },
    onError: () => toast.error(isAr ? "تعذر إرسال التعليق." : "Unable to submit the comment."),
  });

  if (isLoading || !data) {
    return (
      <Layout>
        <section className="py-14 container mx-auto px-4">
          <Skeleton className="h-64 w-full" />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <MetaHead title={data.title} description={data.excerpt} image={data.featured_image} />
      <article className="py-14 container mx-auto px-4 space-y-6 text-secondary dark:text-neutral-100">
        <header className="space-y-3">
          <p className="text-sm text-secondary/70 dark:text-neutral-300">
            {(data.published_at || data.created_at) &&
              new Date(data.published_at || data.created_at!).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
          </p>
          <h1 className="text-4xl font-bold text-secondary dark:text-neutral-50">{data.title}</h1>
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-secondary/70 dark:text-neutral-300">
              {data.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-surface dark:bg-neutral-900 border border-accent/40 dark:border-neutral-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {data.featured_image && (
            <img
              src={data.featured_image}
              alt={data.title}
              className="w-full h-72 object-cover rounded-2xl border border-accent/30 dark:border-neutral-800"
              loading="lazy"
            />
          )}
        </header>

        {data.content && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow border border-accent/30 dark:border-neutral-800 p-6 leading-8 text-secondary/80 dark:text-neutral-300 whitespace-pre-wrap">
            {renderRiyalText(data.content)}
          </div>
        )}

        <section className="bg-surface dark:bg-neutral-900 rounded-2xl border border-accent/40 dark:border-neutral-800 p-6 space-y-4">
          <SectionTitle
            title={isAr ? "التعليقات" : "Comments"}
            subtitle={isAr ? "شارك رأيك وخبرتك مع الآخرين." : "Share your perspective and experience."}
          />
          <div className="space-y-3">
            {data.comments && data.comments.length > 0 ? (
              data.comments.map((comment: Comment) => (
                <div key={comment.id} className="bg-white dark:bg-neutral-900 border border-accent/20 dark:border-neutral-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-sm text-secondary/70 dark:text-neutral-300">
                    <span className="font-semibold text-secondary dark:text-neutral-100">{comment.name}</span>
                    {comment.created_at && <span>{new Date(comment.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</span>}
                  </div>
                  <p className="text-secondary/80 dark:text-neutral-200 leading-7">{renderRiyalText(comment.content)}</p>
                </div>
              ))
            ) : (
              <p className="text-secondary/70 dark:text-neutral-300 text-sm">{isAr ? "لا توجد تعليقات بعد." : "No comments yet."}</p>
            )}
          </div>

          <form
            onSubmit={handleSubmit((values) => commentMutation.mutate(values))}
            className="grid md:grid-cols-2 gap-4 bg-white dark:bg-neutral-900 border border-accent/30 dark:border-neutral-800 rounded-xl p-4"
          >
            <div>
              <label className="block text-sm mb-1">{isAr ? "الاسم الكامل" : "Full name"}</label>
              <input {...register("name", { required: true })} className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm mb-1">{isAr ? "البريد الإلكتروني" : "Email"}</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">{isAr ? "التعليق" : "Comment"}</label>
              <textarea
                rows={4}
                {...register("content", { required: true })}
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 dark:border-neutral-700"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={commentMutation.isLoading || !data?.id}
                className="bg-primary text-white px-6 py-3 rounded-lg disabled:opacity-70"
              >
                {commentMutation.isLoading ? (isAr ? "جاري الإرسال..." : "Sending...") : isAr ? "إرسال التعليق" : "Submit comment"}
              </button>
            </div>
          </form>
        </section>
      </article>
    </Layout>
  );
}
