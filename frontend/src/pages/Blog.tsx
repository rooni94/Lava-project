import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SectionTitle from "../components/ui/SectionTitle";
import MetaHead from "../components/MetaHead";
import { fetchBlogPosts } from "../api/endpoints";
import Skeleton from "../components/ui/Skeleton";

export default function BlogPage() {
  const { data, isLoading } = useQuery({ queryKey: ["blog-list"], queryFn: fetchBlogPosts });
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const tagList = useMemo(() => {
    const tags = new Set<string>();
    (data || []).forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
    return [isAr ? "الكل" : "All", ...Array.from(tags).slice(0, 8)];
  }, [data, isAr]);

  const [activeTag, setActiveTag] = useState<string>(isAr ? "الكل" : "All");

  const filtered = useMemo(() => {
    const allLabel = isAr ? "الكل" : "All";
    if (!data) return [];
    if (activeTag === allLabel) return data;
    return data.filter((post) => post.tags?.includes(activeTag));
  }, [data, activeTag, isAr]);

  return (
    <Layout>
      <MetaHead
        title={isAr ? "مدونة LAVA" : "Blog | LAVA"}
        description={
          isAr
            ? "رؤى عملية في البرمجة، التصميم، والتسويق الرقمي."
            : "Practical insights on software delivery, design systems, and digital growth."
        }
      />

      <section className="py-14 container mx-auto px-4 space-y-8 text-secondary dark:text-neutral-100">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-panel p-6 md:p-10"
        >
          <SectionTitle
            title={isAr ? "المقالات والرؤى" : "Insights and notes"}
            subtitle={
              isAr
                ? "نكتب عن بناء المنتجات الرقمية، تسويق الأداء، وتجارب العمل المتكامل بين التقنية والإبداع."
                : "Thoughts from real projects across engineering, growth marketing, and brand execution."
            }
          />
          <div className="flex flex-wrap gap-2 justify-center">
            {tagList.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-full border text-sm transition ${
                  activeTag === tag
                    ? "bg-primary text-white border-primary"
                    : "border-accent/50 dark:border-neutral-700 hover:border-primary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article key={post.id} className="neo-panel p-5 space-y-3 hover:-translate-y-1 transition-transform">
                <p className="text-xs uppercase tracking-[0.14em] text-secondary/60 dark:text-neutral-400">
                  {(post.published_at || post.created_at) &&
                    new Date(post.published_at || post.created_at!).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                </p>
                <h3 className="text-xl font-bold text-secondary dark:text-neutral-50 line-clamp-2 leading-snug">{post.title}</h3>
                <p className="text-sm text-secondary/80 dark:text-neutral-300 line-clamp-3 leading-7">{post.excerpt}</p>

                {post.tags && post.tags.length ? (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full border border-accent/50 dark:border-neutral-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <Link to={`/blog/${post.slug}`} className="inline-flex text-primary text-sm font-semibold hover:underline">
                  {isAr ? "اقرأ المقال" : "Read article"}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
