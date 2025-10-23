import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Heart } from "lucide-react";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";

interface PlaceCardProps {
  place: PlaceItem;
  onAdd: (place: PlaceItem) => void;
  onFavoriteToggle?: (place: PlaceItem, isFavorite: boolean) => void;
}

export const PlaceCard = ({ place, onAdd, onFavoriteToggle }: PlaceCardProps) => {
  const [isFavorite, setIsFavorite] = useState(storage.isFavorite(place.id));

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
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={place.photo}
          alt={place.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteClick}
          className={`absolute top-2 left-2 h-8 w-8 rounded-full backdrop-blur-sm transition-colors ${
            isFavorite 
              ? 'bg-rose-500/90 hover:bg-rose-600 text-white' 
              : 'bg-white/90 hover:bg-white text-muted-foreground hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        {place.rating && (
          <Badge className="absolute top-3 right-3 bg-card/90 backdrop-blur">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
            {place.rating}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-base line-clamp-1">{place.name}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">
          {place.address}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="flex items-center justify-between">
          {place.userRatingsTotal && (
            <span className="text-xs text-muted-foreground">
              {place.userRatingsTotal} reviews
            </span>
          )}
          <Button 
            size="sm" 
            onClick={() => onAdd(place)}
            className="ml-auto"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
