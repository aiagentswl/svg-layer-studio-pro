import { get, set, del } from 'idb-keyval';
import { SVGItem } from '../types';

const STORE_KEY = 'SVG_LAYER_STUDIO_CURRENT_PROJECT';

export async function saveProjectToDB(layers: Record<string, SVGItem>, projectName: string) {
  try {
    await set(STORE_KEY, {
      name: projectName,
      layers,
      lastModified: Date.now()
    });
  } catch (err) {
    console.error('Failed to autosave project to IndexedDB:', err);
  }
}

export async function loadProjectFromDB(): Promise<{ name: string; layers: Record<string, SVGItem> } | null> {
  try {
    const data = await get(STORE_KEY);
    return data || null;
  } catch (err) {
    console.error('Failed to load project from IndexedDB:', err);
    return null;
  }
}

export async function clearProjectDB() {
  await del(STORE_KEY);
}
