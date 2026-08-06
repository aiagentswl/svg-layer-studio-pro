import React, { useRef } from 'react';
import { Upload, Download, Undo, Redo, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';
import { processZipFile, exportProjectZip } from '../utils/zipHandler';

export const Header: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { layers, setLayers, undo, redo, historyIndex, history, zoom, setZoom } = useStudioStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const parsedLayers = await processZipFile(file);
      setLayers(parsedLayers);
    }
  };

  const handleExport = async () => {
    const blob = await exportProjectZip(layers);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_svg_layers.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-slate-200 select-none">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Layers className="w-5 h-5" />
        </div>
        <span className="font-bold tracking-wide text-white">SVG Layer Studio <span className="text-indigo-400">PRO</span></span>
      </div>

      {/* Tools & Undo/Redo */}
      <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-md border border-slate-700">
        <button
          disabled={historyIndex <= 0}
          onClick={undo}
          className="p-1.5 hover:bg-slate-700 rounded disabled:opacity-40"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          disabled={historyIndex >= history.length - 1}
          onClick={redo}
          className="p-1.5 hover:bg-slate-700 rounded disabled:opacity-40"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1.5 hover:bg-slate-700 rounded">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs px-2 font-mono">{zoom}%</span>
        <button onClick={() => setZoom(Math.min(500, zoom + 25))} className="p-1.5 hover:bg-slate-700 rounded">
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* File Operations */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
        >
          <Upload className="w-4 h-4" /> Upload ZIP
        </button>
        <button
          onClick={handleExport}
          disabled={Object.keys(layers).length === 0}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
        >
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>
    </header>
  );
};
