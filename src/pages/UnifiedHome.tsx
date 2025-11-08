import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Sparkles,
  Calendar,
  MessageSquare,
  Heart,
  Download,
  Users,
  Crown,
  Palette,
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
import { useAuth } from "@/contexts/AuthContext";
import { HeroSection } from "@/components/organisms/HeroSection";
import { NavigationBar } from "@/components/organisms/NavigationBar";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { CTASection } from "@/components/molecules/CTASection";
import { GlowingBadge } from "@/components/atoms/GlowingBadge";
import { GradientText } from "@/components/atoms/GradientText";

export default function UnifiedHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("8047");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryType, setCategoryType] = useState<"food" | "activity" | "both">("both");
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  const { location } = useGeolocation();
  const { results, isSearching, search } = usePlacesSearch({
    onError: (message) => toast.error(message),
  });

  // Floating hearts animation
  useEffect(() => {
    const interval = setInterval(() => {
      const heartId = Date.now();
      setFloatingHearts((prev) => [...prev, heartId]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((id) => id !== heartId));
      }, 3000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (!categoryType || (categoryType === "both" && !query.trim() && selectedCategories.length === 0)) {
      toast.error("Pick Food, Activity, or Both first! 👆");
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

  const features = [
    {
      title: "Cartoonifier",
      icon: Palette,
      desc: "12 TV styles with identity lock",
      path: "/cartoonifier",
      gradient: "from-pink-500 to-purple-500",
      emoji: "🎨",
    },
    {
      title: "AI Cupid",
      icon: Sparkles,
      desc: "Smart date suggestions",
      path: "/ai-recommender",
      gradient: "from-purple-500 to-pink-500",
      emoji: "✨",
    },
    {
      title: "Period Tracker",
      icon: Calendar,
      desc: "Relationship calendar",
      path: "/period-tracker",
      gradient: "from-orange-500 to-pink-500",
      emoji: "📅",
    },
    {
      title: "Love Quizzes",
      icon: MessageSquare,
      desc: "Discover compatibility",
      path: "/quizzes",
      gradient: "from-green-500 to-emerald-500",
      emoji: "💬",
    },
    {
      title: "Couple Mode",
      icon: Users,
      desc: "Plan together in sync",
      path: "/couple-mode",
      gradient: "from-rose-500 to-red-500",
      emoji: "💑",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingHearts.map((id) => (
          <div
            key={id}
            className="absolute text-4xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: 0.3,
            }}
          >
            💕
          </div>
        ))}
      </div>

      {/* Navigation */}
      <NavigationBar
        logo={
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary animate-pulse fill-primary" />
            <GradientText className="font-black text-xl">TLC Places</GradientText>
          </div>
        }
        actions={<DarkModeToggle />}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-12 space-y-16">
        {/* Hero */}
        <HeroSection
          badge={{ text: "V1 Places by TLC for FeeFee", icon: Crown }}
          title="Your Love & Adventure Hub"
          description="Discover perfect date spots, create identity-locked cartoons, and plan unforgettable memories together"
          actions={
            <>
              <Button
                size="lg"
                onClick={() => user ? navigate("/cartoonifier") : navigate("/auth")}
                className="h-14 px-8 gradient-primary text-primary-foreground font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
              >
                <Palette className="w-6 h-6 mr-2" />
                Start Cartoonifying
              </Button>
              <Button
                size="lg"
                onClick={downloadApp}
                variant="outline"
                className="h-14 px-8 font-bold text-lg shadow-xl hover:scale-105 transition-transform"
              >
                <Download className="w-6 h-6 mr-2" />
                Download App
              </Button>
            </>
          }
        />

        {/* Places Search Section */}
        <section id="places" className="space-y-6">
          <SectionHeader
            title="Discover Perfect Spots"
            description="Find restaurants, activities, and date ideas near you"
            icon={MapPin}
          />

          <Card className="border-2 border-primary/40 shadow-2xl bg-card/95 backdrop-blur-md">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <GradientText className="text-2xl font-black">Search for Places</GradientText>
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
                  toast.success(`🎯 Searching from ${mode === "tlc" ? "TLC Place" : mode === "partner" ? "Partner Place" : "Middle Ground"}!`)
                }
              />
            </CardContent>
          </Card>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <GradientText as="h3" className="text-3xl font-black">{results.length} Places Found 🎉</GradientText>
                <GlowingBadge size="lg">✨ Fresh Results</GlowingBadge>
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

        {/* Cartoonifier Preview Section */}
        <section id="cartoonifier" className="space-y-6">
          <SectionHeader
            title="TeeFeeMe Cartoonifier"
            description="12 TV-inspired styles with identity-lock technology"
            icon={Palette}
          />

          <Card className="border-2 border-primary/40 shadow-2xl bg-card/95 backdrop-blur-md">
            <CardContent className="pt-6">
              <StyleGallery selectedStyle="" onStyleSelect={(style) => navigate("/cartoonifier")} />
              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  onClick={() => user ? navigate("/cartoonifier") : navigate("/auth")}
                  className="h-14 px-12 gradient-primary text-primary-foreground font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
                >
                  Try Full Cartoonifier →
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section id="features" className="space-y-6">
          <SectionHeader
            title="More Features"
            description="Explore everything TLC Places has to offer"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                title={feature.title}
                description={feature.desc}
                icon={feature.icon}
                emoji={feature.emoji}
                gradient={feature.gradient}
                onClick={() => user ? navigate(feature.path) : navigate("/auth")}
              />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center space-y-6 pt-12">
          <CTASection
            title="Ready to Begin?"
            description="Join thousands creating magical memories with TLC Places"
            buttons={[
              {
                label: "Get Started",
                icon: Heart,
                onClick: () => navigate("/auth"),
              },
              {
                label: "Download App",
                icon: Download,
                onClick: downloadApp,
                variant: "outline",
              },
            ]}
          />

          <div className="text-muted-foreground text-sm">
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-primary text-primary animate-pulse" />
              Made with love by TLC
              <Heart className="w-4 h-4 fill-primary text-primary animate-pulse" />
            </p>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
