import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchBlogPosts } from "../api/endpoints";
import Skeleton from "../components/ui/Skeleton";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const { data, isLoading } = useQuery({ queryKey: ["blog-list"], queryFn: fetchBlogPosts });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <Layout>
      <MetaHead
        title={isAr ? "مدونة لافا" : "Blog | LAVA"}
        description={
          isAr
            ? "أفكار ونصائح حول بناء المنتجات الرقمية وتقنيات الويب."
            : "Ideas and lessons about building digital products and the tech that powers them."
        }
      />
      <section className="py-14 container mx-auto px-4 space-y-6 text-secondary dark:text-neutral-100">
        <SectionTitle
          title={isAr ? "آخر المقالات" : "Latest articles"}
          subtitle={
            isAr ? "نشارك خبرتنا في التقنية، التصميم، ونمو الأعمال." : "We share learnings on technology, design, and product growth."
          }
        />
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {data?.map((post) => (
              <article key={post.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-accent/30 dark:border-neutral-800 shadow p-5 space-y-2">
                <p className="text-xs text-secondary/70 dark:text-neutral-300">
                  {(post.published_at || post.created_at) &&
                    new Date(post.published_at || post.created_at!).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                </p>
                <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-secondary/80 dark:text-neutral-300 line-clamp-3">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="text-primary text-sm font-semibold">
                  {isAr ? "اقرأ المزيد" : "Read more"}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
