import { useNavigate } from "react-router-dom";
import { MapPin, Sparkles, Heart, Brain, Users, ChevronRight, Map, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PoweredByTLC } from "@/components/PoweredByTLC";

export default function HackerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    { id: "places", title: "Find Date Spots", subtitle: "70+ curated locations", icon: Map, color: "bg-primary/10 text-primary", path: "/places" },
    { id: "cupid", title: "Ask Cupid AI", subtitle: "Get date ideas", icon: Sparkles, color: "bg-secondary/30 text-foreground", path: "/ai-recommender" },
  ];

  const quizzes = [
    { id: "love", title: "Love Language", icon: Heart, color: "bg-rose-100 dark:bg-rose-900/30", iconColor: "text-rose-500", path: "/quiz/love" },
    { id: "mbti", title: "MBTI Type", icon: Brain, color: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-500", path: "/quiz/mbti" },
    { id: "style", title: "Dating Style", icon: Users, color: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-500", path: "/quiz/relationship-style" },
  ];

  const featuredSpots = [
    { id: 1, name: "Automobile Alley", type: "Arts District", emoji: "🎨" },
    { id: 2, name: "Bricktown", type: "Entertainment", emoji: "🌃" },
    { id: 3, name: "Paseo District", type: "Culture", emoji: "🖼️" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        <header className="pt-4 animate-in">
          <p className="text-caption mb-1">Welcome back</p>
          <h1 className="text-display text-foreground">{user?.email?.split("@")[0] || "Explorer"}</h1>
        </header>

        <section className="animate-in-delay-1">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.id} onClick={() => navigate(action.path)} className="card-premium text-left">
                  <div className={`icon-premium mb-3`}><Icon className="w-6 h-6 text-primary" /></div>
                  <h3 className="font-semibold text-foreground text-sm mb-0.5">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.subtitle}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="animate-in-delay-2">
          <div className="section-header">
            <h2 className="section-title">Featured Spots</h2>
            <button onClick={() => navigate("/places")} className="section-action flex items-center gap-1">See all <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="scroll-row">
            {featuredSpots.map((spot) => (
              <button key={spot.id} onClick={() => navigate("/places")} className="flex-shrink-0 w-36 card-premium p-4">
                <span className="text-3xl mb-2 block">{spot.emoji}</span>
                <h3 className="font-medium text-foreground text-sm truncate">{spot.name}</h3>
                <p className="text-xs text-muted-foreground">{spot.type}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="animate-in-delay-3">
          <div className="section-header">
            <h2 className="section-title">Psychology Quizzes</h2>
            <button onClick={() => navigate("/quizzes")} className="section-action flex items-center gap-1">All quizzes <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {quizzes.map((quiz) => {
              const Icon = quiz.icon;
              return (
                <button key={quiz.id} onClick={() => navigate(quiz.path)} className="feature-card w-full">
                  <div className="icon-premium w-12 h-12"><Icon className={`w-5 h-5 ${quiz.iconColor}`} /></div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-foreground text-sm">{quiz.title}</h3>
                    <p className="text-xs text-muted-foreground">Take the quiz</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="animate-in-delay-3">
          <div className="card-premium">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="icon-premium w-14 h-14"><MapPin className="w-7 h-7 text-primary" /></div>
              </div>
              <div className="flex-1">
                <h3 className="text-headline text-foreground mb-1">Plan Your Date</h3>
                <p className="text-body text-sm">Explore 70+ handpicked spots in OKC</p>
              </div>
            </div>
            <button onClick={() => navigate("/places")} className="btn-primary w-full mt-4">
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <PoweredByTLC />
      </div>
    </div>
  );
}
