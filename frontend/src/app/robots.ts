import type { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://ensotek.de';

// Auth / özel alanlar — hem genel hem AI botları için kapalı tutulur.
const disallow = [
  '/login',
  '/register',
  '/logout',
  '/*/login',
  '/*/register',
  '/*/logout',
  '/*/dashboard',
];

// AI / LLM tarayıcıları — içeriğin AI cevaplarında (ChatGPT, Claude,
// Perplexity, Gemini, AI Overviews, Apple Intelligence) görünebilmesi
// için açıkça izinli. Niyeti netleştirir; bazı botlar genel '*' kuralına
// ek olarak kendi user-agent'larını arar.
const aiBots = [
  'GPTBot', // OpenAI — training/indexing
  'OAI-SearchBot', // OpenAI — ChatGPT search
  'ChatGPT-User', // OpenAI — user-triggered fetch
  'ClaudeBot', // Anthropic — indexing
  'anthropic-ai', // Anthropic
  'Claude-Web', // Anthropic — Claude web
  'PerplexityBot', // Perplexity — indexing
  'Perplexity-User', // Perplexity — user-triggered fetch
  'Google-Extended', // Google — Gemini/Vertex grounding
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl (birçok LLM bu veriyi kullanır)
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...aiBots.map((bot) => ({ userAgent: bot, allow: '/', disallow })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
