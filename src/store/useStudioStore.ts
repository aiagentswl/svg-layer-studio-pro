import { create } from 'zustand';
import { SVGItem } from '../types';
import { saveProjectToDB, loadProjectFromDB } from '../utils/indexedDb';
import { replaceSVGColor } from '../utils/svgColorEngine';

interface StudioStore {
  projectName: string;
  layers: Record<string, SVGItem>;
  selectedIds: string[];
  activeCategory: string | null;
  searchQuery: string;
  zoom: number;
  viewMode: 'checker' | 'dark' | 'light';
  history: Array<Record<string, SVGItem>>;
  historyIndex: number;
  
  // Actions
  setLayers: (layers: Record<string, SVGItem>) => void;
  selectLayer: (id: string, multi?: boolean) => void;
  updateColorInSelected: (targetColor: string, newColor: string) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  setZoom: (zoom: number) => void;
  setViewMode: (mode: 'checker' | 'dark' | 'light') => void;
  setSearchQuery: (query: string) => void;
  undo: () => void;
  redo: () => void;
  loadSavedProject: () => Promise<void>;
}

export const useStudioStore = create<StudioStore>((set, get) => ({
  projectName: 'SVG Layer Project',
  layers: {},
  selectedIds: [],
  activeCategory: null,
  searchQuery: '',
  zoom: 100,
  viewMode: 'checker',
  history: [],
  historyIndex: -1,

  setLayers: (layers) => {
    set({
      layers,
      selectedIds: Object.keys(layers).slice(0, 1),
      history: [layers],
      historyIndex: 0
    });
    saveProjectToDB(layers, get().projectName);
  },

  selectLayer: (id, multi = false) => {
    set((state) => ({
      selectedIds: multi
        ? state.selectedIds.includes(id)
          ? state.selectedIds.filter((item) => item !== id)
          : [...state.selectedIds, id]
        : [id]
    }));
  },

  updateColorInSelected: (targetColor, newColor) => {
    const { layers, selectedIds, history, historyIndex, projectName } = get();
    if (selectedIds.length === 0) return;

    const nextLayers = { ...layers };
    selectedIds.forEach((id) => {
      if (nextLayers[id]) {
        const updatedSvg = replaceSVGColor(nextLayers[id].currentSvg, targetColor, newColor);
        nextLayers[id] = {
          ...nextLayers[id],
          currentSvg: updatedSvg,
          updatedAt: Date.now()
        };
      }
    });

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextLayers);

    set({
      layers: nextLayers,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });

    saveProjectToDB(nextLayers, projectName);
  },

  toggleVisibility: (id) => {
    set((state) => {
      const layer = state.layers[id];
      if (!layer) return state;
      const updated = { ...state.layers, [id]: { ...layer, visible: !layer.visible } };
      saveProjectToDB(updated, state.projectName);
      return { layers: updated };
    });
  },

  toggleLock: (id) => {
    set((state) => {
      const layer = state.layers[id];
      if (!layer) return state;
      const updated = { ...state.layers, [id]: { ...layer, locked: !layer.locked } };
      return { layers: updated };
    });
  },

  setZoom: (zoom) => set({ zoom }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const restored = history[newIndex];
      set({ historyIndex: newIndex, layers: restored });
      saveProjectToDB(restored, get().projectName);
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const restored = history[newIndex];
      set({ historyIndex: newIndex, layers: restored });
      saveProjectToDB(restored, get().projectName);
    }
  },

  loadSavedProject: async () => {
    const data = await loadProjectFromDB();
    if (data) {
      set({
        projectName: data.name,
        layers: data.layers,
        selectedIds: Object.keys(data.layers).slice(0, 1),
        history: [data.layers],
        historyIndex: 0
      });
    }
  }
}));
