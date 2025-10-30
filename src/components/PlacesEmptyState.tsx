import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PlacesEmptyStateProps {
  onSearch?: () => void;
  message?: string;
}

export const PlacesEmptyState = ({ 
  onSearch, 
  message = "No places found. Try adjusting your search filters." 
}: PlacesEmptyStateProps) => {
  return (
    <Card className="col-span-full border-2 border-dashed border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-accent" />
          </div>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm flex items-center justify-center border-2 border-primary/30 shadow-xl">
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-pulse" aria-hidden="true" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-black gradient-text mb-3 drop-shadow-lg">
          No Places Found
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md font-medium leading-relaxed px-4 mb-6">
          {message}
        </p>
        {onSearch && (
          <Button 
            onClick={onSearch}
            className="gradient-primary font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" aria-hidden="true" />
            Search Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
