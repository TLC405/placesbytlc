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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-rose-600 p-1">
        <div className="relative overflow-hidden rounded-3xl bg-background/95 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 p-8 sm:p-12 text-center space-y-6">
            <div className="inline-block">
              <Badge className="px-6 py-2 text-base bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white">
                <Crown className="w-4 h-4 mr-2" />
                V1 Places by TLC for FeeFee
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black gradient-text">
              Discover Your Perfect Date Spots
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered recommendations for unforgettable moments in OKC
            </p>

            {!user && (
              <div className="flex gap-4 justify-center">
                <Link to="#auth">
                  <Button size="lg" className="h-14 px-8 text-lg gradient-primary">
                    Get Started Free
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue={user ? "discover" : "auth"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 gap-2 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-xl border-2 border-primary/20">
          <TabsTrigger 
            value="discover" 
            className="data-[state=active]:gradient-primary data-[state=active]:text-white h-12 rounded-lg"
          >
            <Heart className="w-4 h-4 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger 
            value="features" 
            className="data-[state=active]:gradient-primary data-[state=active]:text-white h-12 rounded-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger 
            value="updates" 
            className="data-[state=active]:gradient-primary data-[state=active]:text-white h-12 rounded-lg"
          >
            <Zap className="w-4 h-4 mr-2" />
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
          <Card className="border-2 border-primary/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Search for Perfect Spots
              </CardTitle>
              <CardDescription>Find restaurants, activities, and date ideas near you</CardDescription>
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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black gradient-text">
                  {results.length} Amazing Places Found
                </h2>
                <Badge className="px-4 py-2 text-base bg-gradient-to-r from-primary to-accent text-white">
                  Fresh Results
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/ai-recommender">
              <Card className="hover-lift cursor-pointer group h-full border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary text-2xl">
                    <Sparkles className="w-6 h-6" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription className="text-base">
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

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-6">
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-3xl gradient-text">Coming Soon</CardTitle>
              <CardDescription>Exciting new features in development</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
                <h3 className="font-bold text-lg mb-2">🌟 Social Feed & Reviews</h3>
                <p className="text-sm text-muted-foreground">Share your date experiences and see what the community loves</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/20">
                <h3 className="font-bold text-lg mb-2">💰 Budget Tracker</h3>
                <p className="text-sm text-muted-foreground">Track dating expenses and manage your budget together</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple/10 to-pink/10 border-2 border-purple/20">
                <h3 className="font-bold text-lg mb-2">🎮 More Gamification</h3>
                <p className="text-sm text-muted-foreground">Challenges, leaderboards, and exclusive rewards</p>
              </div>
            </CardContent>
          </Card>
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
