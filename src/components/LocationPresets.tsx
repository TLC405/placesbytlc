import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";

interface LocationPresetsProps {
  onSelectLocation: (location: { lat: number; lng: number; name: string }) => void;
  disabled?: boolean;
}

const LOCATIONS = [
  { name: "TLC's Place (South OKC)", lat: 35.4676, lng: -97.5164, icon: "♂️", color: "bg-blue-500" },
  { name: "Felicia's Place (Edmond)", lat: 35.6528, lng: -97.4781, icon: "♀️", color: "bg-pink-500" },
  { name: "Perfect Midpoint", lat: 35.5602, lng: -97.4973, icon: "💕", color: "bg-purple-500" },
];

export const LocationPresets = ({ onSelectLocation, disabled }: LocationPresetsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Search Near:</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LOCATIONS.map((loc) => (
          <Button
            key={loc.name}
            variant="outline"
            onClick={() => onSelectLocation(loc)}
            disabled={disabled}
            className="h-auto py-3 px-4 flex flex-col items-start gap-2 hover:shadow-glow hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center gap-2 w-full">
              <Badge className={`${loc.color} text-white border-0 shadow-sm text-base`}>
                {loc.icon}
              </Badge>
              <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-medium text-left w-full group-hover:text-primary transition-colors">
              {loc.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
