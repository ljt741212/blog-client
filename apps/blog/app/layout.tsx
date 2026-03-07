import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { SuspensionPanel } from './components';
import AnalyticsLoader from './components/analyticsLoader';
import NavBar from './components/navBar';
import Snowfall from './components/Snowfall';
import { getSeoSettings } from './lib/api';

import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const defaultMetadata: Metadata = {
  title: {
    default: '我的博客',
    template: '%s | 我的博客',
  },
  description: '这是我的个人博客，分享技术、生活和思考',
  keywords: ['博客', '技术', '编程', '开发'],
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const seoSettings = await getSeoSettings();

  if (!seoSettings) {
    return defaultMetadata;
  }

  const keywords = seoSettings.keywords ? seoSettings.keywords.split(',').map(k => k.trim()) : [];

  const robotsConfig = parseRobots(seoSettings.robots);

  const metadata: Metadata = {
    title: {
      default: seoSettings.title,
      template: `%s | ${seoSettings.title}`,
    },
    description: seoSettings.description || defaultMetadata.description,
    keywords: keywords.length > 0 ? keywords : defaultMetadata.keywords,
    authors: seoSettings.metaAuthor ? [{ name: seoSettings.metaAuthor }] : undefined,
    creator: seoSettings.metaAuthor,
    publisher: seoSettings.metaAuthor,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    // metadataBase: seoSettings.canonicalUrl
    //   ? new URL(seoSettings.canonicalUrl)
    //   : undefined,
    alternates: seoSettings.canonicalUrl
      ? {
          canonical: seoSettings.canonicalUrl,
        }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: seoSettings.canonicalUrl || undefined,
      title: seoSettings.ogTitle || seoSettings.title,
      description: seoSettings.ogDescription || seoSettings.description || undefined,
      siteName: seoSettings.title,
      images: seoSettings.ogImage
        ? [
            {
              url: seoSettings.ogImage,
              width: 1200,
              height: 630,
              alt: seoSettings.ogTitle || seoSettings.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoSettings.ogTitle || seoSettings.title,
      description: seoSettings.ogDescription || seoSettings.description || undefined,
      images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
    },
    robots: robotsConfig,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    // manifest: "/site.webmanifest",
  };

  return metadata;
}

function parseRobots(robots: string | null): Metadata['robots'] {
  if (!robots) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  }

  const robotsLower = robots.toLowerCase();
  const index = !robotsLower.includes('noindex');
  const follow = !robotsLower.includes('nofollow');

  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AnalyticsLoader />
        <main className="w-full min-h-screen bg-[var(--background)] overflow-x-hidden flex flex-col">
          <NavBar />
          <div className="flex-1">{children}</div>
        </main>
        <Snowfall />
        <SuspensionPanel threshold={500} qqNumber="你的QQ号" />
      </body>
    </html>
  );
}
