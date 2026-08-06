export function generateRandomHex(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export function generateHarmonies(baseHex: string): string[] {
  // Simple helper to generate dummy complementary tones for presets
  return [
    baseHex,
    generateRandomHex(),
    generateRandomHex(),
    generateRandomHex()
  ];
}
