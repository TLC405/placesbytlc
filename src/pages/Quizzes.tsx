import { useNavigate } from "react-router-dom";
import { Heart, Brain, Users, ChevronRight, FlaskConical, ArrowLeft, GraduationCap, Users2, Stars, Sparkles, Clock, TrendingUp, Award } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";

export default function Quizzes() {
  const navigate = useNavigate();

  const quizzes = [
    {
      id: "love",
      title: "Love Language",
      description: "Discover how you give & receive love — Dr. Gary Chapman's 5 languages framework",
      icon: Heart,
      color: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-500",
      accent: "from-rose-500/20 to-pink-500/10",
      path: "/quiz/love",
      duration: "5 min",
      questions: "15 Q",
      badge: "Research-backed",
      tags: ["Couples", "Self-discovery"],
    },
    {
      id: "mbti",
      title: "Personality Type",
      description: "Myers-Briggs cognitive functions & how your type pairs with others romantically",
      icon: Brain,
      color: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-500",
      accent: "from-violet-500/20 to-purple-500/10",
      path: "/quiz/mbti",
      duration: "8 min",
      questions: "20 Q",
      badge: "16 types",
      tags: ["Psychology", "Match"],
    },
    {
      id: "style",
      title: "Relationship Style",
      description: "Attachment theory profile — uncover your dating patterns and ideal partner energy",
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-500",
      accent: "from-blue-500/20 to-cyan-500/10",
      path: "/quiz/relationship-style",
      duration: "6 min",
      questions: "12 Q",
      badge: "Attachment theory",
      tags: ["Behavioral", "Insight"],
    },
    {
      id: "compatibility",
      title: "Compatibility",
      description: "Gottman-inspired analysis across communication, conflict repair, intimacy, values & growth",
      icon: Users2,
      color: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-500",
      accent: "from-emerald-500/20 to-teal-500/10",
      path: "/quiz/compatibility",
      duration: "4 min",
      questions: "10 Q",
      badge: "NEW",
      tags: ["Couples", "Action plan"],
      isNew: true,
    },
    {
      id: "date-night-iq",
      title: "Date Night IQ",
      description: "Personalized evening profile + curated OKC date spots matched to your vibe blend",
      icon: Stars,
      color: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-500",
      accent: "from-amber-500/20 to-orange-500/10",
      path: "/quiz/date-night-iq",
      duration: "3 min",
      questions: "8 Q",
      badge: "NEW",
      tags: ["Date ideas", "OKC"],
      isNew: true,
    },
  ];

  const stats = [
    { icon: FlaskConical, label: "5 Quizzes", sub: "Available" },
    { icon: Clock, label: "~26 min", sub: "Total time" },
    { icon: Award, label: "Evidence", sub: "Research-based" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        {/* Header */}
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
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
              Evidence-based assessments grounded in relationship psychology — get insights, action plans & curated date ideas
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="card-luxury py-3 px-2 text-center">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                  <div className="text-xs font-semibold text-foreground">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.sub}</div>
                </div>
              );
            })}
          </div>
        </header>

        {/* Quizzes */}
        <section className="space-y-3 animate-in-delay-1">
          <div className="section-header flex items-center justify-between">
            <h2 className="section-title">All Assessments</h2>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Most loved
            </span>
          </div>

          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <button
                key={quiz.id}
                onClick={() => navigate(quiz.path)}
                className="card-premium w-full flex items-start gap-4 text-left relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${quiz.accent} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                <div className={`icon-premium relative ${quiz.color}`}>
                  <Icon className={`w-6 h-6 ${quiz.iconColor}`} />
                </div>
                <div className="flex-1 relative min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                    {quiz.isNew && (
                      <span className="chip-primary text-[9px] py-0.5 px-1.5 inline-flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{quiz.description}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="chip text-[10px] py-0.5 px-2 inline-flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {quiz.duration}
                    </span>
                    <span className="chip text-[10px] py-0.5 px-2">{quiz.questions}</span>
                    {quiz.tags.map((t) => (
                      <span key={t} className="chip text-[10px] py-0.5 px-2 opacity-70">{t}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 relative group-hover:translate-x-1 transition-transform" />
              </button>
            );
          })}
        </section>

        {/* Why card */}
        <section className="animate-in-delay-3">
          <div className="card-highlight text-center py-6">
            <GraduationCap className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse-soft" />
            <h3 className="text-headline text-foreground mb-2">Why Psychology?</h3>
            <p className="text-body text-sm max-w-xs mx-auto mb-4">
              Understanding your patterns leads to deeper connections. Each quiz unlocks an action plan and tailored OKC date ideas.
            </p>
            <button onClick={() => navigate("/places")} className="btn-secondary inline-flex">
              <Sparkles className="w-4 h-4" />
              Explore date spots
            </button>
          </div>
        </section>

        <PoweredByTLC />
      </div>
    </div>
  );
}
