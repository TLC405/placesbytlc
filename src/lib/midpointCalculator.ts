export interface Location {
  lat: number;
  lng: number;
  label?: string;
}

/**
 * Calculate the geographic midpoint between two locations
 */
export function calculateMidpoint(loc1: Location, loc2: Location): Location {
  return {
    lat: (loc1.lat + loc2.lat) / 2,
    lng: (loc1.lng + loc2.lng) / 2,
    label: 'Perfect Midpoint'
  };
}

/**
 * Calculate distance between two points using Haversine formula (in miles)
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if two locations are the same
 */
export function isSameLocation(loc1: Location | null, loc2: Location | null): boolean {
  if (!loc1 || !loc2) return false;
  return Math.abs(loc1.lat - loc2.lat) < 0.0001 && Math.abs(loc1.lng - loc2.lng) < 0.0001;
}

/**
 * Get saved locations from localStorage
 */
export interface SavedLocations {
  myPlace: Location | null;
  partnerPlace: Location | null;
}

const STORAGE_KEY = 'felicia_saved_locations';

export function getSavedLocations(): SavedLocations {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading saved locations:', error);
  }
  return { myPlace: null, partnerPlace: null };
}

export function saveLocation(type: 'myPlace' | 'partnerPlace', location: Location): void {
  try {
    const saved = getSavedLocations();
    saved[type] = location;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (error) {
    console.error('Error saving location:', error);
  }
}

export function clearSavedLocations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved locations:', error);
  }
}
