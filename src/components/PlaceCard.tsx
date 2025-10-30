import { useState, useCallback, memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Heart, MapPin, DollarSign, Users } from "lucide-react";
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

const PlaceCardComponent = ({ place, onAdd, onFavoriteToggle, onView }: PlaceCardProps) => {
  const [isFavorite, setIsFavorite] = useState(storage.isFavorite(place.id));
  const [showDetails, setShowDetails] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      storage.removeFromFavorites(place.id);
      setIsFavorite(false);
      onFavoriteToggle?.(place, false);
    } else {
      storage.addToFavorites(place);
      setIsFavorite(true);
      onFavoriteToggle?.(place, true);
    }
  }, [isFavorite, place, onFavoriteToggle]);

  const handleCardClick = useCallback(() => {
    onView?.();
    setShowDetails(true);
  }, [onView]);

  const handleAddClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(place);
  }, [onAdd, place]);

  const getPriceLevel = (level?: number) => {
    if (!level) return null;
    return "$".repeat(level);
  };

  const getTypeLabel = (types?: string[]) => {
    if (!types || types.length === 0) return null;
    const type = types[0];
    return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <Card 
        className="group overflow-hidden border-2 border-border/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md hover:-translate-y-2 hover:scale-[1.02] animate-fade-in"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${place.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* Compact Image Header */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={place.photo || getPlaceholder(place.name)}
            alt={`${place.name} - ${place.address}`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2 brightness-90 group-hover:brightness-100"
            loading="lazy"
            onError={(e) => { 
              const img = e.currentTarget as HTMLImageElement;
              img.src = getPlaceholder(place.name); 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-700" />
          
          {/* Compact Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5 transition-all duration-300 group-hover:scale-105">
          {place.rating && (
              <Badge className="bg-white/95 text-foreground border-0 text-xs px-2 py-1 shadow-lg backdrop-blur-sm font-semibold animate-fade-in" aria-label={`Rating: ${place.rating} out of 5`}>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1 animate-pulse" aria-hidden="true" />
                {place.rating}
              </Badge>
            )}
            {place.openNow !== undefined && (
              <Badge className={`text-xs px-2 py-1 shadow-lg backdrop-blur-sm font-semibold animate-fade-in ${
                place.openNow 
                  ? 'bg-emerald-500/95 text-white animate-pulse' 
                  : 'bg-slate-500/95 text-white'
              }`}>
                {place.openNow ? '● Open' : '● Closed'}
              </Badge>
            )}
          </div>

          {/* Distance Badge */}
          {place.distance && (
            <Badge className="absolute bottom-2 right-2 bg-primary/90 text-white text-xs px-2 py-0.5 shadow-md">
              <MapPin className="w-3 h-3 mr-1" />
              {place.distance}mi
            </Badge>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur-md shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
              isFavorite 
                ? 'bg-rose-500/90 hover:bg-rose-600 text-white' 
                : 'bg-white/90 hover:bg-white text-rose-500'
            }`}
            aria-label={isFavorite ? `Remove ${place.name} from favorites` : `Add ${place.name} to favorites`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
          </Button>
        </div>
        
        {/* Compact Content */}
        <CardHeader className="p-4 pb-2 space-y-2">
          <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
            {place.name}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{place.address}</span>
          </div>

          {/* Compact Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            {getTypeLabel(place.types) && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {getTypeLabel(place.types)}
              </Badge>
            )}
            {place.priceLevel && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-emerald-400 text-emerald-600">
                <DollarSign className="w-3 h-3" />
                {getPriceLevel(place.priceLevel)}
              </Badge>
            )}
            {place.userRatingsTotal && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {place.userRatingsTotal > 1000 
                  ? `${(place.userRatingsTotal / 1000).toFixed(1)}k` 
                  : place.userRatingsTotal}
              </span>
            )}
          </div>
        </CardHeader>
        
        {/* Compact Actions */}
        <CardContent className="p-4 pt-0">
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={handleAddClick}
              className="flex-1 h-10 shadow-md hover:shadow-xl transition-all duration-300 font-bold gradient-primary text-xs hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`Add ${place.name} to your plan`}
            >
              <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Add to Plan
            </Button>
            
            <ShareButton 
              placeName={place.name}
              placeAddress={place.address}
              className="flex-1 h-10 text-xs font-semibold hover:scale-105 transition-all duration-300"
            />
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

export const PlaceCard = memo(PlaceCardComponent);
