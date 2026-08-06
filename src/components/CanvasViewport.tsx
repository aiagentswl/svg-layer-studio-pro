import React from 'react';
import { useStudioStore } from '../store/useStudioStore';

export const CanvasViewport: React.FC = () => {
  const { layers, selectedIds, zoom, viewMode, setViewMode } = useStudioStore();

  const selectedLayers = selectedIds.map(id => layers[id]).filter(Boolean);

  const getBgStyle = () => {
    if (viewMode === 'dark') return 'bg-slate-950';
    if (viewMode === 'light') return 'bg-slate-100';
    return 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900';
  };

  return (
    <main className={`flex-1 flex flex-col relative overflow-hidden ${getBgStyle()}`}>
      {/* Background Mode Toggles */}
      <div className="absolute top-4 right-4 z-10 flex gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-lg backdrop-blur">
        <button
          onClick={() => setViewMode('checker')}
          className={`px-2.5 py-1 text-xs rounded ${viewMode === 'checker' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode('dark')}
          className={`px-2.5 py-1 text-xs rounded ${viewMode === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Dark
        </button>
        <button
          onClick={() => setViewMode('light')}
          className={`px-2.5 py-1 text-xs rounded ${viewMode === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Light
        </button>
      </div>

      {/* Main Vector Rendering Canvas */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        {selectedLayers.length === 0 ? (
          <div className="text-slate-500 text-center font-medium">
            Select a layer from the left panel to inspect and recolor
          </div>
        ) : (
          <div
            className="transition-transform duration-75 origin-center shadow-2xl rounded-lg bg-transparent"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {selectedLayers.map((layer) => (
              <div
                key={layer.id}
                className="w-[450 h-[450px] flex items-center justify-center border border-slate-800/50 rounded"
                dangerouslySetInnerHTML={{ __html: layer.currentSvg }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
