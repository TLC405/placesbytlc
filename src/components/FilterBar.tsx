import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  resultCount: number;
}

export const FilterBar = ({
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onToggleFavorites,
  resultCount,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-soft">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            {resultCount} {resultCount === 1 ? 'place' : 'places'} found
          </span>
        </div>
        
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={onToggleFavorites}
          className="shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          {showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] h-9 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviewed</SelectItem>
            <SelectItem value="distance">Nearest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
