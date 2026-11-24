import React from 'react';
import { Mail } from 'lucide-react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SectionTitle } from '@/components/newsflash/NewsFlashPrimitives';
import { getSiteBaseUrl } from '@/lib/articlePageHelpers';

const baseUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  title: 'Privacy Policy | Entrepreneur Mirror',
  description:
    'Learn how Entrepreneur Mirror collects, protects, and handles reader data with transparent journalistic privacy standards.',
  alternates: { canonical: `${baseUrl}/privacy` },
  openGraph: {
    title: 'Privacy Policy | Entrepreneur Mirror',
    description:
      'Learn how Entrepreneur Mirror protects reader privacy and data governance.',
    url: `${baseUrl}/privacy`,
    siteName: 'Entrepreneur Mirror',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 2026';

  return (
    <div className="nf-container max-w-4xl py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy', href: '/privacy' },
        ]}
        showBackLink
        backHref="/"
        backLabel="Front Page"
        rightBadge="Governance"
      />

      <header className="mb-10 pb-6 border-b border-[#cbd5e1]/45 flex flex-col items-start gap-3">
        <SectionTitle title="Legal & Privacy" highlight />
        <h1 className="nf-font-display text-[32px] sm:text-[42px] font-bold leading-[1.14] tracking-[-0.025em] text-[#020a1c]">
          Entrepreneur Mirror Privacy Policy
        </h1>
        <p className="text-[13px] text-[#657285]">
          Effective Date: <span className="font-medium text-[#020a1c]">{lastUpdated}</span>
        </p>
      </header>

      <div className="nf-article-body space-y-8">
        <section>
          <h2>01. Commitment to Reader Privacy</h2>
          <p>
            Entrepreneur Mirror (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is an independent business and innovation publication committed to privacy-first digital journalism. This policy describes how information is handled when you visit <strong>entrepreneurmirror.com</strong> or interact with our editorial dispatches.
          </p>
        </section>

        <section>
          <h2>02. Information We Collect</h2>
          <p>
            We collect minimal information necessary to maintain reliable publishing operations:
          </p>
          <ul className="list-disc">
            <li>
              <strong>Directly Provided Information:</strong> Email addresses or pitch submissions you voluntarily enter in contact forms or newsletter sign-up boxes.
            </li>
            <li>
              <strong>Aggregated Readership Analytics:</strong> Non-personally identifiable metrics such as story views and technical browser compatibility signals.
            </li>
            <li>
              <strong>Zero Sensitive Financial Capture:</strong> Entrepreneur Mirror does not solicit sensitive payment or government identity documents from general readers.
            </li>
          </ul>
        </section>

        <section>
          <h2>03. Zero Sale of Personal Records</h2>
          <p>
            <strong>Entrepreneur Mirror will never sell, rent, or trade reader contact details or subscriber lists to commercial brokers or third-party ad networks.</strong>
          </p>
        </section>

        <section>
          <h2>04. Reader Rights &amp; Data Sovereignty</h2>
          <p>
            Readers in all jurisdictions may request access, correction, or deletion of any voluntarily submitted contact records at any time.
          </p>
        </section>

        <section className="p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50 border-l-4 border-l-[#cc0000]">
          <h3 className="flex items-center gap-2 text-[17px] font-bold text-[#020a1c] !mt-0">
            <Mail className="w-4 h-4 text-[#cc0000]" />
            <span>Data Governance Contact</span>
          </h3>
          <p className="!mb-2 text-[14px]">
            For privacy questions or data requests, contact our editorial governance desk:
          </p>
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
