import React, { useState } from "react";
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
  Film,
  Music2,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { PlaceItem } from "@/types";
import {
  trackPlaceView,
  trackPlaceSave,
  trackSearch,
} from "@/components/ActivityTracker";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { StyleGallery } from "@/components/cartoon/StyleGallery";
import { CartoonToHumanGenerator } from "@/components/cartoon/CartoonToHumanGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationBar } from "@/components/organisms/NavigationBar";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { AppLogo } from "@/components/AppLogo";

export default function UnifiedHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Places search state
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<"food" | "activity" | "both">(
    "both"
  );

  const { location } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => toast.error(message),
  });

  const handleSearch = () => {
    if (
      !categoryType ||
      (categoryType === "both" &&
        !query.trim() &&
        selectedCategories.length === 0)
    ) {
      toast.error("Pick Food, Activity, or Both first!");
      return;
    }
    if (!location) {
      toast.error("Location not available. Enable location services.");
      return;
    }
    const searchQuery =
      selectedCategories.length > 0 ? selectedCategories[0] : categoryType;
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
    window.open(
      window.location.origin + "/export/complete-app.zip",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cartoon Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl floating-cartoon" />
        <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-accent/5 blur-3xl floating-cartoon" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 left-1/3 w-36 h-36 rounded-full bg-primary/5 blur-3xl floating-cartoon" style={{animationDelay: '2s'}} />
      </div>

      {/* Premium Header */}
      <header className="border-b-2 border-primary/20 backdrop-blur-xl sticky top-0 z-50 bg-background/90 premium-glow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="sticker-effect">
                <AppLogo />
              </div>
              <div>
                <h1 className="text-3xl cartoon-text text-foreground">TeeFeeMe Studios</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="cartoon-badge">Premium</span>
                  <p className="text-xs text-muted-foreground font-semibold">Create • Transform • Share</p>
                </div>
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Premium Hero Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto text-center space-y-10 pop-in">
          <div className="space-y-6">
            <div className="inline-block mb-4">
              <span className="cartoon-badge text-base">✨ AI-Powered Creativity ✨</span>
            </div>
            <h2 className="text-7xl cartoon-text text-foreground leading-tight">
              Transform Your World<br />
              <span className="text-primary">Into Pure Magic</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-semibold">
              Face-locked cartoonification • Hyper-realistic transformations • Epic place discovery
            </p>
          </div>
          <div className="flex gap-6 justify-center flex-wrap">
            <Button 
              size="lg" 
              variant="premium" 
              className="text-xl px-12 py-8"
              onClick={() => user ? navigate("/cartoonifier") : navigate("/auth")}
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Creating Now
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-12 py-8" onClick={downloadApp}>
              <Download className="w-6 h-6 mr-3" />
              Download Premium App
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Feature Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Cartoonifier Card */}
            <div className="premium-card p-8 pop-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🎨</span>
                <h3 className="text-2xl font-black text-foreground">Face-Lock Studio</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Transform into 12 TV cartoon styles with perfect identity preservation
              </p>
              <Button 
                className="w-full"
                onClick={() => user ? navigate("/cartoonifier") : navigate("/auth")}
              >
                <Palette className="w-5 h-5 mr-2" />
                Open Studio
              </Button>
            </div>

            {/* Toon2Human Card */}
            <div className="premium-card p-8 pop-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">👤</span>
                <h3 className="text-2xl font-black text-foreground">Toon2Human</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                SpongeBob → Real person in yellow shirt • Any cartoon → Reality
              </p>
              <CartoonToHumanGenerator />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Places Section */}
      <section id="places" className="py-20 px-4 relative">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="text-5xl">📍</span>
              <h3 className="text-5xl cartoon-text text-foreground">Discover Epic Places</h3>
              <span className="text-5xl">🗺️</span>
            </div>
            <p className="text-xl text-muted-foreground font-semibold max-w-2xl mx-auto">
              AI-powered date spot finder • Real-time recommendations • Perfect for any vibe
            </p>
          </div>
          <div className="max-w-5xl mx-auto premium-card p-8">
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
                toast.success(
                  `Searching from ${
                    mode === "tlc"
                      ? "TLC Place"
                      : mode === "partner"
                      ? "Partner Place"
                      : "Middle Ground"
                  }!`
                )
              }
            />
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-3xl font-bold text-foreground">
                  {results.length} Places Found 🎉
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onAdd={handleAddToPlan}
                    onView={() => trackPlaceView(place)}
                  />
                ))}
              </div>
            </div>
          )}

          {results.length === 0 && !isSearching && (
            <EmptyState
              icon={Heart}
              title="Start Your Search"
              description="Choose your preferences above and discover amazing date spots"
            />
          )}
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t-2 border-primary/20 py-16 px-4 bg-card/50 backdrop-blur-xl relative premium-glow mt-20">
        <div className="container mx-auto text-center space-y-8">
          <div className="premium-gradient-border inline-block">
            <Button size="lg" variant="premium" className="text-xl px-12 py-8" onClick={downloadApp}>
              <Download className="w-6 h-6 mr-3" />
              Download Premium App
            </Button>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-semibold flex items-center justify-center gap-2">
              <span>🔒</span>
              Face-Lock Technology • AI Powered • Premium Quality
              <span>✨</span>
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 TeeFeeMe Studios • Made with 💚 by Lord TLC 👑
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
