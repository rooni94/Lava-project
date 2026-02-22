import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout/Layout";
import MetaHead from "../components/MetaHead";
import SectionTitle from "../components/ui/SectionTitle";
import Skeleton from "../components/ui/Skeleton";
import { fetchPageBySlug } from "../api/endpoints";
import { Page, Section } from "../types";

type LegalBlock = { key: string; title: string; content: string };

const ARABIC_RE = /[\u0600-\u06FF]/;
const LATIN_RE = /[A-Za-z]/;

const fallback = {
  ar: {
    pageTitle: "سياسة الخصوصية",
    pageDescription: "توضح هذه الصفحة كيفية جمع البيانات واستخدامها وحمايتها في موقع LAVA.",
    blocks: [
      {
        key: "privacy-main",
        title: "سياسة الخصوصية",
        content:
          "<p><strong>تاريخ النفاذ:</strong> 22 فبراير 2026</p><h2>1. مقدمة</h2><p>نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية أثناء استخدام موقع وخدمات LAVA.</p><h2>2. البيانات التي نجمعها</h2><ul><li>الاسم والبريد الإلكتروني ورقم الهاتف.</li><li>بيانات الاستخدام مثل الصفحات التي تزورها ومدة الجلسة.</li><li>البيانات التقنية مثل نوع الجهاز والمتصفح.</li></ul><h2>3. استخدام البيانات</h2><ul><li>تنفيذ الطلبات والرد على الاستفسارات.</li><li>تحسين جودة الخدمة وتجربة المستخدم.</li><li>إرسال تحديثات تشغيلية متعلقة بطلبك.</li></ul><h2>4. مشاركة البيانات</h2><p>لا نبيع بياناتك. قد نشارك بيانات محدودة مع مزودي خدمة موثوقين عند الحاجة التشغيلية أو عند وجود التزام نظامي.</p><h2>5. الحماية</h2><p>نطبق ضوابط أمنية إدارية وتقنية لحماية المعلومات من الوصول غير المصرح به.</p><h2>6. حقوقك</h2><ul><li>طلب الوصول إلى بياناتك.</li><li>طلب تصحيح أو تحديث البيانات.</li><li>طلب حذف البيانات عندما يسمح النظام بذلك.</li></ul><h2>7. التواصل</h2><p>للاستفسارات المتعلقة بالخصوصية: privacy@lava.sa</p>",
      },
    ],
  },
  en: {
    pageTitle: "Privacy Policy",
    pageDescription: "This page explains how LAVA collects, uses, and protects personal data.",
    blocks: [
      {
        key: "privacy-main",
        title: "Privacy Policy",
        content:
          "<p><strong>Effective date:</strong> February 22, 2026</p><h2>1. Introduction</h2><p>We respect your privacy and are committed to protecting your personal data when you use LAVA services.</p><h2>2. Data we collect</h2><ul><li>Name, email address, and phone number.</li><li>Usage data such as visited pages and session duration.</li><li>Technical data like device and browser information.</li></ul><h2>3. How we use data</h2><ul><li>Deliver requested services and respond to inquiries.</li><li>Improve service quality and user experience.</li><li>Send operational updates related to your request.</li></ul><h2>4. Data sharing</h2><p>We do not sell personal data. Limited sharing may happen with trusted service providers when operationally required or legally necessary.</p><h2>5. Security</h2><p>We apply reasonable administrative and technical safeguards to protect data.</p><h2>6. Your rights</h2><ul><li>Request access to your personal data.</li><li>Request correction of inaccurate data.</li><li>Request deletion where legally applicable.</li></ul><h2>7. Contact</h2><p>For privacy requests: privacy@lava.sa</p>",
      },
    ],
  },
} as const;

const getExtraString = (section: Section, key: string) => {
  const extra = (section.extra || {}) as Record<string, unknown>;
  const raw = extra[key];
  return typeof raw === "string" ? raw : "";
};

function normalizeBlocks(page: Page | null, isAr: boolean): LegalBlock[] {
  const sections = [...(page?.sections || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  const blocks = sections
    .map((section) => {
      const titleEn = getExtraString(section, "title_en");
      const contentEn = getExtraString(section, "content_en");

      if (isAr) {
        const combined = `${section.title || ""} ${section.content || ""}`;
        const hasArabic = ARABIC_RE.test(combined);
        const hasLatin = LATIN_RE.test(combined);
        if (!hasArabic && (titleEn || contentEn || hasLatin)) return null;
        if (!section.content?.trim()) return null;
        return {
          key: `sec-${section.id}`,
          title: section.title,
          content: section.content,
        };
      }

      const title = titleEn || (LATIN_RE.test(section.title || "") ? section.title : "");
      const content = contentEn || (LATIN_RE.test(section.content || "") ? section.content : "");
      if (!content.trim()) return null;
      return {
        key: `sec-${section.id}`,
        title: title || "Privacy policy",
        content,
      };
    })
    .filter((item): item is LegalBlock => Boolean(item));

  if (blocks.length) return blocks;
  return isAr ? [...fallback.ar.blocks] : [...fallback.en.blocks];
}

export default function PrivacyPolicy() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data: page, isLoading } = useQuery<Page | null>({
    queryKey: ["page", "privacy-policy"],
    queryFn: async () => {
      try {
        return await fetchPageBySlug("privacy-policy");
      } catch {
        return null;
      }
    },
  });

  const blocks = useMemo(() => normalizeBlocks(page, isAr), [page, isAr]);
  const fallbackMeta = isAr ? fallback.ar : fallback.en;
  const title = page?.title || fallbackMeta.pageTitle;
  const description = page?.meta_description || fallbackMeta.pageDescription;

  return (
    <Layout>
      <MetaHead title={title} description={description} />

      <section className="py-14 container mx-auto px-4 text-secondary dark:text-neutral-100 space-y-8">
        <SectionTitle title={title} subtitle={description} align="start" />

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-5">
            {blocks.map((block) => (
              <article key={block.key} className="neo-panel p-5 md:p-6">
                {block.title ? <h2 className="theme-h3 font-semibold text-secondary dark:text-neutral-50 mb-3">{block.title}</h2> : null}
                <div className="prose prose-neutral dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: block.content }} />
              </article>
            ))}
          </div>
        )}

        <p className="text-xs text-secondary/60 dark:text-neutral-400">
          {isAr ? "آخر تحديث:" : "Last updated:"} {page?.updated_at ? new Date(page.updated_at).toLocaleDateString(isAr ? "ar-SA" : "en-US") : "-"}
        </p>
      </section>
    </Layout>
  );
}
