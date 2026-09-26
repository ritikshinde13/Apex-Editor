import React from 'react';
import { Check } from 'lucide-react';

export interface LandingFeatureBlockProps {
  id?: string;
  badge: string;
  badgeColor?: 'blue' | 'teal' | 'purple' | 'amber';
  title: string;
  description: string;
  bullets?: string[];
  visual: React.ReactNode;
  reversed?: boolean;
}

export const LandingFeatureBlock: React.FC<LandingFeatureBlockProps> = ({
  id,
  badge,
  badgeColor = 'blue',
  title,
  description,
  bullets = [],
  visual,
  reversed = false,
}) => {
  const badgeClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    teal: 'bg-[#00C9A7]/10 text-[#00A88B] border-[#00C9A7]/30',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
  }[badgeColor];

  return (
    <div id={id} className="py-12 sm:py-20 scroll-mt-24">
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
          reversed ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Text Content Column */}
        <div className={`lg:col-span-6 space-y-4 sm:space-y-6 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm" style={{}}>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClasses}`}>
              {badge}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
          </h3>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {description}
          </p>

          {bullets.length > 0 && (
            <ul className="space-y-3 pt-2 text-sm text-slate-700 font-medium">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#00C9A7]/15 text-[#00A88B] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visual Mockup Column */}
        <div className={`lg:col-span-6 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="relative group">
            {/* Subtle glow behind card */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            {/* Visual Frame */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80 overflow-hidden">
              {visual}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
