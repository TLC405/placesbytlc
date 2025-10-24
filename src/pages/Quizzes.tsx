import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";

export default function Quizzes() {
  useTesterCheck();
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
