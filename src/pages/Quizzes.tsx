import { useNavigate } from "react-router-dom";
import { Heart, Brain, Users, ChevronRight, FlaskConical, ArrowLeft, GraduationCap } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";

export default function Quizzes() {
  const navigate = useNavigate();

  const quizzes = [
    {
      id: "love",
      title: "Love Language",
      description: "Based on Dr. Gary Chapman's research — discover how you give & receive love",
      icon: Heart,
      color: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-500",
      path: "/quiz/love",
      duration: "5 min",
      badge: "Research-backed",
    },
    {
      id: "mbti",
      title: "Personality Type",
      description: "Myers-Briggs psychological profiling — understand your cognitive functions & match dynamics",
      icon: Brain,
      color: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-500",
      path: "/quiz/mbti",
      duration: "8 min",
      badge: "16 types",
    },
    {
      id: "style",
      title: "Relationship Style",
      description: "Attachment theory assessment — find your dating approach & compatibility patterns",
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-500",
      path: "/quiz/relationship-style",
      duration: "6 min",
      badge: "Attachment theory",
    },
  ];

  const comingSoon = [
    { emoji: "💑", title: "Compatibility", desc: "Gottman-based match analysis" },
    { emoji: "🌟", title: "Date Night IQ", desc: "Personalized evening profiling" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        {/* Header */}
        <header className="animate-in">
          <button 
            onClick={() => navigate("/")} 
            className="btn-ghost -ml-3 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <div className="icon-premium mx-auto mb-4 w-16 h-16" style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}>
              <FlaskConical className="w-7 h-7 text-primary" />
            </div>
            <div className="inline-flex items-center gap-2 chip-primary mb-4">
              <GraduationCap className="w-3 h-3" />
              <span>Psychology Quizzes</span>
            </div>
            <h1 className="text-display text-foreground mb-2">Discover Yourself</h1>
            <p className="text-body max-w-sm mx-auto">
              Evidence-based personality assessments grounded in relationship psychology research
            </p>
          </div>
        </header>

        {/* Main Quizzes */}
        <section className="space-y-3 animate-in-delay-1">
          <div className="section-header">
            <h2 className="section-title">Available Assessments</h2>
          </div>
          
          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <button
                key={quiz.id}
                onClick={() => navigate(quiz.path)}
                className="card-premium w-full flex items-center gap-4 text-left"
              >
                <div className="icon-premium">
                  <Icon className={`w-6 h-6 ${quiz.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                    <span className="chip text-[10px] py-0.5 px-2">{quiz.duration}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{quiz.description}</p>
                  <span className="chip-primary text-[10px] mt-2 inline-flex">{quiz.badge}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
              <div key={idx} className="card-premium p-4 opacity-60 cursor-not-allowed">
                <span className="text-2xl mb-2 block">{item.emoji}</span>
                <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Card */}
        <section className="animate-in-delay-3">
          <div className="card-premium text-center py-6">
            <GraduationCap className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse-soft" />
            <h3 className="text-headline text-foreground mb-2">Why Psychology?</h3>
            <p className="text-body text-sm max-w-xs mx-auto">
              Understanding the science behind your personality and attachment style leads to deeper connections and more meaningful relationships.
            </p>
          </div>
        </section>

        <PoweredByTLC />
      </div>
    </div>
  );
}
