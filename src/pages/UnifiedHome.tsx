import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Sparkles,
  Download,
  Heart,
  Palette,
  Users2,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { PlaceItem } from "@/types";
import { trackPlaceView, trackPlaceSave, trackSearch } from "@/components/ActivityTracker";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { StyleGallery } from "@/components/cartoon/StyleGallery";
import { CartoonToHumanGenerator } from "@/components/cartoon/CartoonToHumanGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { HeroSection } from "@/components/organisms/HeroSection";
import { NavigationBar } from "@/components/organisms/NavigationBar";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { AppLogo } from "@/components/AppLogo";

export default function UnifiedHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<"food" | "activity" | "both">("both");

  const { location } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => toast.error(message),
  });

  const handleSearch = () => {
    if (!categoryType || (categoryType === "both" && !query.trim() && selectedCategories.length === 0)) {
      toast.error("Pick Food, Activity, or Both first!");
      return;
    }
    if (!location) {
      toast.error("Location not available. Enable location services.");
      return;
    }
    const searchQuery = selectedCategories.length > 0 ? selectedCategories[0] : categoryType;
    search(searchQuery, location, parseInt(radius, 10));
    trackSearch(searchQuery, { radius, location, categoryType });
  };

  const handleAddToPlan = (place: PlaceItem) => {
    const existing = storage.getPlan();
    if (existing.some((p) => p.id === place.id)) {
      toast.info("Already in your plan!");
      return;
    }
    storage.addToPlan(place);
    trackPlaceSave(place);
    toast.success(`${place.name} added to plan!`);
  };

  const downloadApp = () => {
    toast.info("Preparing app download...");
    window.open(window.location.origin + "/export/complete-app.zip", "_blank");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation */}
      <NavigationBar
        logo={
          <div className="flex items-center gap-2">
            <AppLogo />
            <span className="font-black text-xl text-foreground">TLC Places</span>
          </div>
        }
        actions={<DarkModeToggle />}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-12 space-y-16">
        {/* Hero */}
        <HeroSection
          title="Your Love & Adventure Hub"
          description="Discover perfect date spots, create identity-locked cartoons, transform toons to humans"
          actions={
            <>
              <Button
                size="lg"
                onClick={() => user ? navigate("/cartoonifier") : navigate("/auth")}
                className="h-14 px-8 font-bold text-lg"
              >
                <Palette className="w-6 h-6 mr-2" />
                Start Creating
              </Button>
              <Button
                size="lg"
                onClick={downloadApp}
                variant="outline"
                className="h-14 px-8 font-bold text-lg"
              >
                <Download className="w-6 h-6 mr-2" />
                Download App
              </Button>
            </>
          }
        />

        {/* Cartoonifier Section */}
        <section id="cartoonifier" className="space-y-6">
          <SectionHeader
            title="Human → Cartoon"
            description="Transform photos into 12 TV-inspired cartoon styles"
            icon={Palette}
          />

          <Card className="border-2 border-border shadow-lg">
            <CardContent className="pt-6">
              <StyleGallery selectedStyle="" onStyleSelect={(style) => navigate("/cartoonifier")} />
              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  onClick={() => user ? navigate("/cartoonifier") : navigate("/auth")}
                  className="h-14 px-12 font-bold text-lg"
                >
                  Try Full Cartoonifier →
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Toon2Human Section - NEW FEATURE */}
        <section id="toon2human" className="space-y-6">
          <SectionHeader
            title="Cartoon → Realistic Human"
            description="Transform cartoon characters into hyper-realistic humans wearing character-inspired outfits"
            icon={Users2}
            emoji="✨"
          />

          <Card className="border-2 border-border shadow-lg">
            <CardContent className="pt-6">
              {user ? (
                <CartoonToHumanGenerator />
              ) : (
                <div className="text-center py-12 space-y-4">
                  <Users2 className="w-20 h-20 text-primary mx-auto" />
                  <p className="text-muted-foreground text-lg font-medium">Sign in to use Toon2Human generator</p>
                  <Button size="lg" onClick={() => navigate("/auth")}>
                    Sign In to Generate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Places Search Section */}
        <section id="places" className="space-y-6">
          <SectionHeader
            title="Discover Perfect Spots"
            description="Find restaurants, activities, and date ideas near you"
            icon={MapPin}
          />

          <Card className="border-2 border-border shadow-lg">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Search for Places</h3>
              </div>
              <SearchBar
                query={query}
                radius={radius}
                onQueryChange={setQuery}
                onRadiusChange={setRadius}
                onSearch={handleSearch}
                disabled={false}
                loading={isSearching}
                selectedCategories={selectedCategories}
                onCategoryToggle={(cat) => setSelectedCategories([cat])}
                categoryType={categoryType}
                onCategoryTypeChange={setCategoryType}
                onLocationModeChange={(mode) =>
                  toast.success(`Searching from ${mode === "tlc" ? "TLC Place" : mode === "partner" ? "Partner Place" : "Middle Ground"}!`)
                }
              />
            </CardContent>
          </Card>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-3xl font-bold text-foreground">{results.length} Places Found 🎉</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((place) => (
                  <PlaceCard key={place.id} place={place} onAdd={handleAddToPlan} onView={() => trackPlaceView(place)} />
                ))}
              </div>
            </div>
          )}

          {results.length === 0 && !isSearching && (
            <EmptyState icon={Heart} title="Start Your Search" description="Choose your preferences above and discover amazing date spots" />
          )}
        </section>

        {/* Footer */}
        <section className="text-center space-y-6 pt-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-foreground">Ready to Begin?</h2>
            <p className="text-muted-foreground text-lg">Create magical memories with TLC Places</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="h-14 px-8 font-bold text-lg">
              <Heart className="w-6 h-6 mr-2" />
              Get Started
            </Button>
            <Button size="lg" onClick={downloadApp} variant="outline" className="h-14 px-8 font-bold text-lg">
              <Download className="w-6 h-6 mr-2" />
              Download App
            </Button>
          </div>

          <div className="text-muted-foreground text-sm pt-6">
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-primary text-primary" />
              Made with love by TLC
              <Heart className="w-4 h-4 fill-primary text-primary" />
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
