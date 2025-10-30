import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Sparkles,
  Calendar,
  MessageSquare,
  Gamepad2,
  Users,
  Shield,
  TrendingUp,
  Zap,
  Star,
  Crown,
  Activity,
} from "lucide-react";
import { useDevMode } from "@/contexts/DevModeContext";

export default function HackerHome() {
  const { isDevMode } = useDevMode();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Create floating hearts animation
  useEffect(() => {
    const interval = setInterval(() => {
      const heartId = Date.now();
      setFloatingHearts((prev) => [...prev, heartId]);
      
      const timeout = setTimeout(() => {
        setFloatingHearts((prev) => prev.filter(id => id !== heartId));
      }, 3000);
      
      return () => clearTimeout(timeout);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Place Discovery",
      icon: MapPin,
      desc: "Find perfect date spots",
      path: "/",
      gradient: "from-pink-500 to-rose-500",
      emoji: "📍",
    },
    {
      title: "Couple Mode",
      icon: Heart,
      desc: "Plan together in sync",
      path: "/couple-mode",
      gradient: "from-rose-500 to-red-500",
      emoji: "💑",
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
      title: "OKC Adventures",
      icon: MapPin,
      desc: "8 epic adventure zones",
      path: "/okc-legend",
      gradient: "from-yellow-500 to-orange-500",
      emoji: "🗺️",
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
      title: "Gamification",
      icon: Gamepad2,
      desc: "Earn love points & badges",
      path: "/gamification",
      gradient: "from-indigo-500 to-purple-500",
      emoji: "🎮",
    },
    {
      title: "Cartoonifier",
      icon: Sparkles,
      desc: "Make cute cartoons",
      path: "/cartoonifier",
      gradient: "from-pink-500 to-purple-500",
      emoji: "🎨",
    },
  ];

  const stats = [
    { label: "Active Couples", value: "42", icon: Users, color: "text-pink-500" },
    { label: "Date Spots", value: "1.2K", icon: MapPin, color: "text-purple-500" },
    { label: "Love Score", value: "99.9%", icon: Heart, color: "text-rose-500" },
    { label: "Adventures", value: "70+", icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 relative overflow-hidden">
      {/* Floating Hearts Background */}
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

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Heart className="w-16 h-16 text-pink-500 animate-pulse fill-pink-500" />
            <div>
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                TLC Places
              </h1>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mt-2">
                💘 Where Love Meets Adventure 💘
              </p>
            </div>
            <Sparkles className="w-16 h-16 text-purple-500 animate-bounce" />
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium">
            Discover perfect date spots, plan romantic adventures, and create unforgettable memories together
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-pink-200 dark:border-pink-500/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              role="article"
              aria-label={`${stat.label}: ${stat.value}`}
            >
              <CardContent className="pt-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} aria-hidden="true" />
                <div className="text-3xl font-black text-gray-800 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              onClick={() => navigate(feature.path)}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-pink-200 dark:border-pink-500/30 hover:border-pink-400 dark:hover:border-pink-400 shadow-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 animate-fade-in focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
              style={{ animationDelay: `${idx * 0.1}s` }}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${feature.title}: ${feature.desc}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(feature.path);
                }
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <span className="text-3xl group-hover:scale-125 transition-transform">
                    {feature.emoji}
                  </span>
                </div>
                <CardTitle className="text-xl font-black text-gray-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-pink-500 via-purple-500 to-rose-500 border-0 shadow-2xl shadow-pink-500/50 text-white animate-fade-in">
          <CardContent className="py-12 text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-10 h-10 fill-yellow-300 text-yellow-300 animate-spin-slow" />
              <h2 className="text-4xl font-black">
                Start Your Love Adventure Today
              </h2>
              <Star className="w-10 h-10 fill-yellow-300 text-yellow-300 animate-spin-slow" />
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Join thousands of couples creating magical memories with TLC Places
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button
                size="lg"
                onClick={() => navigate("/")}
                className="bg-white text-pink-600 hover:bg-pink-50 font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:scale-110 transition-transform"
              >
                <MapPin className="w-6 h-6 mr-2" />
                Explore Places
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-pink-600 font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:scale-110 transition-transform"
              >
                <Heart className="w-6 h-6 mr-2 fill-white" />
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dev Mode Badge */}
        {isDevMode && (
          <div className="fixed bottom-6 right-6 animate-fade-in">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-2 shadow-lg">
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              DEV MODE
            </Badge>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400 space-y-2 pt-12">
          <p className="flex items-center justify-center gap-2 text-sm font-medium">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
            Made with love by TLC
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {time.toLocaleString()} • {isDevMode && "🔧 Developer Mode Active"}
          </p>
        </div>
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
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
