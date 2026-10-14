import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../data/siteData';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white border-t border-slate-200/80 scroll-mt-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            align="center"
            eyebrow="Common Patient Inquiries"
            title="Frequently Asked Questions"
            description="Clear clinical answers about appointment procedures, pupil dilation, surgical timelines and what to expect during your visit to Nirvaya Eyecare Centre."
          />

          {/* FAQ Accordion List */}
          <div className="mt-12 space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#DFBF64] bg-slate-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-sm sm:text-base text-[#0A1E3F]">
                      {item.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-[#DFBF64] text-[#0A1E3F] rotate-180'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Extra Help Callout */}
          <div className="mt-10 p-5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-4 text-xs text-slate-700">
            <div className="w-9 h-9 rounded-xl bg-sky-600/10 text-sky-800 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <p className="font-bold text-[#0A1E3F]">Have a question not addressed here?</p>
              <p className="text-slate-600">Contact our clinic coordinator at +91 755 492 8200 or send a quick query on WhatsApp for guidance.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
