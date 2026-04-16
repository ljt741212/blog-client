export interface SeoSetting {
  title: string;
  description?: string | null;
  keywords?: string | null;
  sitemapUrl?: string | null;
  robots?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  schemaMarkup?: string | null;
  metaAuthor?: string | null;
  metaViewport?: string | null;
}

export interface FriendLink {
  id?: number;
  name: string;
  url: string;
  description?: string;
}

export interface IcpInfo {
  icpNumber?: string;
  icpUrl?: string;
  websiteName?: string;
}

export interface Setting {
  seo: SeoSetting;
  links?: FriendLink[];
  icp?: IcpInfo;
}
