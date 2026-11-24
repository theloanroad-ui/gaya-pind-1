import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Playfair_Display, Libre_Baskerville, Inter, Oswald, Bebas_Neue } from 'next/font/google';
import './globals.css';
import './newsflash.css';
import NavigationProgress from '@/components/newsflash/NavigationProgress';
import NewsFlashHeader from '@/components/newsflash/NewsFlashHeader';
import NewsFlashFooter from '@/components/newsflash/NewsFlashFooter';
import Analytics from '@/components/Analytics';
import MainWrapper from '@/components/MainWrapper';
import FaviconManager from '@/components/FaviconManager';
import { siteConfig } from '@/data/siteConfig';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const baskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-baskerville',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const bebas = Bebas_Neue({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.entrepreneurmirror.com'),
  title: {
    default: 'Entrepreneur Mirror | Business, Technology, Interviews & World News',
    template: '%s | Entrepreneur Mirror',
  },
  description:
    'Entrepreneur Mirror is a premier global media platform covering business strategies, technology breakthroughs, executive interviews, world news, lifestyle, metaverse, and market intelligence.',
  keywords: [
    'Entrepreneur Mirror',
    'Business',
    'Technology',
    'Interview',
    'News',
    'World',
    'Lifestyle',
    'Opinion',
    'Press Release',
    'Metaverse',
    'Crypto',
    'Real Estate',
    'Career',
    'Health',
    'Biography',
    'Executive Interviews',
    'Founder Stories',
    'CEOs',
    'Digital Media',
  ],
  authors: [{ name: 'Entrepreneur Mirror Editorial Team', url: 'https://www.entrepreneurmirror.com' }],
  creator: 'Entrepreneur Mirror',
  publisher: 'Entrepreneur Mirror',
  applicationName: 'Entrepreneur Mirror',
  alternates: {
    canonical: 'https://www.entrepreneurmirror.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Entrepreneur Mirror | Business, Technology, Interviews & World News',
    description:
      'Entrepreneur Mirror is a premier global media platform covering business strategies, technology breakthroughs, executive interviews, world news, lifestyle, metaverse, and market intelligence.',
    url: 'https://www.entrepreneurmirror.com',
    siteName: 'Entrepreneur Mirror',
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'Entrepreneur Mirror | Business, Technology, Interviews & World News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Entrepreneur Mirror | Business, Technology, Interviews & World News',
    description:
      'Entrepreneur Mirror is a premier global media platform covering business strategies, technology breakthroughs, executive interviews, world news, lifestyle, metaverse, and market intelligence.',
    site: '@entrepreneurmirror',
    creator: '@entrepreneurmirror',
    images: ['/icon.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 't9na2oTjNEA-Mnwuiyo_dsyflp-do8ND3iAhF4KAMVY',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.entrepreneurmirror.com/#organization',
  name: 'Entrepreneur Mirror',
  url: 'https://www.entrepreneurmirror.com/',
  description:
    'Entrepreneur Mirror delivers executive interviews, startup innovations, emerging tech breakthroughs, and market intelligence for modern leaders and entrepreneurs.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.entrepreneurmirror.com/#website',
  url: 'https://www.entrepreneurmirror.com/',
  name: 'Entrepreneur Mirror',
  description:
    'Global Business, Technology & Leadership News covering business, interviews, technology, real estate, and emerging markets.',
  publisher: {
    '@id': 'https://www.entrepreneurmirror.com/#organization',
  },
  inLanguage: 'en',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${baskerville.variable} ${inter.variable} ${oswald.variable} ${bebas.variable}`}>
      <head>
        <meta name="google-site-verification" content="t9na2oTjNEA-Mnwuiyo_dsyflp-do8ND3iAhF4KAMVY" />
        <meta name="google-site-verification" content="google-site-verification=t9na2oTjNEA-Mnwuiyo_dsyflp-do8ND3iAhF4KAMVY" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col nf-font-sans"
        style={{ backgroundColor: 'var(--nf-bg)', color: 'var(--nf-ink)' }}
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <NewsFlashHeader />
        <MainWrapper>
          {children}
        </MainWrapper>
        <NewsFlashFooter />
        <Analytics />
        <FaviconManager />
      </body>
    </html>
  );
}
