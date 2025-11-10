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
import { trackPlaceView, trackPlaceSave, trackSearch } from "@/components/ActivityTracker";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { StyleGallery } from "@/components/cartoon/StyleGallery";
import { CartoonToHumanGenerator } from "@/components/cartoon/CartoonToHumanGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationBar } from "@/components/organisms/NavigationBar";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { AppLogo } from "@/components/AppLogo";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Places search state
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
      {/* NAV */}
      <NavigationBar
        logo={
          <div className="flex items-center gap-2">
            <AppLogo />
            <span className="font-black text-xl text-foreground">TeeFeeMe Studios</span>
          </div>
        }
        actions={<DarkModeToggle />}
      />

      {/* ANIMATED BACKDROP */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute w-[38rem] h-[38rem] rounded-full blur-3xl bg-lime-500/15 top-[-6rem] left-1/2 -translate-x-1/2 animate-pulse" />
        <div className="absolute w-[32rem] h-[32rem] rounded-full blur-3xl bg-fuchsia-500/10 bottom-[-8rem] right-[-6rem] animate-pulse" />
        <div className="absolute w-[26rem] h-[26rem] rounded-full blur-3xl bg-cyan-500/10 bottom-[-10rem] left-[-6rem] animate-pulse" />
      </div>

      {/* HERO */}
      <header className="relative max-w-7xl mx-auto px-4 pt-24 pb-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Where Every Pixel <span className="text-lime-400">Sings</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Nano paints. Veo moves. SoniQ sings. Built by <span className="font-bold">Lord TLC 👑</span>.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <Button
            onClick={() => (user ? navigate("/cartoonifier") : navigate("/auth"))}
            className="h-16 rounded-2xl bg-lime-500/20 hover:bg-lime-500/40 border border-lime-400/40 font-bold"
          >
            <Palette className="w-5 h-5 mr-2" /> Nano DeX
          </Button>
          <Button
            onClick={() => (user ? navigate("/veo") : navigate("/auth"))}
            className="h-16 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 font-bold"
          >
            <Film className="w-5 h-5 mr-2" /> Veo DeX
          </Button>
          <Button
            onClick={() => (user ? navigate("/soniq") : navigate("/auth"))}
            className="h-16 rounded-2xl bg-fuchsia-500/20 hover:bg-fuchsia-500/40 border border-fuchsia-400/40 font-bold"
          >
            <Music2 className="w-5 h-5 mr-2" /> SoniQ Forge
          </Button>
          <Button
            variant="outline"
            onClick={downloadApp}
            className="h-16 rounded-2xl font-bold"
          >
            <Download className="w-5 h-5 mr-2" /> Download App
          </Button>
        </div>

        {/* MINI PREVIEW STRIP */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <Card className="border-2 border-border/60">
            <CardContent className="p-4">
              <div className="text-sm font-semibold mb-2 text-foreground">Human → Cartoon</div>
              <StyleGallery selectedStyle="" onStyleSelect={() => (user ? navigate("/cartoonifier") : navigate("/auth"))} />
              <div className="mt-3 text-right">
                <Button size="sm" onClick={() => (user ? navigate("/cartoonifier") : navigate("/auth"))}>
                  Try Cartoonifier →
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/60">
            <CardContent className="p-4">
              <div className="text-sm font-semibold mb-2 text-foreground">Cartoon → Human</div>
              {user ? (
                <CartoonToHumanGenerator />
              ) : (
                <div className="text-center py-8 space-y-3">
                  <Users2 className="w-10 h-10 text-primary mx-auto" />
                  <p className="text-sm text-muted-foreground">Sign in to use Toon2Human</p>
                  <Button size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-border/60">
            <CardContent className="p-4">
              <div className="text-sm font-semibold mb-3 text-foreground">Decade Styles Timeline</div>
              <div className="text-sm text-muted-foreground">
                Tap a decade to auto-load style + music in the Studio.
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => navigate("/timeline")}>
                  Open Timeline →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* PLACES SEARCH */}
      <section id="places" className="relative max-w-7xl mx-auto px-4 pb-10 space-y-6">
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
                toast.success(
                  `Searching from ${
                    mode === "tlc" ? "TLC Place" : mode === "partner" ? "Partner Place" : "Middle Ground"
                  }!`
                )
              }
            />
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-3xl font-bold text-foreground">{results.length} Places Found 🎉</h3>
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
      </section>

      {/* FOOTER */}
      <footer className="text-center space-y-6 pb-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">Ready to Begin?</h2>
          <p className="text-muted-foreground text-sm">Create magical memories with TeeFeeMe Studios</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")} className="h-12 px-6 font-bold">
            <Heart className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button size="lg" onClick={downloadApp} variant="outline" className="h-12 px-6 font-bold">
            <Download className="w-5 h-5 mr-2" />
            Download App
          </Button>
        </div>
        <div className="text-muted-foreground text-xs pt-2">
          <p className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-primary text-primary" />
            Made with love by Lord TLC 👑
            <Heart className="w-4 h-4 fill-primary text-primary" />
          </p>
        </div>
      </footer>
    </div>
  );
}              <SearchBar
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
        <section className="text-centdder space-y-6 pt-12">
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
