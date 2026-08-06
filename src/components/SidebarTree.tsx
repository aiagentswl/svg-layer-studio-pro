import React from 'react';
import { Folder, Eye, EyeOff, Lock, Unlock, Search } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

export const SidebarTree: React.FC = () => {
  const { layers, selectedIds, selectLayer, toggleVisibility, toggleLock, searchQuery, setSearchQuery } = useStudioStore();

  const layerList = Object.values(layers).filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 pl-9 pr-3 py-1.5 text-sm rounded-md border border-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>
      </div>

      {/* Layer Hierarchy List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layerList.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No SVG layers found</div>
        ) : (
          layerList.map((layer) => {
            const isSelected = selectedIds.includes(layer.id);
            return (
              <div
                key={layer.id}
                onClick={(e) => selectLayer(layer.id, e.shiftKey || e.ctrlKey)}
                className={`flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer border transition ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-600/50 text-white'
                    : 'bg-slate-950/30 border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {/* SVG Thumbnail Preview */}
                <div
                  className="w-7 h-7 bg-slate-900 rounded border border-slate-800 flex items-center justify-center overflow-hidden shrink-0"
                  dangerouslySetInnerHTML={{ __html: layer.currentSvg }}
                />

                <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate flex-1 font-mono text-xs">{layer.name}</span>

                {/* Layer Quick Controls */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id); }}
                  className="p-1 hover:text-white text-slate-500"
                >
                  {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLock(layer.id); }}
                  className="p-1 hover:text-white text-slate-500"
                >
                  {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
