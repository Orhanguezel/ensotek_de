import React from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Layout from "@/components/layout/Layout";
import PageSwitch from "@/components/containers/custom-pages/PageSwitch";
import { fetchCustomPage } from "@/i18n/server";
import { canonicalFor, languagesMap } from "@/seo/alternates";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = await fetchCustomPage(slug, locale ?? "tr");
  if (!item) return {};
  return {
    title: item.meta_title || item.title,
    description: item.meta_description || item.summary || undefined,
    alternates: {
      canonical: await canonicalFor(locale, `/about/${slug}`),
      languages: await languagesMap(`/about/${slug}`),
    },
  };
}

const AboutDetailPage = async ({ params }: Props) => {
  const { slug, locale } = await params;
  const item = await fetchCustomPage(slug, locale ?? "tr");
  if (!item) notFound();

  // mission/vision tekil sayfaları, vizyon+misyonun birlikte gösterildiği
  // /mission-vision sayfasına kalıcı yönlendirilir (tek kaynak, duplicate yok).
  const moduleKey = (item as { module_key?: string }).module_key;
  if (moduleKey === "mission" || moduleKey === "vision") {
    permanentRedirect(`/${locale}/mission-vision`);
  }

  return (
    <Layout header={1} footer={1}>
      <PageSwitch slug={slug} />
    </Layout>
  );
};

export default AboutDetailPage;
