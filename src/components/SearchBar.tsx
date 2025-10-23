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
    <div className="space-y-5">
      {/* Step 1: Choose Type - REQUIRED FIRST */}
      {onCategoryTypeChange && (
        <div className="space-y-3 p-4 bg-gradient-to-br from-rose/5 to-mauve/5 rounded-xl border-2 border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose to-mauve text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-sm font-bold text-foreground">First, what are you looking for?</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(["food", "activity", "both"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onCategoryTypeChange(type)}
                className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  categoryType === type
                    ? "bg-gradient-to-r from-rose to-mauve text-white shadow-lg scale-105"
                    : "bg-card border-2 border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                {type === "food" && "🍽️ Food"}
                {type === "activity" && "🎯 Activity"}
                {type === "both" && "✨ Both"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Search - Only available after picking type */}
      <div className={`space-y-3 transition-all ${categoryType === "both" ? "opacity-100" : categoryType ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose to-mauve text-white flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-sm font-bold text-foreground">Now search your area</span>
        </div>
        
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
      </div>

      {/* Step 3: Optional Categories */}
      {onCategoryToggle && categoryType && (
        <div className="space-y-3 p-4 bg-gradient-to-br from-mauve/5 to-rose/5 rounded-xl border border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose to-mauve text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-sm font-medium text-foreground">Narrow it down (optional)</span>
          </div>
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