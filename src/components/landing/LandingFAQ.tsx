import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { BRANDING } from '@/branding';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is it possible to add music to my videos?',
    answer:
      'Yes, absolutely! You can import MP3, WAV, AAC, and OGG audio tracks directly into the media pool. Drag them onto the audio timeline track, adjust volume balance against voiceovers, apply smooth fade-in/fade-out effects, and sync sound effects to specific video scenes.',
  },
  {
    id: 'faq-2',
    question: 'Can I save projects and continue later?',
    answer:
      `Yes! ${BRANDING.appName} automatically serializes and saves your project timeline, tracks, clip cuts, and settings to your browser's persistent IndexedDB storage every 30 seconds. When you return to the page, your workspace will restore exactly where you left off.`,
  },
  {
    id: 'faq-3',
    question: 'What text/font options are available?',
    answer:
      'You have complete creative control over typography. Select from popular fonts including Inter, Poppins, Syne, and monospace fonts, dial in custom font weights, scale text size, adjust colors, toggle rounded background highlight banners, and position subtitles anywhere on the video frame.',
  },
  {
    id: 'faq-4',
    question: 'Do I need to download or install any software?',
    answer:
      'No downloads, installations, or plugin configurations are ever needed. Everything runs directly inside modern web browsers (Chrome, Safari, Edge, Firefox). Simply open the URL and start cutting your videos immediately.',
  },
  {
    id: 'faq-5',
    question: 'Can I edit videos on both my phone and computer?',
    answer:
      `Yes! ${BRANDING.appName} is engineered with a mobile-first, responsive interface. You can assemble rough cuts, trim clips, and preview edits on your smartphone while on the go, then switch to your desktop or laptop for multi-track polishing and 4K exporting.`,
  },
  {
    id: 'faq-6',
    question: 'Are my raw video files uploaded to remote servers?',
    answer:
      'No. Your footage never leaves your personal device. Unlike traditional cloud editors that upload gigabytes of footage to remote data centers, our engine leverages high-speed WebAssembly client-side processing directly in your browser. Your media remains completely private and secure.',
  },
  {
    id: 'faq-7',
    question: 'Which video formats and export resolutions are supported?',
    answer:
      'You can import MP4, WebM, MOV, and common audio formats. When exporting, you can output in crystal-clear MP4 or WebM at 720p, 1080p Full HD, or 4K resolution at 24fps, 30fps, or 60fps.',
  },
  {
    id: 'faq-8',
    question: 'Is there any watermark on my exported videos?',
    answer:
      'No! Videos exported from our standard video studio are 100% clean and unbranded with zero forced watermarks, giving you full creative ownership for your YouTube channel, TikTok feed, or commercial client work.',
  },
];

export const LandingFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50/50 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#00C9A7]" />
            <span>GOT QUESTIONS?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about editing, saving, and exporting videos with {BRANDING.appName}.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5" role="region" aria-label="Frequently Asked Questions">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                >
                  <span className="text-base sm:text-lg leading-snug">{item.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className="px-6 pb-5 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 text-center bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <p className="text-sm font-bold text-slate-800">Still have a question or need special features?</p>
          <p className="text-xs text-slate-500 mt-1">
            Our AI Co-Pilot is built right into the editor to assist you with any questions or editing workflow.
          </p>
          <button
            onClick={() => {
              window.location.hash = '#editor';
              window.location.reload();
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            <span>Ask AI Co-Pilot in Studio →</span>
          </button>
        </div>

      </div>
    </section>
  );
};
