export interface ColorStop {
  offset: string;
  color: string;
}

export interface SVGItem {
  id: string;
  name: string;
  path: string; // Folder path e.g. "Background/PK Background/"
  category: string;
  originalSvg: string;
  currentSvg: string;
  colors: string[]; // Detected unique hex/rgb colors
  visible: boolean;
  locked: boolean;
  isFavorite: boolean;
  updatedAt: number;
}

export interface ProjectState {
  id: string;
  name: string;
  layers: Record<string, SVGItem>;
  history: Array<{
    timestamp: number;
    description: string;
    layers: Record<string, SVGItem>;
  }>;
  historyIndex: number;
  selectedIds: string[];
  activeColor: string;
  zoom: number;
  theme: 'dark' | 'light';
  viewMode: 'checker' | 'dark' | 'light';
}
