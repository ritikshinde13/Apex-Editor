import React, { useState, useEffect, useMemo } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useUIStore } from '@/store/useUIStore';
import {
  FILTERS,
  FilterCategory,
  FilterDefinition,
  getFilterById,
} from '@/core/filters/filterDefinitions';
import { FilterCard } from './FilterCard';
import { FilterCategoryBar } from './FilterCategoryBar';
import { FilterIntensitySlider } from './FilterIntensitySlider';
import { FilterControls } from './FilterControls';
import { FilterSearch } from './FilterSearch';
import { Sparkles, SlidersHorizontal, Info } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'apex_favorite_filters';
const RECENTS_STORAGE_KEY = 'apex_recent_filters';

export const FilterPanel: React.FC = () => {
  const {
    clips,
    selectedClipId,
    applyFilterToClip,
    setFilterIntensity,
    resetClipFilter,
    applyFilterToAllClips,
  } = useEditorStore();

  const { showToast } = useUIStore();

  // Local state for categories, search, favorites, recents
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['teal-orange', 'vintage', 'noir'];
    } catch {
      return ['teal-orange', 'vintage', 'noir'];
    }
  });
  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorite filters to localStorage', e);
    }
  }, [favorites]);

  // Persist recents
  useEffect(() => {
    try {
      localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(recents));
    } catch (e) {
      console.warn('Failed to save recent filters to localStorage', e);
    }
  }, [recents]);

  // Selected clip info
  const selectedClip = useMemo(
    () => clips.find((c) => c.id === selectedClipId && (c.type === 'video' || c.type === 'image')),
    [clips, selectedClipId]
  );

  const activeFilterId = selectedClip?.adjustments?.filterPreset || 'original';
  const activeIntensity = selectedClip?.adjustments?.filterIntensity ?? 100;
  const activeFilterDef = useMemo(() => getFilterById(activeFilterId), [activeFilterId]);
  const hasFilterApplied = activeFilterId !== 'original' && activeFilterId !== 'none';

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent, filterId: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId];
      return next;
    });
  };

  // Add to recents
  const markRecent = (filterId: string) => {
    if (filterId === 'original') return;
    setRecents((prev) => {
      const filtered = prev.filter((id) => id !== filterId);
      return [filterId, ...filtered].slice(0, 10);
    });
  };

  // Select filter
  const handleSelectFilter = (filter: FilterDefinition) => {
    let targetClipId = selectedClipId;

    // If no clip is currently selected, select the first video or image clip on timeline
    if (!targetClipId) {
      const firstMediaClip = clips.find((c) => c.type === 'video' || c.type === 'image');
      if (firstMediaClip) {
        targetClipId = firstMediaClip.id;
        useEditorStore.getState().setSelectedClipId(firstMediaClip.id);
      } else {
        showToast({
          type: 'warning',
          title: 'No Media Clip Found',
          message: 'Add a video or image to the timeline to apply filters.',
        });
        return;
      }
    }

    applyFilterToClip(targetClipId, filter.id, activeIntensity);
    markRecent(filter.id);

    showToast({
      type: 'info',
      title: `${filter.name} Filter`,
      message: `Applied at ${activeIntensity}% intensity`,
    });
  };

  // Handle intensity change
  const handleIntensityChange = (value: number) => {
    if (!selectedClip) return;
    setFilterIntensity(selectedClip.id, value);
  };

  // Reset filter
  const handleResetFilter = () => {
    if (!selectedClip) return;
    resetClipFilter(selectedClip.id);
    showToast({
      type: 'info',
      title: 'Filter Reset',
      message: 'Reverted clip to original footage appearance',
    });
  };

  // Apply to all clips
  const handleApplyToAll = () => {
    if (!hasFilterApplied) return;
    applyFilterToAllClips(activeFilterId, activeIntensity);
    showToast({
      type: 'success',
      title: 'Applied to All Clips',
      message: `${activeFilterDef.name} (${activeIntensity}%) applied to all media clips`,
    });
  };

  // Filtered list
  const displayFilters = useMemo(() => {
    let list = FILTERS;

    // Category filter
    if (activeCategory === 'favorites') {
      list = list.filter((f) => favorites.includes(f.id));
    } else if (activeCategory === 'recent') {
      list = recents
        .map((id) => getFilterById(id))
        .filter((f) => f.id !== 'original');
    } else if (activeCategory !== 'all') {
      list = list.filter((f) => f.category === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeCategory, searchQuery, favorites, recents]);

  return (
    <div className="h-full flex flex-col bg-editor-panel text-editor-text overflow-hidden select-none">
      {/* Panel Header */}
      <div className="px-3 py-2.5 border-b border-editor-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-editor-text leading-tight">Visual Filters</h2>
            <p className="text-[10px] text-editor-dim">35+ Cinematic & Creative Color Grades</p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-editor-dim px-2 py-0.5 rounded bg-editor-surface border border-editor-border">
          {displayFilters.length} Styles
        </div>
      </div>

      {/* Search Input */}
      <FilterSearch query={searchQuery} onChange={setSearchQuery} />

      {/* Categories Bar */}
      <FilterCategoryBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        favoritesCount={favorites.length}
      />

      {/* Selected Clip Status & Controls */}
      <div className="p-3 pb-2 space-y-2 border-b border-editor-border/60 bg-editor-bg/40 shrink-0">
        {!selectedClip ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs">
            <Info className="w-4 h-4 shrink-0" />
            <span className="text-[11px] leading-tight">
              Select a video or image on the timeline to preview and tune filters.
            </span>
          </div>
        ) : (
          <>
            {/* Filter Intensity Slider (Visible when active) */}
            {hasFilterApplied && (
              <FilterIntensitySlider
                intensity={activeIntensity}
                filterName={activeFilterDef.name}
                onChange={handleIntensityChange}
              />
            )}

            {/* Before/After, Reset & Apply To All Controls */}
            <FilterControls
              hasFilterApplied={hasFilterApplied}
              onResetFilter={handleResetFilter}
              onApplyToAll={handleApplyToAll}
            />
          </>
        )}
      </div>

      {/* Filter Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
        {displayFilters.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4">
            <SlidersHorizontal className="w-8 h-8 text-editor-dim/40 mb-2" />
            <p className="text-xs font-medium text-editor-dim">No filters match your criteria</p>
            {activeCategory === 'favorites' && (
              <p className="text-[11px] text-editor-dim/60 mt-1">
                Click the star icon (⭐) on any filter to save it here for fast access.
              </p>
            )}
            {activeCategory === 'recent' && (
              <p className="text-[11px] text-editor-dim/60 mt-1">
                Filters you apply will appear here automatically.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {displayFilters.map((filter) => {
              const isActive = selectedClip
                ? activeFilterId === filter.id
                : filter.id === 'original';
              const isFav = favorites.includes(filter.id);

              return (
                <FilterCard
                  key={filter.id}
                  filter={filter}
                  isActive={isActive}
                  isFavorite={isFav}
                  onSelect={handleSelectFilter}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
