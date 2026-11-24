import React from 'react';
import { Metadata } from 'next';
import { BookOpen, Users, ShieldCheck, TrendingUp, Award, HelpCircle, Sparkles } from 'lucide-react';
import WriteForUsForm from './WriteForUsForm';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SectionTitle } from '@/components/newsflash/NewsFlashPrimitives';
import { getSiteBaseUrl } from '@/lib/articlePageHelpers';

const baseUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  title: 'Write For Us | Contributor Guidelines | Entrepreneur Mirror',
  description:
    'Contribute founder essays, executive perspectives, industry analysis, and interview pitches to Entrepreneur Mirror.',
  alternates: { canonical: `${baseUrl}/write-for-us` },
  openGraph: {
    title: 'Write For Us | Contributor Guidelines | Entrepreneur Mirror',
    description:
      'Contribute thought leadership, executive interviews, and industry analysis to Entrepreneur Mirror.',
    url: `${baseUrl}/write-for-us`,
    siteName: 'Entrepreneur Mirror',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Write For Us | Entrepreneur Mirror',
    description:
      'Submit guest essays, executive interviews, and deep dives to Entrepreneur Mirror editors.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${baseUrl}/write-for-us#webpage`,
      url: `${baseUrl}/write-for-us`,
      name: 'Write For Us - Entrepreneur Mirror Contributor Guidelines',
      description:
        'Contribute founder essays, executive perspectives, and industry analysis to Entrepreneur Mirror.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'Entrepreneur Mirror',
        url: baseUrl,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}/write-for-us#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Write For Us', item: `${baseUrl}/write-for-us` },
      ],
    },
  ],
};

