import { API_BASE_URL } from "@/i18n/locale-settings";

// llms.txt — AI/LLM sistemlerinin (ChatGPT, Claude, Perplexity, Gemini)
// siteyi anlaması için yapılandırılmış özet. Emerging standard: llmstxt.org
// Ürün/hizmet/kütüphane listeleri backend'den dinamik çekilir.

export const revalidate = 3600;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://ensotek.de";

// İçerik linkleri İngilizce locale üzerinden (AI tüketimi için).
const LOCALE = "en";

type Item = { slug: string; title: string };

async function fetchItems(endpoint: string): Promise<Item[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${endpoint}?limit=200&is_published=true`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items: unknown[] = Array.isArray(data)
      ? data
      : Array.isArray((data as { data?: unknown[] })?.data)
        ? (data as { data: unknown[] }).data
        : [];
    return items
      .filter(
        (i): i is Record<string, unknown> =>
          typeof (i as Record<string, unknown>)?.slug === "string",
      )
      .map((i) => ({
        slug: i.slug as string,
        title:
          (i.title as string) ||
          (i.name as string) ||
          (i.slug as string),
      }));
  } catch {
    return [];
  }
}

function list(items: Item[], base: string): string {
  if (!items.length) return "- (currently being updated)";
  return items
    .map((x) => `- [${x.title}](${siteUrl}/${LOCALE}/${base}/${x.slug})`)
    .join("\n");
}

export async function GET(): Promise<Response> {
  const [products, services, library] = await Promise.all([
    fetchItems("/products"),
    fetchItems("/services"),
    fetchItems("/library"),
  ]);

  const body = `# Ensotek — Industrial Water Cooling Towers

> Ensotek is a manufacturer of industrial water cooling towers. It produces open-circuit, closed-circuit and counterflow cooling towers in FRP/GRP (fiber-reinforced polyester), engineered for corrosion resistance and long service life. Ensotek is certified to ISO 9001 (Quality), ISO 14001 (Environment), ISO 45001 (Occupational Health & Safety) and CE (EC Declaration of Conformity, Machinery Directive 2006/42/EC). Services cover design, manufacturing, installation, commissioning, maintenance/repair, modernization/retrofit and spare parts for cooling systems.

## Products
${list(products, "product")}

## Services
${list(services, "service")}

## Knowledge Base
${list(library, "library")}

## Key Pages
- [About Ensotek](${siteUrl}/${LOCALE}/about)
- [Solutions](${siteUrl}/${LOCALE}/solutions)
- [References & Projects](${siteUrl}/${LOCALE}/references)
- [Quality & Certificates](${siteUrl}/${LOCALE}/quality)
- [Contact](${siteUrl}/${LOCALE}/contact)

## Contact
- Website: ${siteUrl}
- Contact form: ${siteUrl}/${LOCALE}/contact
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
