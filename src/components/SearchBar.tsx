import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Settings } from "lucide-react";

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
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search date ideas (e.g., sushi, jazz, arcade)"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && onSearch()}
          disabled={disabled || loading}
          className="flex-1 min-w-[200px]"
        />
        
        <Select value={radius} onValueChange={onRadiusChange} disabled={disabled || loading}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">2 km</SelectItem>
            <SelectItem value="5000">5 km</SelectItem>
            <SelectItem value="10000">10 km</SelectItem>
            <SelectItem value="20000">20 km</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onSearch} disabled={disabled || loading}>
          <Search className="w-4 h-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
        
        <Button variant="outline" onClick={onUseLocation} disabled={disabled || loading}>
          <MapPin className="w-4 h-4 mr-2" />
          My Location
        </Button>

        <Button variant="ghost" size="icon" onClick={onSettings}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
