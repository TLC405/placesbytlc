import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  radius: string;
  onQueryChange: (query: string) => void;
  onRadiusChange: (radius: string) => void;
  onSearch: () => void;
  disabled?: boolean;
  loading?: boolean;
  selectedCategories?: string[];
  onCategoryToggle?: (category: string) => void;
  categoryType?: "food" | "activity" | "both";
  onCategoryTypeChange?: (type: "food" | "activity" | "both") => void;
}

const CATEGORY_OPTIONS = [
  { label: "Restaurants", value: "restaurant" },
  { label: "Cafes", value: "cafe" },
  { label: "Bars", value: "bar" },
  { label: "Parks", value: "park" },
  { label: "Museums", value: "museum" },
  { label: "Movies", value: "movie_theater" },
  { label: "Shopping", value: "shopping_mall" },
  { label: "Art Galleries", value: "art_gallery" },
];

export const SearchBar = ({
  query,
  radius,
  onQueryChange,
  onRadiusChange,
  onSearch,
  disabled,
  loading,
  selectedCategories = [],
  onCategoryToggle,
  categoryType = "both",
  onCategoryTypeChange,
}: SearchBarProps) => {
  const handleQueryChange = (value: string) => {
    const sanitized = value.slice(0, 200);
    onQueryChange(sanitized);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search nearby date spots..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !disabled && onSearch()}
            disabled={disabled || loading}
            className="h-14 pl-12 pr-4 text-base shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-300 border-2 border-border/50 focus:border-primary/50 rounded-2xl bg-card/80 backdrop-blur-sm"
            maxLength={200}
          />
        </div>
        
        <Select value={radius} onValueChange={onRadiusChange} disabled={disabled || loading}>
          <SelectTrigger className="w-[160px] h-14 shadow-lg rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all bg-card/80 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1609">1 mile</SelectItem>
            <SelectItem value="3219">2 miles</SelectItem>
            <SelectItem value="8047">5 miles</SelectItem>
            <SelectItem value="16093">10 miles</SelectItem>
            <SelectItem value="32187">20 miles</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={onSearch} 
          disabled={disabled || loading}
          size="lg"
          className="h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl text-base font-semibold gradient-primary"
        >
          <Search className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {onCategoryTypeChange && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Type:</span>
          <div className="flex gap-2">
            {(["food", "activity", "both"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onCategoryTypeChange(type)}
                className={`pill text-sm transition-all ${
                  categoryType === type
                    ? "bg-gradient-to-r from-rose to-mauve text-white shadow-md"
                    : "hover:shadow-md"
                }`}
              >
                {type === "both" ? "Both" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {onCategoryToggle && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Quick Categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORY_OPTIONS.map((category) => {
              const isSelected = selectedCategories.includes(category.value);
              return (
                <Badge
                  key={category.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 justify-center py-2 ${
                    isSelected ? "shadow-md" : ""
                  }`}
                  onClick={() => !disabled && !loading && onCategoryToggle(category.value)}
                >
                  {category.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};