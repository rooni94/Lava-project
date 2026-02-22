import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout';
import Skeleton from '../components/ui/Skeleton';
import { fetchPageBySlug } from '../api/endpoints';
import { Page } from '../types';

export default function PrivacyPolicy() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const { data: page, isLoading } = useQuery<Page>({
    queryKey: ['page', 'privacy-policy'],
    queryFn: () => fetchPageBySlug('privacy-policy'),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">
            {isAr ? 'الصفحة غير متوفرة حالياً' : 'Page is currently unavailable'}
          </p>
        </div>
      </Layout>
    );
  }

  // Find Arabic or English content
  const arabicSection = page.sections?.find(sec => 
    sec.title.includes('سياسة') || sec.title === 'سياسة الخصوصية'
  );
  
  const englishSection = page.sections?.find(sec => 
    sec.title.includes('Policy') || sec.title === 'Privacy Policy'
  );

  const displaySection = isAr ? arabicSection : englishSection;

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-neutral-950 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary dark:text-neutral-50 mb-4">
              {page.title}
            </h1>
            {page.meta_description && (
              <p className="text-gray-600 dark:text-neutral-400 text-lg">
                {page.meta_description}
              </p>
            )}
          </div>

          {displaySection ? (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                dangerouslySetInnerHTML={{ __html: displaySection.content }} 
                className="text-secondary dark:text-neutral-300"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-neutral-500">
                {isAr ? 'لا يوجد محتوى لهذه الصفحة بعد.' : 'No content available for this page yet.'}
              </p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
            <p className="text-sm text-gray-500 dark:text-neutral-500">
              {isAr ? 'آخر تحديث:' : 'Last updated:'}{' '}
              {new Date(page.updated_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
