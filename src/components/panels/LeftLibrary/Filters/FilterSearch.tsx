import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterSearchProps {
  query: string;
  onChange: (query: string) => void;
}

export const FilterSearch: React.FC<FilterSearchProps> = ({
  query,
  onChange,
}) => {
  return (
    <div className="relative flex items-center px-3 py-2 shrink-0">
      <Search className="w-3.5 h-3.5 absolute left-5 text-editor-dim pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search 35+ filters (e.g. vintage, film, teal)..."
        className="w-full bg-editor-surface border border-editor-border text-xs text-editor-text pl-7 pr-8 py-1.5 rounded-lg placeholder:text-editor-dim/60 focus:outline-none focus:border-accent-cyan/60 transition-colors"
      />
      {query && (
        <button
          onClick={() => onChange('')}
          title="Clear search"
          className="absolute right-5 p-1 text-editor-dim hover:text-editor-text rounded-full"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
