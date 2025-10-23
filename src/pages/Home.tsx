import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Heart, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">
              Start your date night
            </CardTitle>
            <CardDescription className="text-base">
              Tap the big button, pick a vibe, add spots to your plan, and roll out like you meant to do this all along.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Romantic</Badge>
              <Badge variant="secondary">Chill</Badge>
              <Badge variant="secondary">Adventure</Badge>
              <Badge variant="secondary">Budget</Badge>
              <Badge variant="secondary">Fancy</Badge>
            </div>
            <Link to="/explore">
              <Button size="lg" className="w-full md:w-auto gap-2">
                <Play className="w-5 h-5" />
                Start Date Night
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quiz Cards */}
        <div className="space-y-4">
          <Card className="shadow-soft border-border/50 hover:shadow-glow transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-full h-40 gradient-hero rounded-xl mb-3 flex items-center justify-center">
                <Heart className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="text-xl">Love Language Quiz</CardTitle>
              <CardDescription>
                Discover the top ways you and your partner give/receive love.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/quiz/love">
                <Button variant="outline" className="w-full">Take Quiz</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50 hover:shadow-glow transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-full h-40 gradient-hero rounded-xl mb-3 flex items-center justify-center">
                <Brain className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="text-xl">Personality Match (16‑Type)</CardTitle>
              <CardDescription>
                A relationship‑focused 4‑dimension assessment (E/I, S/N, T/F, J/P).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/quiz/mbti">
                <Button variant="outline" className="w-full">Start Assessment</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
