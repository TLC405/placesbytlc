import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Check } from "lucide-react";

interface LocationPresetsProps {
  onSelectLocation: (location: { lat: number; lng: number; name: string }) => void;
  disabled?: boolean;
  currentLocation?: { lat: number; lng: number };
}

const LOCATIONS = [
  { name: "TLC's Place (South OKC)", lat: 35.4676, lng: -97.5164, icon: "♂️", color: "bg-blue-500" },
  { name: "Felicia's Place (Edmond)", lat: 35.6528, lng: -97.4781, icon: "♀️", color: "bg-pink-500" },
  { name: "Perfect Midpoint", lat: 35.5602, lng: -97.4973, icon: "💕", color: "bg-purple-500" },
];

export const LocationPresets = ({ onSelectLocation, disabled, currentLocation }: LocationPresetsProps) => {
  const isActive = (loc: typeof LOCATIONS[0]) => {
    if (!currentLocation) return false;
    return Math.abs(currentLocation.lat - loc.lat) < 0.01 && Math.abs(currentLocation.lng - loc.lng) < 0.01;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-sm font-semibold text-foreground">Search Near:</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LOCATIONS.map((loc) => {
          const active = isActive(loc);
          return (
            <Button
              key={loc.name}
              variant={active ? "default" : "outline"}
              onClick={() => onSelectLocation(loc)}
              disabled={disabled}
              className={`h-auto py-3 px-4 flex flex-col items-start gap-2 transition-all duration-300 hover:scale-105 group relative ${
                active ? 'shadow-glow ring-2 ring-primary/20' : 'hover:shadow-glow hover:border-primary/50'
              }`}
            >
              {active && (
                <Check className="absolute top-2 right-2 w-4 h-4 text-primary-foreground animate-in zoom-in" />
              )}
              <div className="flex items-center gap-2 w-full">
                <Badge className={`${loc.color} text-white border-0 shadow-sm text-base`}>
                  {loc.icon}
                </Badge>
                <MapPin className={`w-4 h-4 transition-colors ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
              </div>
              <span className={`text-xs font-medium text-left w-full transition-colors ${active ? 'text-primary-foreground' : 'group-hover:text-primary'}`}>
                {loc.name}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
