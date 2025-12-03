import { useNavigate } from "react-router-dom";
import { Heart, Brain, Users, ChevronRight, Sparkles } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";

export default function Quizzes() {
  useTesterCheck();
  const navigate = useNavigate();

  const quizzes = [
    {
      id: "love",
      title: "Love Language",
      description: "Discover how you express and receive love",
      icon: Heart,
      color: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-500",
      path: "/quiz/love",
      duration: "5 min",
    },
    {
      id: "mbti",
      title: "Personality Type",
      description: "Understand your MBTI and match dynamics",
      icon: Brain,
      color: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-500",
      path: "/quiz/mbti",
      duration: "8 min",
    },
    {
      id: "style",
      title: "Relationship Style",
      description: "Find your dating and relationship approach",
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-500",
      path: "/quiz/relationship-style",
      duration: "6 min",
    },
  ];

  const comingSoon = [
    { emoji: "💑", title: "Compatibility", desc: "Match score calculator" },
    { emoji: "🌟", title: "Date Night", desc: "Perfect evening style" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        {/* Header */}
        <header className="pt-4 text-center animate-in">
          <div className="inline-flex items-center gap-2 chip-primary mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Personality Quizzes</span>
          </div>
          <h1 className="text-display text-foreground mb-2">
            Discover Yourself
          </h1>
          <p className="text-body max-w-sm mx-auto">
            Take fun quizzes to understand your personality and relationships better
          </p>
        </header>

        {/* Main Quizzes */}
        <section className="space-y-3 animate-in-delay-1">
          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <button
                key={quiz.id}
                onClick={() => navigate(quiz.path)}
                className="feature-card w-full"
              >
                <div className={`feature-icon ${quiz.color}`}>
                  <Icon className={`w-6 h-6 ${quiz.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-foreground">
                      {quiz.title}
                    </h3>
                    <span className="chip text-[10px] py-0.5 px-2">
                      {quiz.duration}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {quiz.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </section>

        {/* Coming Soon */}
        <section className="animate-in-delay-2">
          <div className="section-header">
            <h2 className="section-title">Coming Soon</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {comingSoon.map((item, idx) => (
              <div
                key={idx}
                className="card-luxury p-4 opacity-75 cursor-not-allowed"
              >
                <span className="text-2xl mb-2 block">{item.emoji}</span>
                <h3 className="font-medium text-foreground text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Card */}
        <section className="animate-in-delay-3">
          <div className="card-highlight text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse-soft" />
            <h3 className="text-headline text-foreground mb-2">
              Why Take Quizzes?
            </h3>
            <p className="text-body text-sm">
              Understanding yourself and your partner leads to deeper connections
              and more meaningful dates.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
