import { useNavigate } from "react-router-dom";
import { Heart, Brain, Users, ChevronRight, ArrowLeft, Crown, Flame, Users2, Stars, Clock, Sparkles } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";

export default function Quizzes() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Know yourself",
      sub: "The work starts inside",
      quizzes: [
        { id: "archetype", title: "Masculine Archetype", description: "King, Warrior, Magician, Lover — the four modes of modern masculinity", icon: Crown, path: "/quiz/masculine-archetype", duration: "4 min", questions: "8 Q", badge: "NEW", isNew: true },
        { id: "confidence", title: "Confidence Index", description: "Approach anxiety, follow-through, emotional regulation — your real number", icon: Flame, path: "/quiz/dating-confidence", duration: "3 min", questions: "10 Q", badge: "NEW", isNew: true },
        { id: "mbti", title: "Personality Type", description: "16-type cognitive profile and how yours plays in relationships", icon: Brain, path: "/quiz/mbti", duration: "8 min", questions: "20 Q", badge: "MBTI" },
      ],
    },
    {
      title: "Read her",
      sub: "See the dynamic clearly",
      quizzes: [
        { id: "love", title: "Love Language", description: "How you give love — and how to spot hers in under a week", icon: Heart, path: "/quiz/love", duration: "5 min", questions: "15 Q", badge: "Chapman" },
        { id: "style", title: "Attachment Style", description: "Anxious, avoidant, secure — how you bond and what throws you off", icon: Users, path: "/quiz/relationship-style", duration: "6 min", questions: "12 Q", badge: "Bowlby" },
        { id: "compatibility", title: "Compatibility", description: "Communication, conflict, intimacy, values, growth — the five that matter", icon: Users2, path: "/quiz/compatibility", duration: "4 min", questions: "10 Q", badge: "Gottman" },
      ],
    },
    {
      title: "Use it tonight",
      sub: "Skills you can run this week",
      quizzes: [
        { id: "date-iq", title: "Date Night IQ", description: "Your evening profile plus date moves that actually fit your style", icon: Stars, path: "/quiz/date-night-iq", duration: "3 min", questions: "8 Q", badge: "Applied" },
      ],
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-2">Self-awareness</p>
            <h1 className="text-display text-foreground mb-2">Mind</h1>
            <p className="text-body max-w-sm mx-auto">
              Evidence-based quizzes — built for men who'd rather do the work than fake it.
            </p>
          </div>
        </header>

        {sections.map((section, si) => (
          <section key={section.title} className={`space-y-3 animate-in-delay-${Math.min(si + 1, 3)}`}>
            <div className="section-header">
              <div>
                <h2 className="section-title">{section.title}</h2>
                <p className="text-[11px] text-muted-foreground">{section.sub}</p>
              </div>
            </div>
            {section.quizzes.map((quiz) => {
              const Icon = quiz.icon;
              return (
                <button
                  key={quiz.id}
                  onClick={() => navigate(quiz.path)}
                  className="card-premium w-full flex items-start gap-4 text-left group"
                >
                  <div className="icon-premium">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-foreground">{quiz.title}</h3>
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
                      <span className="chip text-[10px] py-0.5 px-2 opacity-70">{quiz.badge}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              );
            })}
          </section>
        ))}

        <PoweredByTLC />
      </div>
    </div>
  );
}
