import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Settings, UtensilsCrossed, Activity } from "lucide-react";

interface SearchBarProps {
  query: string;
  radius: string;
  onQueryChange: (query: string) => void;
  onRadiusChange: (radius: string) => void;
  onSearch: () => void;
  onUseLocation: () => void;
  onSettings: () => void;
  disabled?: boolean;
  loading?: boolean;
}

type Category = "food" | "activity" | "both" | null;

const foodSubcategories = [
  "Italian", "Mexican", "Asian", "American", "Steakhouse",
  "Pizza", "Burgers", "Seafood", "Dessert", "Coffee",
  "Fine Dining", "Casual", "Fast Food"
];

const activitySubcategories = [
  "Movies", "Live Music", "Bowling", "Arcade",
  "Shopping", "Museums", "Parks", "Outdoors",
  "Sports", "Arts & Crafts", "Escape Rooms"
];

export const SearchBar = ({
  query,
  radius,
  onQueryChange,
  onRadiusChange,
  onSearch,
  onUseLocation,
  onSettings,
  disabled,
  loading,
}: SearchBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onQueryChange(subcategory);
    setTimeout(() => onSearch(), 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search date ideas (e.g., sushi, jazz, arcade)"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && onSearch()}
          disabled={disabled || loading}
          className="flex-1 min-w-[200px] h-11 shadow-sm focus:shadow-md transition-shadow"
          autoFocus
        />
        
        <Select value={radius} onValueChange={onRadiusChange} disabled={disabled || loading}>
          <SelectTrigger className="w-[140px] h-11 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
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
          className={`h-11 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 ${!disabled && !loading ? 'animate-pulse-subtle' : ''}`}
        >
          <Search className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Searching..." : "Search"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onUseLocation} 
          disabled={disabled || loading}
          className="h-11 shadow-sm hover:shadow-md transition-all"
        >
          <MapPin className="w-4 h-4 mr-2" />
          My Location
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSettings}
          className="h-11 w-11 shadow-sm hover:shadow-md transition-all"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Pick a category:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === "food" ? "default" : "outline"}
            onClick={() => handleCategoryClick("food")}
            disabled={disabled || loading}
            className="h-12 px-6 shadow-sm hover:shadow-md transition-all"
          >
            <UtensilsCrossed className="w-4 h-4 mr-2" />
            FOOD
          </Button>
          
          <Button
            variant={selectedCategory === "activity" ? "default" : "outline"}
            onClick={() => handleCategoryClick("activity")}
            disabled={disabled || loading}
            className="h-12 px-6 shadow-sm hover:shadow-md transition-all"
          >
            <Activity className="w-4 h-4 mr-2" />
            ACTIVITY
          </Button>
          
          <Button
            variant={selectedCategory === "both" ? "default" : "outline"}
            onClick={() => handleCategoryClick("both")}
            disabled={disabled || loading}
            className="h-12 px-6 shadow-sm hover:shadow-md transition-all"
          >
            ✨ BOTH
          </Button>
        </div>

        {/* Subcategories */}
        {selectedCategory === "food" && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {foodSubcategories.map((sub) => (
              <Badge
                key={sub}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm px-3 py-1.5"
                onClick={() => !disabled && !loading && handleSubcategoryClick(sub)}
              >
                {sub}
              </Badge>
            ))}
          </div>
        )}

        {selectedCategory === "activity" && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {activitySubcategories.map((sub) => (
              <Badge
                key={sub}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm px-3 py-1.5"
                onClick={() => !disabled && !loading && handleSubcategoryClick(sub)}
              >
                {sub}
              </Badge>
            ))}
          </div>
        )}

        {selectedCategory === "both" && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            <span className="text-xs text-muted-foreground w-full">Mix of food & activities:</span>
            {[...foodSubcategories.slice(0, 5), ...activitySubcategories.slice(0, 5)].map((sub) => (
              <Badge
                key={sub}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm px-3 py-1.5"
                onClick={() => !disabled && !loading && handleSubcategoryClick(sub)}
              >
                {sub}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};