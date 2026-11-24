import React from 'react';
import { Mail } from 'lucide-react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SectionTitle } from '@/components/newsflash/NewsFlashPrimitives';
import { getSiteBaseUrl } from '@/lib/articlePageHelpers';

const baseUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  title: 'Terms of Service | Entrepreneur Mirror',
  description:
    'Read the Terms of Service governing editorial attribution, content rights, and readership across Entrepreneur Mirror.',
  alternates: { canonical: `${baseUrl}/terms` },
  openGraph: {
    title: 'Terms of Service | Entrepreneur Mirror',
    description:
      'Terms of Service for Entrepreneur Mirror dispatches, features, and digital properties.',
    url: `${baseUrl}/terms`,
    siteName: 'Entrepreneur Mirror',
    type: 'website',
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = 'November 2026';

  return (
    <div className="nf-container max-w-4xl py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service', href: '/terms' },
        ]}
        showBackLink
        backHref="/"
        backLabel="Front Page"
        rightBadge="Editorial Terms"
      />

      <header className="mb-10 pb-6 border-b border-[#cbd5e1]/45 flex flex-col items-start gap-3">
        <SectionTitle title="Editorial Terms" highlight />
        <h1 className="nf-font-display text-[32px] sm:text-[42px] font-bold leading-[1.14] tracking-[-0.025em] text-[#020a1c]">
          Entrepreneur Mirror Terms of Service
        </h1>
        <p className="text-[13px] text-[#657285]">
          Effective Date: <span className="font-medium text-[#020a1c]">{lastUpdated}</span>
        </p>
      </header>

      <div className="nf-article-body space-y-8">
        <section>
          <h2>01. Acceptance of Terms</h2>
          <p>
            By accessing <strong>entrepreneurmirror.com</strong> or reading publications distributed through Entrepreneur Mirror, you agree to observe these Terms of Service and applicable intellectual property laws.
          </p>
        </section>

        <section>
          <h2>02. Editorial Copyright &amp; Fair Quotation</h2>
          <p>
            All articles, interviews, imagery, and editorial design assets published on Entrepreneur Mirror remain the property of their respective authors and Entrepreneur Mirror. Excerpts quoted for commentary or news reporting must clearly attribute Entrepreneur Mirror and link to the source dispatch.
          </p>
        </section>

        <section>
          <h2>03. Informational Purpose &amp; Independence</h2>
          <div className="p-4 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/60 text-[14px]">
            <strong>Notice:</strong> Coverage across business, cryptocurrency, metaverse, real estate, and healthcare is published solely for informational journalism. Nothing on Entrepreneur Mirror constitutes personalized investment, tax, legal, or medical advice.
          </div>
        </section>

        <section>
          <h2>04. Contributor &amp; Reader Submissions</h2>
          <p>
            Story pitches, interview materials, and press releases sent to our newsroom are reviewed at editorial discretion and subject to verification for clarity and factual accuracy.
          </p>
        </section>

        <section className="p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50 border-l-4 border-l-[#cc0000]">
          <h3 className="flex items-center gap-2 text-[17px] font-bold text-[#020a1c] !mt-0">
            <Mail className="w-4 h-4 text-[#cc0000]" />
            <span>Syndication &amp; Rights Inquiries</span>
          </h3>
          <p className="!mb-0 text-[13px] font-medium text-[#020a1c]">
            Email:{' '}
            <a href="mailto:editorial@entrepreneurmirror.com">
              editorial@entrepreneurmirror.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
