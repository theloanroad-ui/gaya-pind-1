'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function WriteForUsForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    topic: 'Business',
    pitchTitle: '',
    synopsis: '',
    sampleUrl: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.pitchTitle || !formData.synopsis) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 350);
  };

  if (submitted) {
    return (
      <div className="bg-[#f7fafc] border border-[#cbd5e1] rounded-[8px] p-6 sm:p-8 text-center">
        <CheckCircle2 className="w-11 h-11 text-[#cc0000] mx-auto mb-3" />
        <h3 className="nf-font-display text-[22px] font-bold text-[#020a1c]">
          Pitch Received
        </h3>
        <p className="text-[13px] text-[#657285] mt-2 leading-relaxed">
          Thank you for submitting your pitch to Entrepreneur Mirror. Our editors will review your outline and reply to{' '}
          <span className="font-semibold text-[#020a1c]">{formData.email}</span> within 2–3 business days.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              email: '',
              company: '',
              topic: 'Business',
              pitchTitle: '',
              synopsis: '',
              sampleUrl: '',
            });
          }}
          className="mt-5 text-[13px] font-medium bg-[#020a1c] hover:bg-[#cc0000] text-white px-5 h-9 rounded-md transition-colors cursor-pointer"
        >
          Submit Another Pitch
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f7fafc] border border-[#cbd5e1]/60 rounded-[8px] p-6">
      <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#cbd5e1]/45">
        <MessageSquare className="w-4 h-4 text-[#cc0000]" />
        <h3 className="nf-font-display text-[20px] font-bold text-[#020a1c]">
          Submit Editorial Pitch
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12px] font-semibold text-[#020a1c] mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sarah Jenkins"
            className="w-full h-10 text-[13px] px-3 bg-white border border-[#cbd5e1] rounded-md text-[#020a1c] focus:outline-none focus:border-[#cc0000]"
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#020a1c] mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="s.jenkins@company.com"
            className="w-full h-10 text-[13px] px-3 bg-white border border-[#cbd5e1] rounded-md text-[#020a1c] focus:outline-none focus:border-[#cc0000]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-[#020a1c] mb-1">
              Role &amp; Organization
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Managing Partner"
              className="w-full h-10 text-[13px] px-3 bg-white border border-[#cbd5e1] rounded-md text-[#020a1c] focus:outline-none focus:border-[#cc0000]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#020a1c] mb-1">
              Section
            </label>
            <select
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full h-10 text-[13px] px-3 bg-white border border-[#cbd5e1] rounded-md text-[#020a1c] focus:outline-none focus:border-[#cc0000]"
            >
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
              <option value="Interview">Executive Interview</option>
              <option value="Opinion">Opinion</option>
              <option value="Health">Health</option>
              <option value="Crypto">Crypto &amp; Metaverse</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#020a1c] mb-1">
            Proposed Headline *
          </label>
          <input
            type="text"
            required
            value={formData.pitchTitle}
            onChange={(e) => setFormData({ ...formData, pitchTitle: e.target.value })}
            placeholder="Why Enterprise AI Deployments Stall in Year Two"
            className="w-full h-10 text-[13px] px-3 bg-white border border-[#cbd5e1] rounded-md text-[#020a1c] focus:outline-none focus:border-[#cc0000]"
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#020a1c] mb-1">
            Outline &amp; Thesis *
          </label>
          <textarea
            rows={4}
            required
            value={formData.synopsis}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            placeholder="Summarize key arguments, data sources, and takeaways for Entrepreneur Mirror readers..."
            className="w-full text-[13px] p-3 bg-white border border-[#cbd5e1] rounded-md text-[#020a1c] focus:outline-none focus:border-[#cc0000]"
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#020a1c] mb-1">
            Writing Sample URL (Optional)
          </label>
          <input
            type="url"
            value={formData.sampleUrl}
            onChange={(e) => setFormData({ ...formData, sampleUrl: e.target.value })}
            placeholder="https://..."
            className="w-full h-10 text-[13px] px-3 bg-white border border-[#cbd5e1] rounded-md text-[#020a1c] focus:outline-none focus:border-[#cc0000]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 bg-[#cc0000] hover:bg-[#020a1c] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-md"
        >
          {isSubmitting ? (
            <span>Sending Pitch...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Submit Pitch</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-[#657285] text-center">
          Direct email: <span className="font-medium text-[#020a1c]">editorial@entrepreneurmirror.com</span>
        </p>
      </form>
    </div>
  );
}
