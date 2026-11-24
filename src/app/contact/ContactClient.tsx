'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { CATEGORIES as INITIAL_CATEGORIES } from '@/data/categories';
import { Category } from '@/types';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SectionTitle } from '@/components/newsflash/NewsFlashPrimitives';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.data;
        if (Array.isArray(list) && list.length > 0) setCategories(list);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="nf-container py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
        showBackLink
        backHref="/"
        backLabel="Front Page"
        rightBadge="Newsroom Desk"
        includeJsonLd={false}
      />

      <div className="max-w-3xl mb-10 flex flex-col items-start gap-3">
        <SectionTitle title="Newsroom Contact" highlight />
        <h1 className="nf-font-display text-[32px] sm:text-[44px] font-bold leading-[1.12] tracking-[-0.025em] text-[#020a1c]">
          Contact Entrepreneur Mirror
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#657285]">
          Have an executive interview pitch, press release, leadership feature, or partnership inquiry? Connect directly with our editorial desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7 bg-[#f7fafc] border border-[#cbd5e1]/50 rounded-[8px] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#cbd5e1]/45">
            <MessageSquare className="w-5 h-5 text-[#cc0000]" />
            <h2 className="nf-font-display text-[22px] font-bold text-[#020a1c]">
              Send an Editorial Message
            </h2>
          </div>

          {submitted ? (
            <div className="bg-white border border-[#cbd5e1] rounded-[8px] p-8 text-center my-4">
              <CheckCircle2 className="w-11 h-11 text-[#cc0000] mx-auto mb-3" />
              <h3 className="text-[20px] font-bold text-[#020a1c]">Message Received</h3>
              <p className="text-[14px] text-[#657285] mt-2 max-w-md mx-auto">
                Thank you for contacting Entrepreneur Mirror. Our editorial desk will review your message and respond within 1–2 business days.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    category: 'General Inquiry',
                    message: '',
                  });
                }}
                className="mt-6 bg-[#020a1c] hover:bg-[#cc0000] text-white px-5 h-10 text-[13px] font-medium rounded-md transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-[14px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#020a1c] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Rivera"
                    className="w-full h-10 bg-white text-[#020a1c] px-3.5 rounded-md border border-[#cbd5e1] focus:outline-none focus:border-[#cc0000]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#020a1c] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full h-10 bg-white text-[#020a1c] px-3.5 rounded-md border border-[#cbd5e1] focus:outline-none focus:border-[#cc0000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#020a1c] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Story pitch or press inquiry"
                    className="w-full h-10 bg-white text-[#020a1c] px-3.5 rounded-md border border-[#cbd5e1] focus:outline-none focus:border-[#cc0000]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#020a1c] mb-1.5">
                    Editorial Desk
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 bg-white text-[#020a1c] px-3.5 rounded-md border border-[#cbd5e1] focus:outline-none focus:border-[#cc0000]"
                  >
                    <option value="General Inquiry">General Editorial Inquiry</option>
                    <option value="Executive Interview">Executive Interview Pitch</option>
                    <option value="Press Release">Press &amp; Media Relations</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>
                        {cat.name} Desk
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#020a1c] mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details of your inquiry, interview proposal, or story pitch..."
                  className="w-full bg-white text-[#020a1c] p-3.5 rounded-md border border-[#cbd5e1] focus:outline-none focus:border-[#cc0000]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#020a1c] hover:bg-[#cc0000] text-white text-[13px] font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Editorial Inquiry</span>
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-6 bg-[#f7fafc] border border-[#cbd5e1]/50 rounded-[8px] space-y-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#cc0000]">
              Direct Channels
            </h3>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#020a1c] mt-1" />
              <div>
                <div className="text-[14px] font-semibold text-[#020a1c]">Editorial Email</div>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-[13px] text-[#657285] hover:text-[#cc0000] transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            {siteConfig.contact.phone && (
              <div className="flex items-start gap-3 pt-3 border-t border-[#cbd5e1]/45">
                <Phone className="w-4 h-4 text-[#020a1c] mt-1" />
                <div>
                  <div className="text-[14px] font-semibold text-[#020a1c]">Newsroom Line</div>
                  <div className="text-[13px] text-[#657285]">{siteConfig.contact.phone}</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#f7fafc] border border-[#cbd5e1]/50 rounded-[8px]">
            <div className="flex items-center gap-2 text-[#cc0000] text-[12px] font-semibold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>United States Desk</span>
            </div>
            <h4 className="text-[16px] font-bold text-[#020a1c]">
              {siteConfig.contact.addressNY?.title || 'New York Desk'}
            </h4>
            <p className="text-[13px] text-[#657285] mt-1 leading-relaxed">
              {siteConfig.contact.addressNY?.street}
              <br />
              {siteConfig.contact.addressNY?.city}, {siteConfig.contact.addressNY?.country}
            </p>
          </div>

          <div className="p-6 bg-[#f7fafc] border border-[#cbd5e1]/50 rounded-[8px]">
            <div className="flex items-center gap-2 text-[#cc0000] text-[12px] font-semibold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>European Bureau</span>
            </div>
            <h4 className="text-[16px] font-bold text-[#020a1c]">
              {siteConfig.contact.addressLondon?.title || 'London Bureau'}
            </h4>
            <p className="text-[13px] text-[#657285] mt-1 leading-relaxed">
              {siteConfig.contact.addressLondon?.street}
              <br />
              {siteConfig.contact.addressLondon?.city}, {siteConfig.contact.addressLondon?.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
