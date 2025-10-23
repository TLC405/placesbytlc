import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Phone, Globe, Clock, Plus, ExternalLink } from "lucide-react";
import { PlaceItem } from "@/types";
import { ShareButton } from "./ShareButton";

interface PlaceDetailsModalProps {
  place: PlaceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToPlan: (place: PlaceItem) => void;
}

export const PlaceDetailsModal = ({ place, open, onOpenChange, onAddToPlan }: PlaceDetailsModalProps) => {
  if (!place) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{place.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img
              src={place.photo}
              alt={place.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2">
            {place.rating && (
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {place.rating} ({place.userRatingsTotal} reviews)
              </Badge>
            )}
            {getPriceLevel(place.priceLevel) && (
              <Badge variant="outline">{getPriceLevel(place.priceLevel)}</Badge>
            )}
            {place.openNow !== undefined && (
              <Badge variant={place.openNow ? "default" : "secondary"}>
                <Clock className="w-3 h-3 mr-1" />
                {place.openNow ? "Open Now" : "Closed"}
              </Badge>
            )}
            {getTypeLabel(place.types) && (
              <Badge variant="outline">{getTypeLabel(place.types)}</Badge>
            )}
            {place.distance && (
              <Badge variant="outline">
                <MapPin className="w-3 h-3 mr-1" />
                {place.distance} mi away
              </Badge>
            )}
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </h3>
            <p className="text-muted-foreground">{place.address}</p>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => {
                onAddToPlan(place);
                onOpenChange(false);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Plan
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`;
                window.open(url, '_blank');
              }}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Get Directions
            </Button>

            <ShareButton 
              placeName={place.name}
              placeAddress={place.address}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
