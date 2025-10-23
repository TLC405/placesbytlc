export const getPlaceholder = (seed?: string): string => {
  const text = encodeURIComponent(seed || "Place");
  return `https://placehold.co/800x600/E5E7EB/6B7280?text=${text}`;
};
