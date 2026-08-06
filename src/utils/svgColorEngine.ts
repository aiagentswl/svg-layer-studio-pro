export function extractColorsFromSVG(svgContent: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const colors = new Set<string>();

  const processNode = (node: Element) => {
    // Check attributes
    ['fill', 'stroke', 'stop-color'].forEach((attr) => {
      const val = node.getAttribute(attr);
      if (val && val !== 'none' && !val.startsWith('url(')) {
        colors.add(val.toLowerCase());
      }
    });

    // Check style attribute
    const style = node.getAttribute('style');
    if (style) {
      const fillMatch = style.match(/fill:\s*([^;]+)/i);
      const strokeMatch = style.match(/stroke:\s*([^;]+)/i);
      if (fillMatch && fillMatch[1] !== 'none') colors.add(fillMatch[1].trim().toLowerCase());
      if (strokeMatch && strokeMatch[1] !== 'none') colors.add(strokeMatch[1].trim().toLowerCase());
    }

    Array.from(node.children).forEach(processNode);
  };

  processNode(doc.documentElement);
  return Array.from(colors);
}

export function replaceSVGColor(svgContent: string, targetColor: string, newColor: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');

  const normalize = (c: string) => c.toLowerCase().trim();
  const target = normalize(targetColor);

  const processNode = (node: Element) => {
    ['fill', 'stroke', 'stop-color'].forEach((attr) => {
      const val = node.getAttribute(attr);
      if (val && normalize(val) === target) {
        node.setAttribute(attr, newColor);
      }
    });

    // Handle inline style attributes
    const style = node.getAttribute('style');
    if (style) {
      let updatedStyle = style;
      const regexFill = new RegExp(`fill:\\s*${targetColor}`, 'gi');
      const regexStroke = new RegExp(`stroke:\\s*${targetColor}`, 'gi');
      updatedStyle = updatedStyle.replace(regexFill, `fill: ${newColor}`);
      updatedStyle = updatedStyle.replace(regexStroke, `stroke: ${newColor}`);
      node.setAttribute('style', updatedStyle);
    }

    Array.from(node.children).forEach(processNode);
  };

  processNode(doc.documentElement);
  return new XMLSerializer().serializeToString(doc.documentElement);
}

export function applyPaletteToSVG(svgContent: string, paletteMap: Record<string, string>): string {
  let updated = svgContent;
  Object.entries(paletteMap).forEach(([oldColor, newColor]) => {
    updated = replaceSVGColor(updated, oldColor, newColor);
  });
  return updated;
}
