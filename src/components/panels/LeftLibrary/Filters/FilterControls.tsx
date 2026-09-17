import React from 'react';
import { Eye, RotateCcw, CopyCheck } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

interface FilterControlsProps {
  hasFilterApplied: boolean;
  onResetFilter: () => void;
  onApplyToAll: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  hasFilterApplied,
  onResetFilter,
  onApplyToAll,
}) => {
  const { isComparingBeforeAfter, setIsComparingBeforeAfter, toggleComparingBeforeAfter } = useUIStore();

  return (
    <div className="flex items-center gap-1.5 pt-1">
      {/* Before/After Press-and-Hold & Toggle */}
      <button
        type="button"
        onMouseDown={() => setIsComparingBeforeAfter(true)}
        onMouseUp={() => setIsComparingBeforeAfter(false)}
        onMouseLeave={() => isComparingBeforeAfter && setIsComparingBeforeAfter(false)}
        onTouchStart={() => setIsComparingBeforeAfter(true)}
        onTouchEnd={() => setIsComparingBeforeAfter(false)}
        onClick={(e) => {
          // Double-click or click with Alt key allows persistent toggle if desired
          if (e.altKey) {
            toggleComparingBeforeAfter();
          }
        }}
        disabled={!hasFilterApplied}
        title="Hold to preview original footage without filters (Alt+Click to toggle)"
        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all select-none ${
          isComparingBeforeAfter
            ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-glow-amber'
            : hasFilterApplied
            ? 'bg-editor-surface hover:bg-editor-border text-editor-text border-editor-border'
            : 'bg-editor-surface/40 text-editor-dim border-transparent cursor-not-allowed'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>{isComparingBeforeAfter ? 'Original...' : 'Hold: Before'}</span>
      </button>

      {/* Reset Filter Button */}
      <button
        type="button"
        onClick={onResetFilter}
        disabled={!hasFilterApplied}
        title="Reset filter to original"
        className={`flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-medium border transition-colors ${
          hasFilterApplied
            ? 'bg-editor-surface hover:bg-rose-500/20 text-editor-subtext hover:text-rose-300 border-editor-border hover:border-rose-500/40'
            : 'bg-editor-surface/40 text-editor-dim border-transparent cursor-not-allowed'
        }`}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>

      {/* Apply to All Clips Button */}
      <button
        type="button"
        onClick={onApplyToAll}
        disabled={!hasFilterApplied}
        title="Apply this filter to all video and image clips on timeline"
        className={`flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-medium border transition-colors ${
          hasFilterApplied
            ? 'bg-accent-cyan/15 hover:bg-accent-cyan/25 text-accent-cyan border-accent-cyan/30 hover:border-accent-cyan/60'
            : 'bg-editor-surface/40 text-editor-dim border-transparent cursor-not-allowed'
        }`}
      >
        <CopyCheck className="w-3.5 h-3.5" />
        <span>To All</span>
      </button>
    </div>
  );
};
