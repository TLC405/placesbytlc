import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Star, Heart } from "lucide-react";

interface FilterBarProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  resultCount: number;
}

export const FilterBar = ({ 
  sortBy, 
  onSortChange, 
  showFavoritesOnly, 
  onToggleFavorites,
  resultCount 
}: FilterBarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/50 bg-card/50">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? 'place' : 'places'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={onToggleFavorites}
          className="gap-2"
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Favorites
        </Button>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Relevance
              </div>
            </SelectItem>
            <SelectItem value="rating">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Highest Rated
              </div>
            </SelectItem>
            <SelectItem value="reviews">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Most Reviewed
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
