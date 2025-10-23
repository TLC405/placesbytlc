import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Heart, MapPin, Clock } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { ShareButton } from "./ShareButton";
import { PlaceDetailsModal } from "./PlaceDetailsModal";

interface PlaceCardProps {
  place: PlaceItem;
  onAdd: (place: PlaceItem) => void;
  onFavoriteToggle?: (place: PlaceItem, isFavorite: boolean) => void;
  onView?: () => void;
}

export const PlaceCard = ({ place, onAdd, onFavoriteToggle, onView }: PlaceCardProps) => {
  const [isFavorite, setIsFavorite] = useState(storage.isFavorite(place.id));
  const [showDetails, setShowDetails] = useState(false);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      storage.removeFromFavorites(place.id);
      setIsFavorite(false);
      onFavoriteToggle?.(place, false);
    } else {
      storage.addToFavorites(place);
      setIsFavorite(true);
      onFavoriteToggle?.(place, true);
    }
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return "Price not listed";
    return "$".repeat(level) + "  •  " + ["Budget-Friendly", "Moderate", "Upscale", "Luxury"][level - 1];
  };

  const getTypeLabel = (types?: string[]) => {
    if (!types || types.length === 0) return null;
    
    const priorityTypes = [
      "restaurant", "cafe", "bar", "night_club", "movie_theater", 
      "park", "museum", "art_gallery", "shopping_mall", "spa"
    ];
    
    const type = types.find(t => priorityTypes.includes(t)) || types[0];
    return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <Card 
        className="shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden border border-border/50 hover:border-primary/50 animate-fade-in cursor-pointer hover:-translate-y-1"
        onClick={() => {
          onView?.();
          setShowDetails(true);
        }}
      >
        <div className="relative overflow-hidden">
        <img
          src={place.photo}
          alt={place.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick();
          }}
          className={`absolute top-3 left-3 h-9 w-9 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
            isFavorite 
              ? 'bg-rose-500/95 hover:bg-rose-600 text-white scale-110' 
              : 'bg-white/95 hover:bg-white text-muted-foreground hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </Button>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {place.rating && (
            <Badge className="bg-white/95 backdrop-blur-md text-foreground border-0 shadow-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-semibold">{place.rating}</span>
            </Badge>
          )}
          
          {place.openNow !== undefined && (
            <Badge className={`backdrop-blur-md border-0 shadow-md ${
              place.openNow 
                ? 'bg-emerald-500/95 text-white' 
                : 'bg-slate-500/95 text-white'
            }`}>
              <Clock className="w-3 h-3 mr-1" />
              {place.openNow ? 'Open' : 'Closed'}
            </Badge>
          )}
        </div>

        {place.distance && (
          <Badge className="absolute bottom-3 left-3 bg-primary/95 backdrop-blur-md text-primary-foreground border-0 shadow-md">
            <MapPin className="w-3 h-3 mr-1" />
            {place.distance} mi
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {place.name}
          </CardTitle>
        </div>
        
        <CardDescription className="text-xs line-clamp-2 flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
          <span className="leading-relaxed">{place.address}</span>
        </CardDescription>

        <div className="flex flex-wrap gap-2">
          {getTypeLabel(place.types) && (
            <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
              {getTypeLabel(place.types)}
            </Badge>
          )}
          {place.priceLevel && (
            <Badge variant="outline" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1">
              {getPriceLevel(place.priceLevel)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {place.userRatingsTotal && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                {place.userRatingsTotal.toLocaleString()} reviews
              </span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onAdd(place);
              }}
              className="flex-1 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add to Plan
            </Button>
            
            <ShareButton 
              placeName={place.name}
              placeAddress={place.address}
              className="flex-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <PlaceDetailsModal
      place={place}
      open={showDetails}
      onOpenChange={setShowDetails}
      onAddToPlan={onAdd}
    />
  </>
  );
};