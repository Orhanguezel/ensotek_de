import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Layout from "@/components/layout/Layout";
import ProductDetail from "@/components/containers/product/ProductDetail";
import { fetchProductBySlug } from "@/i18n/server";
import { canonicalFor, languagesMap } from "@/seo/alternates";
import JsonLd from "@/seo/JsonLd";
import { graph, product } from "@/seo/jsonld";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const item = await fetchProductBySlug(slug, locale ?? "tr");
  if (!item) return {};
  return {
    title: item.meta_title || item.title || item.name,
    description: item.meta_description || item.summary || undefined,
    alternates: {
      canonical: await canonicalFor(locale, `/product/${slug}`),
      languages: await languagesMap(`/product/${slug}`),
    },
  };
}

const ProductDetailPage = async ({ params }: Props) => {
  const { slug, locale } = await params;
  const item = await fetchProductBySlug(slug, locale ?? "tr");
  if (!item) notFound();

  const productLd = graph([
    product({
      name: item.title || item.name || slug,
      description: item.meta_description || item.summary || undefined,
      brand: "Ensotek",
    }),
  ]);

  return (
    <Layout header={1} footer={1}>
      <JsonLd data={productLd} id="product-jsonld" />
      <ProductDetail slug={slug} itemType="product" basePath="/product" />
    </Layout>
  );
};

export default ProductDetailPage;
