import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DEFAULT_TOOLS, ToolItem } from './toolsData';

export interface LandingToolGridProps {
  tools?: ToolItem[];
}

export const LandingToolGrid: React.FC<LandingToolGridProps> = ({ tools = DEFAULT_TOOLS }) => {
  const { currentUser, setCurrentPage } = useUIStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'platform' | 'format' | 'device'>('all');

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter((tool) => tool.category === selectedCategory);

  const handleLaunchTool = (_tool: ToolItem) => {
    if (currentUser?.isLoggedIn) {
      setCurrentPage('editor');
      setTimeout(() => {
        window.location.hash = '#editor';
      }, 0);
    } else {
      setCurrentPage('login');
      setTimeout(() => {
        window.location.hash = '#login';
      }, 0);
    }
  };

  return (
    <section id="tools" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00C9A7]" />
            <span>FORMAT & PLATFORM SUITE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Specialized video tools for every workflow
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Whether you need to slice a fast MP4, reformat for TikTok, or mix background audio on macOS or Windows, we have a tailor-made tool ready in your browser.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Tools' },
              { id: 'platform', label: 'Social Platforms' },
              { id: 'format', label: 'Formats & Audio' },
              { id: 'device', label: 'Devices & OS' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Card / Pill Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => handleLaunchTool(tool)}
                className="group bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    {tool.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00C9A7]/10 text-[#00A88B] border border-[#00C9A7]/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Launch CTA Banner */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 mb-3">
            Looking for a format not listed here? Our editor accepts almost all video and audio containers.
          </p>
          <button
            onClick={() => handleLaunchTool(DEFAULT_TOOLS[0])}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            <span>Open Universal Video Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
