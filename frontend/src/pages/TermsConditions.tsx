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
    pageTitle: "الشروط والأحكام",
    pageDescription: "تنظم هذه الشروط استخدامك لموقع وخدمات LAVA.",
    blocks: [
      {
        key: "terms-main",
        title: "الشروط والأحكام",
        content:
          "<p><strong>تاريخ النفاذ:</strong> 22 فبراير 2026</p><h2>1. القبول بالشروط</h2><p>باستخدامك موقع LAVA فإنك توافق على هذه الشروط والأحكام.</p><h2>2. استخدام الموقع</h2><ul><li>الاستخدام يكون للأغراض المشروعة فقط.</li><li>يمنع إساءة الاستخدام أو محاولة اختراق الأنظمة.</li></ul><h2>3. حقوق الملكية الفكرية</h2><p>جميع المحتويات والأصول الرقمية على الموقع مملوكة لـ LAVA أو مرخصة لها.</p><h2>4. الخدمات والعقود</h2><p>تفاصيل نطاق العمل والمدة والتكلفة النهائية تحدد في العروض والعقود المعتمدة.</p><h2>5. الدفع والاسترداد</h2><p>تخضع سياسة الدفع والاسترداد لما يتم الاتفاق عليه كتابيًا في العقد أو العرض المعتمد.</p><h2>6. تحديد المسؤولية</h2><p>لا تتحمل LAVA أي أضرار غير مباشرة أو تبعية خارج نطاق ما يقرره النظام والعقد.</p><h2>7. التعديلات</h2><p>قد يتم تحديث هذه الشروط من وقت لآخر، ويعد استمرار الاستخدام موافقة على النسخة المحدثة.</p><h2>8. القانون الحاكم</h2><p>تخضع هذه الشروط لأنظمة المملكة العربية السعودية.</p><h2>9. التواصل</h2><p>للاستفسارات النظامية: legal@lava.sa</p>",
      },
    ],
  },
  en: {
    pageTitle: "Terms and Conditions",
    pageDescription: "These terms govern your use of LAVA website and services.",
    blocks: [
      {
        key: "terms-main",
        title: "Terms and Conditions",
        content:
          "<p><strong>Effective date:</strong> February 22, 2026</p><h2>1. Acceptance</h2><p>By using LAVA website, you agree to these terms and conditions.</p><h2>2. Website use</h2><ul><li>You must use the website for lawful purposes only.</li><li>Abuse or unauthorized access attempts are prohibited.</li></ul><h2>3. Intellectual property</h2><p>All website content and digital assets are owned by or licensed to LAVA.</p><h2>4. Services and contracts</h2><p>Final scope, timeline, and pricing are defined in approved proposals and signed agreements.</p><h2>5. Payments and refunds</h2><p>Payment and refund terms follow what is explicitly stated in the approved proposal or contract.</p><h2>6. Limitation of liability</h2><p>LAVA is not liable for indirect or consequential damages beyond applicable law and contract terms.</p><h2>7. Modifications</h2><p>We may update these terms from time to time. Continued use means acceptance of updates.</p><h2>8. Governing law</h2><p>These terms are governed by the laws of the Kingdom of Saudi Arabia.</p><h2>9. Contact</h2><p>For legal inquiries: legal@lava.sa</p>",
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
        title: title || "Terms and conditions",
        content,
      };
    })
    .filter((item): item is LegalBlock => Boolean(item));

  if (blocks.length) return blocks;
  return isAr ? [...fallback.ar.blocks] : [...fallback.en.blocks];
}

export default function TermsConditions() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data: page, isLoading } = useQuery<Page | null>({
    queryKey: ["page", "terms-conditions"],
    queryFn: async () => {
      try {
        return await fetchPageBySlug("terms-conditions");
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
