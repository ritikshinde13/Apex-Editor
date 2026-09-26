import React, { useState } from 'react';
import { LandingResourceCard } from './LandingResourceCard';
import { Sparkles, Video, Layers, Maximize2, Music, X } from 'lucide-react';

export const LandingResources: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<{
    title: string;
    category: string;
    readTime: string;
    content: string;
  } | null>(null);

  const guides = [
    {
      id: 'guide-1',
      title: 'How to Create Viral 9:16 Videos for TikTok & Reels',
      category: 'Social Growth',
      readTime: '4 min read',
      description: 'Discover pacing strategies, hook placement, and animated bold captions that keep viewers glued past the 3-second mark.',
      gradient: 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400',
      icon: Video,
      content: `Vertical video content on TikTok, YouTube Shorts, and Instagram Reels demands instant viewer engagement within the first 2 seconds.\n\nKey Best Practices:\n1. Hook in Frame 1: Place an eye-catching visual movement or bold question text overlay right at 00:00.\n2. Dynamic Captions: Use high-contrast font styling (e.g. Inter Bold with a dark text background) positioned in the central safe zone to avoid UI icon clutter.\n3. Snappy Edits: Slice dead air and breathing pauses using the Razor tool (C key). Aim for cuts every 1.5 to 3 seconds to maintain dynamic visual rhythm.\n4. Audio Trending Sync: Match your cuts to the rhythmic beats of trending audio tracks.`,
    },
    {
      id: 'guide-2',
      title: '5 Picture-in-Picture & Split-Screen Tricks for Reaction Videos',
      category: 'Editing Tips',
      readTime: '6 min read',
      description: 'Learn how to layer commentary facecams, round window borders, and balance microphone audio over gameplay footage.',
      gradient: 'bg-gradient-to-tr from-teal-500 via-emerald-600 to-cyan-500',
      icon: Layers,
      content: `Picture-in-picture (PiP) is the gold standard for commentary, gaming walkthroughs, and tutorial demos.\n\nPro Compositing Tips:\n1. Bounding Box Framing: Position your facecam in the upper-right or lower-right corner to leave center-stage action unobstructed.\n2. Rounded Corners: Apply subtle rounded border radii to your PiP overlay to give it a sleek, modern streaming aesthetic.\n3. Audio Ducking: Keep the reaction microphone track 6-10dB higher than the gameplay background so dialogue remains crystal-clear.\n4. Synchronized Cuts: Group and cut both the main video and PiP layer simultaneously when trimming scenes.`,
    },
    {
      id: 'guide-3',
      title: 'The Complete Social Media Video Aspect Ratio Cheat Sheet',
      category: 'Format Guide',
      readTime: '3 min read',
      description: 'A master reference for YouTube (16:9), TikTok (9:16), Instagram (1:1 & 4:5), and widescreen cinematic formats.',
      gradient: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600',
      icon: Maximize2,
      content: `Avoid awkward black letterboxing and unexpected cropping by matching your export canvas to each target destination:\n\n• 16:9 Landscape (1920×1080 / 3840×2160): YouTube standard, Vimeo, TV displays.\n• 9:16 Full Vertical (1080×1920): TikTok, Instagram Reels, YouTube Shorts, Snapchat.\n• 1:1 Square (1080×1080): Instagram Feed Carousels, Facebook desktop feeds.\n• 4:5 Portrait (1080×1350): Optimized mobile feed posts taking up maximum vertical viewport real estate.\n• 21:9 Ultrawide (2560×1080): Cinematic storytelling, indie films, and music videos.`,
    },
    {
      id: 'guide-4',
      title: 'Balancing Voiceovers & Background Music for Crystal-Clear Sound',
      category: 'Audio Mastering',
      readTime: '5 min read',
      description: 'Master EQ balance, volume ducking, and smooth fade transitions so your music enhances the story without drowning speech.',
      gradient: 'bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500',
      icon: Music,
      content: `Great audio separates amateur videos from professional content.\n\nGolden Audio Rules:\n1. The 80/20 Balance: Set background music between 15% and 25% volume while keeping speech track gain at 80% to 100%.\n2. Fade Transitions: Always apply a 0.5s to 1.0s audio fade-in at the start of scenes and a smooth fade-out at the end to prevent harsh audio pops.\n3. Waveform Alignment: Use the visual waveform display to line up dramatic drop moments with video scene cuts.`,
    },
  ];

  return (
    <section id="resources" className="py-16 sm:py-24 bg-white border-t border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00C9A7]" />
            <span>LEARN & CREATE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Resources & Guides
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Step-by-step masterclasses, aspect ratio cheat sheets, and editing techniques curated to help you produce viral videos faster.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <LandingResourceCard
              key={guide.id}
              {...guide}
              onClick={() => setActiveArticle(guide)}
            />
          ))}
        </div>

        {/* Guide Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {activeArticle.category} • {activeArticle.readTime}
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                  aria-label="Close Guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4 leading-snug">
                {activeArticle.title}
              </h3>

              <div className="text-sm text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
