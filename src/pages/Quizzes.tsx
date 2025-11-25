import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";

export default function Quizzes() {
  useTesterCheck();
  return (
    <div className="space-y-12">
      {/* Epic Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
        <div className="relative overflow-hidden rounded-3xl bg-background/95 backdrop-blur-xl p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-rose-500/10" />
          <div className="relative z-10 space-y-6">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold shadow-glow animate-pulse">
              🎯 Personality Quizzes
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent drop-shadow-xl">
              ✨ Epic Couple Quizzes ✨
            </h1>
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 bg-clip-text text-transparent max-w-3xl mx-auto">
              Discover your love language, personality type, and unlock deeper connections!
            </p>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <Card className="shadow-2xl shadow-primary/10 border-4 border-primary/40 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden group bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md">
          <div className="h-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
          <CardHeader>
            <div className="w-full h-48 bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <Heart className="w-20 h-20 text-white drop-shadow-2xl animate-pulse relative z-10" fill="currentColor" />
            </div>
            <CardTitle className="text-2xl font-black gradient-text">💕 Love Language</CardTitle>
            <CardDescription className="text-base font-semibold">
              Discover your love language and get personalized date ideas!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quiz/love">
              <Button className="w-full h-12 text-base font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:opacity-90 shadow-glow">
                Start Quiz ✨
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-2xl shadow-accent/10 border-4 border-accent/40 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 overflow-hidden group bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md">
          <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
          <CardHeader>
            <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-500 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <Brain className="w-20 h-20 text-white drop-shadow-2xl animate-pulse relative z-10" />
            </div>
            <CardTitle className="text-2xl font-black gradient-text">🧠 Personality Type</CardTitle>
            <CardDescription className="text-base font-semibold">
              16 personalities to understand your match dynamics!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quiz/mbti">
              <Button className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:opacity-90 shadow-glow">
                Discover Type 🚀
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-2xl shadow-orange-500/10 border-4 border-orange-500/40 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 overflow-hidden group bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-md">
          <div className="h-3 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
          <CardHeader>
            <div className="w-full h-48 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="text-6xl drop-shadow-2xl animate-pulse relative z-10">🏔️</span>
            </div>
            <CardTitle className="text-2xl font-black gradient-text">🎭 Relationship Style</CardTitle>
            <CardDescription className="text-base font-semibold">
              Are you an Adventurer, Nurturer, Intellectual, Romantic, or Pragmatic?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/quiz/relationship-style">
              <Button className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:opacity-90 shadow-glow">
                Find Your Style 🎯
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Section */}
      <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            🎊 More Quizzes Coming Soon! 🎊
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30 border-2 border-pink-500/40 hover:border-pink-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
              <div className="text-5xl mb-4 animate-bounce">💑</div>
              <h3 className="font-black text-xl mb-3">Compatibility Calculator</h3>
              <p className="text-sm text-muted-foreground font-medium">Calculate your relationship compatibility score!</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 border-2 border-purple-500/40 hover:border-purple-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
              <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</div>
              <h3 className="font-black text-xl mb-3">Date Night Personality</h3>
              <p className="text-sm text-muted-foreground font-medium">Find your perfect date night style!</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
