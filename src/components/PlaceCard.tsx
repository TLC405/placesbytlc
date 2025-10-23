import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Heart, MapPin, Clock } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { ShareButton } from "./ShareButton";
import { PlaceDetailsModal } from "./PlaceDetailsModal";
import { getPlaceholder } from "@/lib/placeholders";

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
        className="shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border-2 border-border/30 hover:border-primary/60 animate-fade-in cursor-pointer hover:-translate-y-2 rounded-2xl bg-card/95 backdrop-blur-sm"
        onClick={() => {
          onView?.();
          setShowDetails(true);
        }}
      >
        <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={place.photo}
          alt={place.name}
          className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = getPlaceholder(place.name); }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick();
          }}
          className={`absolute top-4 left-4 h-11 w-11 rounded-full backdrop-blur-lg transition-all duration-300 shadow-xl border-2 ${
            isFavorite 
              ? 'bg-rose-500/95 hover:bg-rose-600 text-white scale-110 border-rose-400' 
              : 'bg-white/95 hover:bg-white text-muted-foreground hover:text-rose-500 border-white/50'
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </Button>

        <div className="absolute top-4 right-4 flex flex-col gap-2.5">
          {place.rating && (
            <Badge className="bg-white/95 backdrop-blur-lg text-foreground border-2 border-white/50 shadow-xl px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1.5" />
              <span className="font-bold text-base">{place.rating}</span>
            </Badge>
          )}
          
          {place.openNow !== undefined && (
            <Badge className={`backdrop-blur-lg border-2 shadow-xl px-3 py-1.5 rounded-full font-semibold ${
              place.openNow 
                ? 'bg-emerald-500/95 text-white border-emerald-400' 
                : 'bg-slate-500/95 text-white border-slate-400'
            }`}>
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {place.openNow ? 'Open Now' : 'Closed'}
            </Badge>
          )}
        </div>

        {place.distance && (
          <Badge className="absolute bottom-4 left-4 bg-primary/95 backdrop-blur-lg text-primary-foreground border-2 border-primary-foreground/30 shadow-xl px-3 py-1.5 rounded-full font-semibold">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            {place.distance} mi away
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-4 space-y-4 pt-5">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {place.name}
          </CardTitle>
        </div>
        
        <CardDescription className="text-sm line-clamp-2 flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span className="leading-relaxed font-medium">{place.address}</span>
        </CardDescription>

        <div className="flex flex-wrap gap-2.5">
          {getTypeLabel(place.types) && (
            <Badge variant="secondary" className="text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {getTypeLabel(place.types)}
            </Badge>
          )}
          {place.priceLevel && (
            <Badge variant="outline" className="text-sm font-bold text-emerald-700 dark:text-emerald-400 border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-full shadow-sm">
              {getPriceLevel(place.priceLevel)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-5">
        <div className="flex flex-col gap-4">
          {place.userRatingsTotal && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm text-muted-foreground font-semibold">
                {place.userRatingsTotal.toLocaleString()} reviews
              </span>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              size="lg" 
              onClick={(e) => {
                e.stopPropagation();
                onAdd(place);
              }}
              className="flex-1 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-bold rounded-xl h-12 gradient-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Plan
            </Button>
            
            <ShareButton 
              placeName={place.name}
              placeAddress={place.address}
              className="flex-1 shadow-md hover:shadow-xl h-12"
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