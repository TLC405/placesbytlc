// Reliable placeholder using Picsum with a deterministic seed
export const getPlaceholder = (seed?: string): string => {
  const s = encodeURIComponent(seed || 'date-spot');
  // Deterministic image per place, fixed size for consistent cards
  return `https://picsum.photos/seed/${s}/1200/800`;
};
