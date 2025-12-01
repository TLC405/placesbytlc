import { useState } from "react";
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
  Shield,
  Zap,
  Crown,
  Brain,
  Users,
  Image,
  LogIn,
  ChevronRight,
  Star,
  Activity,
  Wand2,
  Trophy,
  Map,
  MessageSquare,
} from "lucide-react";
import { useDevMode } from "@/contexts/DevModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePIN } from "@/contexts/PINContext";
import { AdminPINModal } from "@/components/AdminPINModal";
import { AppLogo } from "@/components/AppLogo";
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
      title: "Places",
      icon: MapPin,
      desc: "Discover amazing date spots in OKC with smart search",
      path: "/places",
      color: "from-pink-500/30 to-rose-500/30",
      badge: "Essential",
    },
    {
      title: "OKC Legend Map",
      icon: Map,
      desc: "Interactive map with 70+ curated locations across 8 zones",
      path: "/okc-legend",
      color: "from-purple-500/30 to-pink-500/30",
      badge: "Featured",
    },
    {
      title: "Cupid Chat",
      icon: MessageSquare,
      desc: "AI-powered relationship advice and date ideas",
      path: "/ai-recommender",
      color: "from-blue-500/30 to-purple-500/30",
      badge: "AI",
    },
  ];

  const relationshipTools = [
    {
      title: "Love Language",
      icon: Heart,
      desc: "Discover how you express love",
      path: "/quiz/love",
      color: "from-red-500/30 to-pink-500/30",
    },
    {
      title: "MBTI Quiz",
      icon: Brain,
      desc: "Understand personality types",
      path: "/quiz/mbti",
      color: "from-purple-500/30 to-blue-500/30",
    },
    {
      title: "Relationship Style",
      icon: Users,
      desc: "Find your compatibility",
      path: "/quiz/relationship-style",
      color: "from-blue-500/30 to-cyan-500/30",
    },
    {
      title: "Period Tracker",
      icon: Activity,
      desc: "Track cycles with SMS alerts",
      path: "/period-tracker",
      color: "from-pink-500/30 to-purple-500/30",
    },
  ];

  const aiPowered = [
    {
      title: "Cartoonifier",
      icon: Wand2,
      desc: "Transform photos into stunning cartoons",
      path: "/cartoonifier",
      color: "from-yellow-500/30 to-orange-500/30",
    },
    {
      title: "Event Discovery",
      icon: Calendar,
      desc: "Find local events and activities",
      path: "/events",
      color: "from-green-500/30 to-emerald-500/30",
    },
  ];

  const gamification = [
    {
      title: "Achievements",
      icon: Trophy,
      desc: "Unlock badges and level up together",
      path: "/gamification",
      color: "from-amber-500/30 to-yellow-500/30",
    },
    {
      title: "Couple Mode",
      icon: Users,
      desc: "Sync and share with your partner",
      path: "/couple-mode",
      color: "from-rose-500/30 to-pink-500/30",
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
    <div className="page-shell">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent py-16">
        <div className="page-content">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block animate-scale-in">
              <AppLogo />
            </div>
            
            <div className="space-y-4">
              <h1 className="heading-main animate-slide-up">
                Your Premium Dating Experience
              </h1>
              <p className="subheading-main mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Discover perfect spots, understand each other better, and create unforgettable memories
              </p>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {!user ? (
                <button onClick={handleAuth} className="btn-main group">
                  <LogIn className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Sign In / Sign Up
                  <Sparkles className="w-4 h-4 ml-1 animate-glow-pulse" />
                </button>
              ) : (
                <>
                  <Button onClick={handleLogout} variant="outline" size="lg">
                    <LogIn className="w-5 h-5" />
                    Logout
                  </Button>
                  <button onClick={handleAdminAccess} className="btn-main group">
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Admin Panel
                  </button>
                </>
              )}
              {isDevMode && (
                <div className="chip-soft bg-primary/10 text-primary border-primary/30 animate-pulse">
                  <Crown className="w-4 h-4" />
                  PLATINUM MODE
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content space-y-20">
        {/* Core Features */}
        <section className="space-y-8">
          <div className="text-center space-y-3 animate-slide-up">
            <div className="chip-soft mx-auto">
              <Zap className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="font-semibold text-primary">Core Features</span>
            </div>
            <h2 className="heading-main text-primary">
              Essential Tools
            </h2>
            <p className="subheading-main mx-auto">
              Everything you need for your relationship journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card 
                    className="card-premium cursor-pointer border-2 border-border/50 hover:border-primary/50 group animate-slide-up h-full"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-glow backdrop-blur-sm`}>
                          <Icon className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                        <span className="chip-soft">
                          {feature.badge}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-base text-muted-foreground">
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
        <section className="space-y-8">
          <div className="text-center space-y-3 animate-slide-up">
            <div className="chip-soft mx-auto">
              <Heart className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-semibold text-primary">Relationship Tools</span>
            </div>
            <h2 className="heading-main text-primary">
              Understand Each Other
            </h2>
            <p className="subheading-main mx-auto">
              Discover deeper connections through understanding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relationshipTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.path} to={tool.path}>
                  <Card 
                    className="card-premium cursor-pointer border-2 border-border/50 hover:border-primary/50 group animate-slide-up h-full"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-card backdrop-blur-sm`}>
                        <Icon className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform duration-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {tool.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AI-Powered */}
        <section className="space-y-8">
          <div className="text-center space-y-3 animate-slide-up">
            <div className="chip-soft mx-auto">
              <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="font-semibold text-primary">AI-Powered</span>
            </div>
            <h2 className="heading-main text-primary">
              Smart Features
            </h2>
            <p className="subheading-main mx-auto">
              Powered by artificial intelligence for modern couples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiPowered.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card 
                    className="card-premium cursor-pointer border-2 border-border/50 hover:border-primary/50 group animate-slide-up h-full"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-glow backdrop-blur-sm`}>
                        <Icon className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform duration-500" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-base text-muted-foreground">
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
        <section className="space-y-8">
          <div className="text-center space-y-3 animate-slide-up">
            <div className="chip-soft mx-auto">
              <Trophy className="w-4 h-4 text-primary animate-bounce-slow" />
              <span className="font-semibold text-primary">Gamification</span>
            </div>
            <h2 className="heading-main text-primary">
              Fun & Rewards
            </h2>
            <p className="subheading-main mx-auto">
              Make every moment together more exciting
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gamification.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card 
                    className="card-premium cursor-pointer border-2 border-border/50 hover:border-primary/50 group animate-slide-up h-full"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-glow backdrop-blur-sm`}>
                        <Icon className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform duration-500" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-base text-muted-foreground">
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

        {/* Footer CTA */}
        <section className="card-premium text-center animate-slide-up bg-gradient-to-br from-primary/5 to-transparent">
          <div className="space-y-6">
            <h2 className="heading-main text-primary">
              Ready to Explore?
            </h2>
            <p className="subheading-main mx-auto">
              Start discovering amazing date spots and building deeper connections
            </p>
            <button className="btn-main gap-2" onClick={() => navigate("/places")}>
              <MapPin className="w-5 h-5" />
              Get Started
              <Sparkles className="w-4 h-4 animate-glow-pulse" />
            </button>
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
