import JSZip from 'jszip';
import { SVGItem } from '../types';
import { extractColorsFromSVG } from './svgColorEngine';

export async function processZipFile(file: File): Promise<Record<string, SVGItem>> {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(file);
  const layers: Record<string, SVGItem> = {};

  for (const [relativePath, zipEntry] of Object.entries(unzipped.files)) {
    if (zipEntry.dir || !relativePath.endsWith('.svg')) continue;

    const svgContent = await zipEntry.async('string');
    const pathParts = relativePath.split('/');
    const fileName = pathParts.pop() || relativePath;
    const category = pathParts.length > 0 ? pathParts[0] : 'Root';

    const id = relativePath;
    const colors = extractColorsFromSVG(svgContent);

    layers[id] = {
      id,
      name: fileName,
      path: relativePath,
      category,
      originalSvg: svgContent,
      currentSvg: svgContent,
      colors,
      visible: true,
      locked: false,
      isFavorite: false,
      updatedAt: Date.now()
    };
  }

  return layers;
}

export async function exportProjectZip(layers: Record<string, SVGItem>): Promise<Blob> {
  const zip = new JSZip();

  Object.values(layers).forEach((layer) => {
    zip.file(layer.path, layer.currentSvg);
  });

  return await zip.generateAsync({ type: 'blob' });
}
