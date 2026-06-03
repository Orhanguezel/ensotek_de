import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import LegalSidebarPage from "@/components/containers/legal/LegalSidebarPage";
import { getTranslations } from "next-intl/server";
import { canonicalFor, languagesMap } from "@/seo/alternates";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("legal_title"),
    alternates: {
      canonical: await canonicalFor(locale, `/legal/${slug}`),
      languages: await languagesMap(`/legal/${slug}`),
    },
  };
}

const LegalDetailPage = async ({ params }: Props) => {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "ensotek.legalPages" });

  return (
    <Layout header={1} footer={1}>
      <Banner title={t("sectionTitle")} />
      <LegalSidebarPage slug={slug} />
    </Layout>
  );
};

export default LegalDetailPage;
