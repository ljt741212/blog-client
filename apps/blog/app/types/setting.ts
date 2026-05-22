export interface SeoSetting {
  id: number;
  title: string;
  description: string | null;
  keywords: string | null;
  sitemapUrl: string | null;
  robots: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  schemaMarkup: string | null;
  metaAuthor: string | null;
  metaViewport: string | null;
  createdAt: Date;
  updatedAt: Date;
}
