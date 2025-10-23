import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain } from "lucide-react";

export default function Quizzes() {
  return (
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
  );
}
