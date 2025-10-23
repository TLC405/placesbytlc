import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UtensilsCrossed, Activity, Sparkles, TrendingUp } from "lucide-react";

interface SearchBarProps {
  query: string;
  radius: string;
  onQueryChange: (query: string) => void;
  onRadiusChange: (radius: string) => void;
  onSearch: () => void;
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

const randomSuggestions = [
  "Rooftop Dining", "Jazz Bar", "Sushi Restaurant", "Comedy Club",
  "Wine Tasting", "Craft Brewery", "Art Gallery", "Sunset Views",
  "Karaoke Night", "French Bistro", "Board Game Cafe", "Live Theater",
  "Waterfront Dining", "Speakeasy Bar", "Tapas Restaurant", "Drive-In Movie"
];

export const SearchBar = ({
  query,
  radius,
  onQueryChange,
  onRadiusChange,
  onSearch,
  disabled,
  loading,
}: SearchBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Get 4 random suggestions
    const shuffled = [...randomSuggestions].sort(() => Math.random() - 0.5);
    setQuickSuggestions(shuffled.slice(0, 4));
  }, []);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onQueryChange(subcategory);
    setTimeout(() => onSearch(), 100);
  };

  const handleQueryChange = (value: string) => {
    // Validate input: max 200 characters
    const sanitized = value.slice(0, 200);
    onQueryChange(sanitized);
  };

  return (
    <div className="space-y-5">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !disabled && onSearch()}
              disabled={disabled || loading}
              className="h-14 pl-12 pr-4 text-base shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-300 border-2 border-border/50 focus:border-primary/50 rounded-2xl bg-card/80 backdrop-blur-sm"
              autoFocus
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

      {/* Quick Suggestions */}
      {quickSuggestions.length > 0 && !loading && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground/80">Trending Searches:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-sm px-4 py-2 text-sm font-medium rounded-full"
                onClick={() => !disabled && !loading && handleSubcategoryClick(suggestion)}
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground/80">Browse by Category:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === "food" ? "default" : "outline"}
            onClick={() => handleCategoryClick("food")}
            disabled={disabled || loading}
            size="lg"
            className="h-14 px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl font-semibold text-base"
          >
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            FOOD
          </Button>
          
          <Button
            variant={selectedCategory === "activity" ? "default" : "outline"}
            onClick={() => handleCategoryClick("activity")}
            disabled={disabled || loading}
            size="lg"
            className="h-14 px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl font-semibold text-base"
          >
            <Activity className="w-5 h-5 mr-2" />
            ACTIVITY
          </Button>
          
          <Button
            variant={selectedCategory === "both" ? "default" : "outline"}
            onClick={() => handleCategoryClick("both")}
            disabled={disabled || loading}
            size="lg"
            className="h-14 px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl font-semibold text-base"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            BOTH
          </Button>
        </div>

        {/* Subcategories */}
        {selectedCategory === "food" && (
          <div className="flex flex-wrap gap-2 animate-fade-in p-4 bg-muted/30 rounded-xl">
            {foodSubcategories.map((sub) => (
              <Badge
                key={sub}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md px-4 py-2 text-sm font-medium rounded-full"
                onClick={() => !disabled && !loading && handleSubcategoryClick(sub)}
              >
                {sub}
              </Badge>
            ))}
          </div>
        )}

        {selectedCategory === "activity" && (
          <div className="flex flex-wrap gap-2 animate-fade-in p-4 bg-muted/30 rounded-xl">
            {activitySubcategories.map((sub) => (
              <Badge
                key={sub}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md px-4 py-2 text-sm font-medium rounded-full"
                onClick={() => !disabled && !loading && handleSubcategoryClick(sub)}
              >
                {sub}
              </Badge>
            ))}
          </div>
        )}

        {selectedCategory === "both" && (
          <div className="space-y-2 animate-fade-in">
            <span className="text-xs text-muted-foreground font-medium pl-1">Mix of food & activities:</span>
            <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-xl">
              {[...foodSubcategories.slice(0, 5), ...activitySubcategories.slice(0, 5)].map((sub) => (
                <Badge
                  key={sub}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md px-4 py-2 text-sm font-medium rounded-full"
                  onClick={() => !disabled && !loading && handleSubcategoryClick(sub)}
                >
                  {sub}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};