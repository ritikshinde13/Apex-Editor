import React from 'react';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

export interface ResourceCardProps {
  id: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export const LandingResourceCard: React.FC<ResourceCardProps> = ({
  title,
  category,
  readTime,
  description,
  gradient,
  icon: Icon,
  onClick,
}) => {
  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      <div>
        {/* Visual Thumbnail Banner */}
        <div className={`aspect-[16/9] ${gradient} p-6 flex flex-col justify-between relative overflow-hidden`}>
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm">
              {category}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Icon className="w-4 h-4" />
            </div>
          </div>

          <div className="z-10">
            <div className="w-12 h-1 bg-white/60 rounded-full mb-2" />
          </div>

          {/* Decorative background shape */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTime}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Read link at bottom */}
      <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Read Guide</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </article>
  );
};
