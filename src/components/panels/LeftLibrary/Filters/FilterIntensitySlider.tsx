import React from 'react';
import { Sliders } from 'lucide-react';

interface FilterIntensitySliderProps {
  intensity: number;
  filterName: string;
  onChange: (value: number) => void;
}

export const FilterIntensitySlider: React.FC<FilterIntensitySliderProps> = ({
  intensity,
  filterName,
  onChange,
}) => {
  const quickValues = [25, 50, 75, 100];

  return (
    <div className="bg-editor-surface/90 border border-editor-border/80 rounded-xl p-3 space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-editor-text">
          <Sliders className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Intensity</span>
          <span className="text-[10px] text-editor-dim font-normal">({filterName})</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={100}
            value={intensity}
            onChange={(e) => {
              const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
              onChange(val);
            }}
            className="w-12 bg-editor-panel border border-editor-border text-accent-cyan font-mono text-xs text-right rounded px-1 py-0.5 focus:outline-none focus:border-accent-cyan"
          />
          <span className="text-xs text-editor-dim font-mono">%</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          value={intensity}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-editor-panel rounded-lg appearance-none cursor-pointer accent-accent-cyan"
        />
      </div>

      {/* Quick Jump Buttons */}
      <div className="flex items-center justify-between gap-1 pt-0.5">
        {quickValues.map((val) => (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={`flex-1 py-0.5 text-[10px] font-mono rounded transition-colors ${
              intensity === val
                ? 'bg-accent-cyan text-black font-bold'
                : 'bg-editor-panel/70 text-editor-dim hover:text-editor-text hover:bg-editor-panel'
            }`}
          >
            {val}%
          </button>
        ))}
      </div>
    </div>
  );
};
