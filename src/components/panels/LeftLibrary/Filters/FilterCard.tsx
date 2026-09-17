import React from 'react';
import { FilterDefinition } from '@/core/filters/filterDefinitions';
import { Star, Check } from 'lucide-react';

interface FilterCardProps {
  filter: FilterDefinition;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: (filter: FilterDefinition) => void;
  onToggleFavorite: (e: React.MouseEvent, filterId: string) => void;
}

export const FilterCard: React.FC<FilterCardProps> = ({
  filter,
  isActive,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(filter)}
      className={`group relative flex flex-col rounded-xl p-2 cursor-pointer transition-all duration-200 border ${
        isActive
          ? 'bg-accent-cyan/10 border-accent-cyan shadow-glow-cyan ring-1 ring-accent-cyan/40 scale-[1.02]'
          : 'bg-editor-surface/80 border-editor-border hover:border-editor-subtext/60 hover:bg-editor-surface hover:scale-[1.01]'
      }`}
    >
      {/* Visual Thumbnail Swatch */}
      <div
        className="w-full h-16 rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner transition-transform group-hover:scale-[1.02]"
        style={{ background: filter.thumbnailGradient }}
      >
        {/* Subtle decorative grid/film line */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Favorite Star Button */}
        <button
          onClick={(e) => onToggleFavorite(e, filter.id)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-1.5 right-1.5 p-1 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-amber-400 text-black shadow-md'
              : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100 hover:text-amber-300 hover:bg-black/70'
          }`}
        >
          <Star className="w-3 h-3 fill-current" />
        </button>

        {/* Active Checkmark Pill */}
        {isActive && (
          <div className="absolute bottom-1.5 left-1.5 bg-accent-cyan text-black p-1 rounded-full shadow-lg flex items-center justify-center">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Filter Info */}
      <div className="mt-1.5 px-0.5">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold truncate ${
              isActive ? 'text-accent-cyan' : 'text-editor-text group-hover:text-white'
            }`}
          >
            {filter.name}
          </span>
        </div>
        <p className="text-[10px] text-editor-dim truncate mt-0.5">
          {filter.description}
        </p>
      </div>
    </div>
  );
};
