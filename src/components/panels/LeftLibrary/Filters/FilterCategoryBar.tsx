import React from 'react';
import { FilterCategory, FILTER_CATEGORIES } from '@/core/filters/filterDefinitions';
import { Star, Clock, Layers } from 'lucide-react';

interface FilterCategoryBarProps {
  activeCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  favoritesCount: number;
}

export const FilterCategoryBar: React.FC<FilterCategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  favoritesCount,
}) => {
  const getCategoryIcon = (id: FilterCategory) => {
    switch (id) {
      case 'all':
        return <Layers className="w-3 h-3" />;
      case 'favorites':
        return <Star className="w-3 h-3 fill-current" />;
      case 'recent':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-3 border-b border-editor-border/60 shrink-0">
      {FILTER_CATEGORIES.map((category) => {
        const isActive = activeCategory === category.id;
        const icon = getCategoryIcon(category.id);

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-accent-cyan text-black font-semibold shadow-glow-cyan'
                : 'bg-editor-surface/60 text-editor-subtext hover:text-editor-text hover:bg-editor-surface border border-editor-border/40'
            }`}
          >
            {icon}
            <span>{category.label}</span>
            {category.id === 'favorites' && favoritesCount > 0 && (
              <span
                className={`text-[9px] px-1 rounded-full ${
                  isActive ? 'bg-black/20 text-black' : 'bg-editor-border text-editor-dim'
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