export default function WriteForUsPage() {
  return (
    <div className="nf-container py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Write For Us', href: '/write-for-us' },
        ]}
        showBackLink
        backHref="/"
        backLabel="Front Page"
        rightBadge="Contributors"
        includeJsonLd={false}
      />

      <header className="max-w-3xl mb-10 flex flex-col items-start gap-3">
        <SectionTitle title="Editorial Contributor Network" highlight />
        <h1 className="nf-font-display text-[32px] sm:text-[44px] font-bold leading-[1.12] tracking-[-0.025em] text-[#020a1c]">
          Write For Entrepreneur Mirror
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#657285]">
          Share founder insights, market intelligence, healthcare innovation, real estate analysis, and executive interviews with Entrepreneur Mirror readers worldwide.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50">
          <div className="w-10 h-10 rounded-md bg-[#cc0000]/10 text-[#cc0000] flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-[17px] font-bold text-[#020a1c] mb-2">
            Founder &amp; Executive Audience
          </h3>
          <p className="text-[13px] text-[#657285] leading-relaxed">
            Reach entrepreneurs, founders, investors, and technology leaders across global business ecosystems.
          </p>
        </div>

        <div className="p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50">
          <div className="w-10 h-10 rounded-md bg-[#cc0000]/10 text-[#cc0000] flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-[17px] font-bold text-[#020a1c] mb-2">
            Verified Author Byline
          </h3>
          <p className="text-[13px] text-[#657285] leading-relaxed">
            Every published contributor receives a verified author profile and full attribution across our archive.
          </p>
        </div>

        <div className="p-6 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50">
          <div className="w-10 h-10 rounded-md bg-[#cc0000]/10 text-[#cc0000] flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-[17px] font-bold text-[#020a1c] mb-2">
            Multi-Channel Distribution
          </h3>
          <p className="text-[13px] text-[#657285] leading-relaxed">
            Selected essays and executive interviews are spotlighted across Entrepreneur Mirror homepage features.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-4">
            <h2 className="nf-font-display text-[22px] font-bold text-[#020a1c] flex items-center gap-2 pb-3 border-b border-[#cbd5e1]/45">
              <BookOpen className="w-5 h-5 text-[#cc0000]" />
              <span>Beats &amp; Topics We Welcome</span>
            </h2>
            <p className="text-[14px] text-[#657285] leading-relaxed">
              We prioritize deeply reported, practical analysis across our 14 core editorial sections:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13px] font-medium text-[#020a1c]">
              {[
                'Business Growth & Strategy',
                'Executive Interviews & Profiles',
                'Technology & Applied AI',
                'World Markets & Policy',
                'Crypto, Web3 & Metaverse',
                'Health & Wellness Leadership',
                'Commercial & Residential Real Estate',
                'Lifestyle & Founder Careers',
              ].map((topic) => (
                <li key={topic} className="flex items-center gap-2">
                  <span className="text-[#cc0000] font-bold">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="nf-font-display text-[22px] font-bold text-[#020a1c] flex items-center gap-2 pb-3 border-b border-[#cbd5e1]/45">
              <ShieldCheck className="w-5 h-5 text-[#cc0000]" />
              <span>Editorial Standards</span>
            </h2>
            <div className="space-y-3 text-[13px] text-[#657285] leading-relaxed">
              <div className="p-4 rounded-[8px] bg-[#f7fafc] border-l-4 border-[#cc0000]">
                <strong className="text-[#020a1c] block mb-1">1. Original Reporting &amp; Perspective</strong>
                Submissions should bring firsthand insights, verified data, or clear case studies rather than generic summaries.
              </div>
              <div className="p-4 rounded-[8px] bg-[#f7fafc] border-l-4 border-[#cc0000]">
                <strong className="text-[#020a1c] block mb-1">2. Structure &amp; Clarity</strong>
                Target 800 to 2,200 words organized with clear section subheadings and concise paragraphs.
              </div>
              <div className="p-4 rounded-[8px] bg-[#f7fafc] border-l-4 border-[#cc0000]">
                <strong className="text-[#020a1c] block mb-1">3. Non-Promotional Tone</strong>
                Educational value comes first; overt sales pitches or affiliate spam are declined.
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="nf-font-display text-[22px] font-bold text-[#020a1c] flex items-center gap-2 pb-3 border-b border-[#cbd5e1]/45">
              <Sparkles className="w-5 h-5 text-[#cc0000]" />
              <span>Publication Workflow</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { num: '01', title: 'Pitch Outline', desc: 'Send your headline and thesis through our submission form.' },
                { num: '02', title: 'Desk Review', desc: 'Editors review pitches within 48–72 business hours.' },
                { num: '03', title: 'Feature Release', desc: 'Approved stories go live across our digital edition.' },
              ].map((step) => (
                <div
                  key={step.num}
                  className="p-4 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50 text-center"
                >
                  <span className="text-[18px] font-bold text-[#cc0000]">{step.num}</span>
                  <h4 className="text-[14px] font-bold text-[#020a1c] mt-1">{step.title}</h4>
                  <p className="text-[12px] text-[#657285] mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[128px]">
            <WriteForUsForm />
          </div>
        </div>
      </div>

      <div className="border-t border-[#cbd5e1]/45 pt-10">
        <h2 className="nf-font-display text-[22px] font-bold text-[#020a1c] mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#cc0000]" />
          <span>Contributor FAQs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13px] text-[#657285]">
          <div className="p-5 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50">
            <h4 className="font-bold text-[15px] text-[#020a1c] mb-1.5">
              How long does editorial review take?
            </h4>
            <p className="leading-relaxed">
              Our desk reviews pitches within 2 to 3 business days and replies directly by email if approved for drafting.
            </p>
          </div>
          <div className="p-5 rounded-[8px] bg-[#f7fafc] border border-[#cbd5e1]/50">
            <h4 className="font-bold text-[15px] text-[#020a1c] mb-1.5">
              Where do I send official press releases?
            </h4>
            <p className="leading-relaxed">
              Press announcements and interview requests can also be emailed directly to{' '}
              <a
                href="mailto:editorial@entrepreneurmirror.com"
                className="text-[#cc0000] underline"
              >
                editorial@entrepreneurmirror.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
