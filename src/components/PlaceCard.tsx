import { useState } from "react";
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
        className="group overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer bg-card/80 backdrop-blur-sm"
        onClick={() => {
          onView?.();
          setShowDetails(true);
        }}
      >
        {/* Compact Image Header */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={place.photo}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = getPlaceholder(place.name); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Compact Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {place.rating && (
              <Badge className="bg-white/90 text-foreground border-0 text-xs px-2 py-0.5 shadow-md">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                {place.rating}
              </Badge>
            )}
            {place.openNow !== undefined && (
              <Badge className={`text-xs px-2 py-0.5 shadow-md ${
                place.openNow 
                  ? 'bg-emerald-500/90 text-white' 
                  : 'bg-slate-500/90 text-white'
              }`}>
                {place.openNow ? 'Open' : 'Closed'}
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
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteClick();
            }}
            className={`absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur-md shadow-lg transition-all ${
              isFavorite 
                ? 'bg-rose-500/90 hover:bg-rose-600 text-white' 
                : 'bg-white/90 hover:bg-white text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {/* Compact Content */}
        <CardHeader className="p-3 pb-2 space-y-2">
          <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
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
        <CardContent className="p-3 pt-0">
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(place);
              }}
              className="flex-1 h-9 shadow-sm hover:shadow-md transition-all font-semibold gradient-primary text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add to Plan
            </Button>
            
            <ShareButton 
              placeName={place.name}
              placeAddress={place.address}
              className="flex-1 h-9 text-xs"
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
