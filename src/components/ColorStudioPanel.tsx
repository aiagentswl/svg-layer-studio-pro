import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { extractColorsFromSVG } from '../utils/svgColorEngine';

const PRESET_PALETTES = [
  { name: 'Cyberpunk', colors: ['#ff0055', '#00ffff', '#ffe600', '#9d00ff', '#121212'] },
  { name: 'Synthwave', colors: ['#f72585', '#7209b7', '#3f37c9', '#4cc9f0', '#480ca8'] },
  { name: 'Pop Art', colors: ['#d62828', '#f77f00', '#fcbf49', '#003049', '#eae2b7'] },
  { name: 'Gold Luxury', colors: ['#ffe08a', '#f5d36b', '#e9bf52', '#c9a227', '#1a1a1a'] }
];

export const ColorStudioPanel: React.FC = () => {
  const { layers, selectedIds, updateColorInSelected } = useStudioStore();

  const selectedLayer = selectedIds.length > 0 ? layers[selectedIds[0]] : null;
  const detectedColors = selectedLayer ? extractColorsFromSVG(selectedLayer.currentSvg) : [];

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col gap-6 h-[calc(100vh-3.5rem)] overflow-y-auto select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Palette className="w-5 h-5 text-indigo-400" />
        <h2 className="text-sm font-bold text-slate-200 tracking-wide">COLOR ENGINE</h2>
      </div>

      {/* Detected SVG Layer Colors */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          Active Layer Palette ({detectedColors.length})
        </label>
        {detectedColors.length === 0 ? (
          <div className="text-xs text-slate-500 italic">No customizable vector colors detected.</div>
        ) : (
          <div className="space-y-2.5">
            {detectedColors.map((color) => (
              <div key={color} className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded border border-slate-700 shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-slate-300 uppercase">{color}</span>
                </div>
                <input
                  type="color"
                  value={color.startsWith('#') && color.length === 7 ? color : '#000000'}
                  onChange={(e) => updateColorInSelected(color, e.target.value)}
                  className="w-7 h-7 bg-transparent border-0 cursor-pointer rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Smart Palette Generators */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Palette Presets
          </label>
        </div>
        <div className="space-y-2">
          {PRESET_PALETTES.map((preset) => (
            <div
              key={preset.name}
              className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition"
            >
              <span className="text-xs font-medium text-slate-300 block mb-1.5">{preset.name}</span>
              <div className="flex h-4 rounded overflow-hidden">
                {preset.colors.map((c) => (
                  <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
