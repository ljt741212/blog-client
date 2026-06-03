import { getArticles, getSeoSettings } from '@/lib/api';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const [seo, articlesRes] = await Promise.all([
    getSeoSettings(),
    getArticles({ current: 1, pageSize: 20 }),
  ]);

  const siteTitle = escapeXml(seo?.title || '我的博客');
  const siteDesc = escapeXml(seo?.description || '个人技术博客');
  const siteUrl = seo?.canonicalUrl
    ? escapeXml(seo.canonicalUrl.replace(/\/+$/, ''))
    : 'http://localhost:3000';

  const items = (articlesRes.items ?? []).map(article => {
    const pubDate = article.publishTime
      ? new Date(article.publishTime).toUTCString()
      : new Date(article.createdAt).toUTCString();
    return `<item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/articles/${article.id}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${article.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.summary || article.title)}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteTitle}</title>
    <link>${siteUrl}</link>
    <description>${siteDesc}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
