import React from 'react';
import { Metadata } from 'next';
import ContactClient from './ContactClient';
import { getSiteBaseUrl } from '@/lib/articlePageHelpers';

const baseUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  title: 'Contact Editorial Desk',
  description:
    'Connect with Entrepreneur Mirror editors, submit executive interviews, press releases, or reach our global business newsroom desks.',
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: 'Contact Editorial Desk | Entrepreneur Mirror',
    description:
      'Connect with Entrepreneur Mirror editors, submit executive interviews, press releases, or reach our global business newsroom desks.',
    url: `${baseUrl}/contact`,
    siteName: 'Entrepreneur Mirror',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Editorial Desk | Entrepreneur Mirror',
    description:
      'Connect with Entrepreneur Mirror editors, submit executive interviews, press releases, or reach our newsroom desks.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${baseUrl}/contact#webpage`,
      url: `${baseUrl}/contact`,
      name: 'Contact Entrepreneur Mirror Editorial Desk',
      description:
        'Connect with Entrepreneur Mirror editors, submit executive interviews, press releases, or reach our global business newsroom desks.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'Entrepreneur Mirror',
        url: baseUrl,
      },
      mainEntity: {
        '@type': 'NewsMediaOrganization',
        '@id': `${baseUrl}/#organization`,
        name: 'Entrepreneur Mirror',
        url: baseUrl,
        email: 'editorial@entrepreneurmirror.com',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}/contact#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: `${baseUrl}/contact` },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
