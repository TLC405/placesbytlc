import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Sparkles, Crown, Calendar, Users, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PlaceItem } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { EmptyState } from "@/components/EmptyState";
import { usePlacesSearch } from "@/hooks/usePlacesSearch";
import { useGeolocation } from "@/hooks/useGeolocation";
import { trackPlaceView, trackPlaceSave, trackSearch } from "@/components/ActivityTracker";
import { AuthPanel } from "@/components/AuthPanel";
import { supabase } from "@/integrations/supabase/client";

export default function NewHome() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047");
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<"food" | "activity" | "both">("both");

  const { location, setCustomLocation } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => setError(message),
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToPlan = useCallback((place: PlaceItem) => {
    const existing = storage.getPlan();
    if (existing.some((p) => p.id === place.id)) {
      toast.info("Already in your plan!");
      return;
    }
    
    storage.addToPlan(place);
    trackPlaceSave(place);
    toast.success(`${place.name} added to plan!`);
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories([category]);
  }, []);

  const handleLocationModeChange = (mode: "tlc" | "felicia" | "middle") => {
    const modeLabels = {
      tlc: "TLC Place",
      felicia: "Felicia Place", 
      middle: "Middle Ground"
    };
    toast.success(`🎯 Searching from ${modeLabels[mode]}!`);
  };

  const handleSearch = useCallback(() => {
    if (!categoryType || categoryType === "both" && !query.trim() && selectedCategories.length === 0) {
      toast.error("Pick Food, Activity, or Both first! 👆");
      return;
    }

    if (!location) {
      toast.error("Location not available. Please enable location services.");
      return;
    }

    const searchQuery = selectedCategories.length > 0 
      ? selectedCategories[0] 
      : categoryType;

    if (!searchQuery) {
      toast.info("Enter a search term or select categories!");
      return;
    }

    setError("");
    search(searchQuery, location, parseInt(radius, 10));
    trackSearch(searchQuery, { radius, location, categoryType });
  }, [query, selectedCategories, location, radius, search, categoryType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 pb-12 px-2 sm:px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-rose-600 p-1 animate-fade-in shadow-2xl">
        <div className="relative overflow-hidden rounded-3xl bg-background/95 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative z-10 p-8 sm:p-12 text-center space-y-6">
            <div className="inline-block animate-scale-in">
              <Badge className="px-8 py-3 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 border-0 text-white shadow-glow animate-pulse font-bold">
                <Crown className="w-6 h-6 mr-2 animate-bounce" />
                ✨ FELICIA'S ROYAL DATE FINDER ✨
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black gradient-text drop-shadow-2xl animate-fade-in leading-tight">
              Queen Felicia's Perfect Date Spots 👑
            </h1>
            
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 bg-clip-text text-transparent max-w-2xl mx-auto animate-fade-in drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
              ✨ Your Royal AI-Powered Guide to Unforgettable Moments in OKC ✨
            </p>

            {!user && (
              <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Link to="#auth">
                  <Button size="lg" className="h-16 px-10 text-lg gradient-primary shadow-2xl hover:shadow-glow font-bold hover:scale-110 transition-all duration-300">
                    Get Started Free
                    <Sparkles className="w-6 h-6 ml-2 animate-pulse" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue={user ? "discover" : "auth"} className="w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1.5 gap-2 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-xl">
          <TabsTrigger 
            value="discover" 
            className="data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow h-14 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Heart className="w-5 h-5 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger 
            value="features" 
            className="data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow h-14 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger 
            value="updates" 
            className="data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow h-14 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            Updates
          </TabsTrigger>
          {!user && (
            <TabsTrigger 
              value="auth" 
              className="data-[state=active]:gradient-primary data-[state=active]:text-white h-12 rounded-lg"
            >
              Sign Up
            </TabsTrigger>
          )}
        </TabsList>

        {/* Discover Tab - Search & Results */}
        <TabsContent value="discover" className="space-y-8">
          {/* Search Section */}
          <Card className="border-2 border-primary/40 shadow-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3 font-black gradient-text">
                <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                Search for Perfect Spots
              </CardTitle>
              <CardDescription className="text-base font-medium">Find restaurants, activities, and date ideas near you</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchBar
                query={query}
                radius={radius}
                onQueryChange={setQuery}
                onRadiusChange={setRadius}
                onSearch={handleSearch}
                disabled={false}
                loading={isSearching}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                categoryType={categoryType}
                onCategoryTypeChange={setCategoryType}
                onLocationModeChange={handleLocationModeChange}
              />
            </CardContent>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-3xl sm:text-4xl font-black gradient-text drop-shadow-lg">
                  {results.length} Amazing Places Found 🎉
                </h2>
                <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-primary to-accent text-white shadow-glow font-bold animate-pulse">
                  ✨ Fresh Results
                </Badge>
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
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <Link to="/ai-recommender">
              <Card className="cursor-pointer group h-full border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:border-primary/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 group-hover:text-primary text-2xl font-bold transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription className="text-base font-medium">
                    Get personalized date ideas powered by AI
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/couple-mode">
              <Card className="hover-lift cursor-pointer group h-full border-2 border-primary/20 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary text-2xl">
                    <Users className="w-6 h-6" />
                    Couple Mode
                  </CardTitle>
                  <CardDescription className="text-base">
                    Shared calendar and planning for couples
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/period-tracker">
              <Card className="hover-lift cursor-pointer group h-full border-2 border-primary/20 bg-gradient-to-br from-rose-50 to-purple-50 dark:from-rose-950/30 dark:to-purple-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary text-2xl">
                    <Calendar className="w-6 h-6" />
                    Period Tracker
                  </CardTitle>
                  <CardDescription className="text-base">
                    Survival reminders for him (BETA)
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/quizzes">
              <Card className="hover-lift cursor-pointer group h-full border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary text-2xl">
                    🎯 Quizzes
                  </CardTitle>
                  <CardDescription className="text-base">
                    Love language & personality insights
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/teefeeme-cartoonifier">
              <Card className="hover-lift cursor-pointer group h-full border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary text-2xl">
                    🎨 Cartoon Generator
                  </CardTitle>
                  <CardDescription className="text-base">
                    Transform photos into cute cartoons
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/gamification">
              <Card className="hover-lift cursor-pointer group h-full border-2 border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary text-2xl">
                    <TrendingUp className="w-6 h-6" />
                    Achievements
                  </CardTitle>
                  <CardDescription className="text-base">
                    Earn badges and level up your dating game
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </TabsContent>

        {/* OKC Legend Forge Tab */}
        <TabsContent value="updates" className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1 shadow-2xl animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl bg-background/95 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
              
              <div className="relative z-10 p-8 sm:p-12 text-center space-y-6">
                <Badge className="px-8 py-3 text-lg bg-gradient-to-r from-red-500 via-orange-500 to-red-500 border-0 text-white shadow-glow font-black animate-pulse">
                  🔥 NEW: OKC LEGEND FORGE
                </Badge>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-200 via-orange-400 to-slate-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Adrenaline Capital Map
                </h2>
                
                <p className="text-lg sm:text-xl font-bold text-muted-foreground max-w-2xl mx-auto">
                  Interactive adventure map with 8 epic categories • Route planner • 70+ adrenaline spots across OKC
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto py-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/30">
                    <div className="text-3xl mb-2">🪂</div>
                    <div className="text-xs font-bold text-blue-400">Sky Reavers</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border-2 border-red-500/30">
                    <div className="text-3xl mb-2">🔫</div>
                    <div className="text-xs font-bold text-red-400">OKC Rambo</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-2 border-cyan-500/30">
                    <div className="text-3xl mb-2">🌊</div>
                    <div className="text-xs font-bold text-cyan-400">Water Surf</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/30">
                    <div className="text-3xl mb-2">🚜</div>
                    <div className="text-xs font-bold text-orange-400">Iron Titans</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/30">
                    <div className="text-3xl mb-2">🐪</div>
                    <div className="text-xs font-bold text-green-400">Beast Coliseum</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500/30">
                    <div className="text-3xl mb-2">☢️</div>
                    <div className="text-xs font-bold text-purple-400">Nuclear Paintball</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-500/10 to-slate-500/5 border-2 border-slate-500/30">
                    <div className="text-3xl mb-2">🤖</div>
                    <div className="text-xs font-bold text-slate-400">Robot Arena</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-2 border-yellow-500/30">
                    <div className="text-3xl mb-2">🛡</div>
                    <div className="text-xs font-bold text-yellow-400">Post-Apoc</div>
                  </div>
                </div>

                <Link to="/okc-legend">
                  <Button size="lg" className="h-16 px-10 text-xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:opacity-90 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-110 transition-all duration-300">
                    🔥 Enter Legend Forge
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground font-bold">
                  Code protected • Expert map build • Route optimizer • Zero fake data
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Auth Tab */}
        {!user && (
          <TabsContent value="auth" id="auth">
            <div className="max-w-2xl mx-auto">
              <AuthPanel />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
