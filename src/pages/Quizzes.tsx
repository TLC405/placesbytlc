import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Crown, Sparkles } from "lucide-react";
import crownImage from "@/assets/felicia-crown.png";

export default function Quizzes() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Personality Quizzes & Fun Tools
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover more about yourself and get personalized date recommendations!
        </p>
      </div>

      {/* Featured Card - Felicia's Crown */}
      <Link to="/cartoon-generator" className="block">
        <Card className="relative overflow-hidden border-2 border-primary/50 hover:border-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-glow group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-yellow-500/20 animate-gradient-shift" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl md:text-4xl font-bold gradient-text mb-2 flex items-center gap-2">
                  <Crown className="w-8 h-8" />
                  Felicia's Crown 👑
                </CardTitle>
                <CardDescription className="text-lg">
                  Upload your photo and watch as AI transforms you into a stunning cartoon character! 
                  Choose from Disney, Pixar, Anime, and more styles.
                </CardDescription>
              </div>
              <div className="hidden md:block">
                <img 
                  src={crownImage} 
                  alt="Crown" 
                  className="w-32 h-32 object-contain animate-float group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-glow">
              <Sparkles className="mr-2" />
              Transform Your Photo Now!
            </Button>
          </CardContent>
        </Card>
      </Link>

      {/* Quizzes Grid */}
      <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
        <Card className="shadow-soft border-border/50 hover:shadow-glow transition-shadow">
        <CardHeader>
          <div className="w-full h-48 gradient-hero rounded-xl mb-4 flex items-center justify-center">
            <Heart className="w-20 h-20 text-primary" />
          </div>
          <CardTitle className="text-2xl">Love Language Quiz</CardTitle>
          <CardDescription className="text-base">
            Five domains: Words, Acts, Gifts, Time, Touch. Get your top languages and date ideas tailored to them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/quiz/love">
            <Button className="w-full">Take Quiz</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="shadow-soft border-border/50 hover:shadow-glow transition-shadow">
        <CardHeader>
          <div className="w-full h-48 gradient-hero rounded-xl mb-4 flex items-center justify-center">
            <Brain className="w-20 h-20 text-primary" />
          </div>
          <CardTitle className="text-2xl">Personality Match (16‑Type)</CardTitle>
          <CardDescription className="text-base">
            Measures four dichotomies for relationship dynamics. Private, device‑only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/quiz/mbti">
            <Button className="w-full">Start Assessment</Button>
          </Link>
        </CardContent>
      </Card>
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
