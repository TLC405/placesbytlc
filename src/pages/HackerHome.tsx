import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Heart,
  Sparkles,
  Calendar,
  Gamepad2,
  MessageSquare,
  Shield,
  Zap,
  Crown,
  Brain,
  Users,
  Image,
  Lock,
  LogIn,
  Settings,
  ChevronRight,
  Star,
} from "lucide-react";
import { useDevMode } from "@/contexts/DevModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePIN } from "@/contexts/PINContext";
import { AdminPINModal } from "@/components/AdminPINModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function HackerHome() {
  const navigate = useNavigate();
  const { isDevMode } = useDevMode();
  const { user } = useAuth();
  const { isAdmin } = usePIN();
  const [showAdminPIN, setShowAdminPIN] = useState(false);

  const coreFeatures = [
    {
      title: "Places Discovery",
      icon: MapPin,
      desc: "Find perfect date spots with AI-powered search and recommendations",
      path: "/",
      color: "from-blue-600 via-cyan-500 to-teal-400",
      badge: "Core",
      highlight: true,
    },
    {
      title: "OKC Legend Map",
      icon: Star,
      desc: "Explore 8 epic adventure zones with 70+ curated locations",
      path: "/okc-legend",
      color: "from-orange-500 via-yellow-500 to-amber-400",
      badge: "Featured",
      highlight: true,
    },
  ];

  const relationshipTools = [
    {
      title: "Couple Mode",
      icon: Heart,
      desc: "Shared planning & real-time sync for couples",
      path: "/couple-mode",
      color: "from-pink-600 to-rose-500",
      badge: "Popular",
    },
    {
      title: "Period Tracker",
      icon: Calendar,
      desc: "Survival mode with SMS alerts",
      path: "/period-tracker",
      color: "from-red-500 to-orange-500",
      badge: "Essential",
    },
    {
      title: "Quizzes",
      icon: Brain,
      desc: "Love language, MBTI & compatibility",
      path: "/quizzes",
      color: "from-purple-600 to-violet-500",
      badge: "Insights",
    },
  ];

  const aiPowered = [
    {
      title: "AI Recommender",
      icon: Sparkles,
      desc: "Smart suggestions powered by GPT",
      path: "/ai-recommender",
      color: "from-indigo-600 to-purple-500",
      badge: "AI",
    },
    {
      title: "TeeFeeMe",
      icon: Image,
      desc: "Transform photos into cartoons",
      path: "/cartoonifier",
      color: "from-yellow-500 to-amber-500",
      badge: "Creative",
    },
  ];

  const gamification = [
    {
      title: "Gamification",
      icon: Gamepad2,
      desc: "Earn XP, unlock achievements & level up",
      path: "/gamification",
      color: "from-emerald-600 to-green-500",
      badge: "Fun",
    },
  ];

  const handleAdminAccess = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      setShowAdminPIN(true);
    }
  };

  const handleAdminPINSuccess = () => {
    navigate("/admin");
    toast.success("🔓 Admin access granted!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const handleAuth = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">V1 Places by TLC</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Your Complete
              </span>
              <br />
              <span className="text-foreground">Dating Platform</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need for amazing dates, better relationships, and deeper connections
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {!user ? (
                <Button size="lg" onClick={handleAuth} className="gap-2">
                  <LogIn className="w-5 h-5" />
                  Login / Sign Up
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={handleLogout} variant="outline" className="gap-2">
                    <LogIn className="w-5 h-5" />
                    Logout
                  </Button>
                  <Button size="lg" onClick={handleAdminAccess} variant="secondary" className="gap-2">
                    <Lock className="w-5 h-5" />
                    Admin Panel
                  </Button>
                </>
              )}
              {isDevMode && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 text-sm animate-pulse">
                  <Crown className="w-4 h-4 mr-1" />
                  PLATINUM MODE
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Core Features - Hero Cards */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Core Features</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {coreFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 h-full bg-gradient-to-br from-card to-card/50">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <CardContent className="p-8 space-y-4 relative">
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs font-bold">
                          {feature.badge}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-primary font-semibold group-hover:gap-3 transition-all">
                        <span>Explore Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Relationship Tools */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Relationship Tools</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relationshipTools.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="group relative overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AI-Powered Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">AI-Powered</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {aiPowered.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="group relative overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Gamification */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Level Up</h2>
          </div>
          
          <div className="grid gap-4">
            {gamification.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="group relative overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
          <div className="relative space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              Ready to explore?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Start discovering amazing date spots and building better relationships
            </p>
            <Button size="lg" className="gap-2" onClick={() => navigate("/")}>
              <MapPin className="w-5 h-5" />
              Get Started
            </Button>
          </div>
        </section>
      </div>

      <AdminPINModal
        open={showAdminPIN}
        onOpenChange={setShowAdminPIN}
        onSuccess={handleAdminPINSuccess}
      />
    </div>
  );
}
