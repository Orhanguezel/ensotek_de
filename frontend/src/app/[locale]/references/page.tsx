import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getReferences, getSubCategories } from '@ensotek/core/services';
import type { Reference } from '@ensotek/core/types';
import { API_BASE_URL } from '@/i18n/locale-settings';
import Layout from '@/components/layout/Layout';
import Banner from '@/components/layout/banner/Banner';
import { ReferencesGrid } from '@/components/containers/references/ReferencesGrid';
import { canonicalFor, languagesMap } from '@/seo/alternates';

// "Yurt İçi Referanslar" ana kategorisi — sektör sub_category'leri buna bağlı.
const YURTICI_CATEGORY_ID = 'aaaa5002-1111-4111-8111-aaaaaaaa5002';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Referenzen',
    description: 'Unsere Projekte und Referenzen — Kühltürme und Kühlanlagen weltweit.',
    alternates: {
      canonical: await canonicalFor(locale, '/references'),
      languages: await languagesMap('/references'),
    },
  };
}

export default async function ReferencesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('references');

  const [references, subCats] = await Promise.all([
    getReferences(API_BASE_URL, {
      locale,
      is_published: true,
      limit: 1000,
    }).catch(() => [] as Reference[]),
    getSubCategories(API_BASE_URL, {
      category_id: YURTICI_CATEGORY_ID,
      locale,
    } as never).catch(() => [] as Array<{ id: string; name: string }>),
  ]);

  const categories = (subCats as Array<{ id: string; name: string }>)
    .map((c) => ({ id: c.id, name: c.name }))
    .filter((c) => c.id && c.name);

  return (
    <Layout header={1} footer={1}>
      <Banner title={t('title')} />

      <section className="project__area pt-120 pb-120">
        <div className="container">
          {references.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <p className="text-muted">{t('noResults')}</p>
              </div>
            </div>
          ) : (
            <ReferencesGrid references={references} categories={categories} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta__area pt-100 pb-100 bg-theme-blue-dark">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 text-center text-white">
              <h2 className="text-white mb-20">{t('ctaTitle')}</h2>
              <p className="mb-40">{t('ctaSubtitle')}</p>
              <Link href="/contact" className="btn btn-primary btn-lg">
                {t('ctaButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
