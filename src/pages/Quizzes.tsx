import { useNavigate } from "react-router-dom";
import { Heart, Brain, Users, ChevronRight, ArrowLeft, Crown, Flame, Users2, Stars, Clock, Sparkles } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";

export default function Quizzes() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Self Recon",
      sub: "Understand the man you are",
      quizzes: [
        { id: "archetype", title: "Masculine Archetype", description: "King, Warrior, Magician, or Lover — Robert Moore framework adapted for modern dating", icon: Crown, path: "/quiz/masculine-archetype", duration: "4 min", questions: "8 Q", badge: "NEW", isNew: true },
        { id: "confidence", title: "Dating Confidence Index", description: "Approach anxiety, follow-through, emotional regulation — your real number, no fluff", icon: Flame, path: "/quiz/dating-confidence", duration: "3 min", questions: "10 Q", badge: "NEW", isNew: true },
        { id: "mbti", title: "Personality Type (MBTI)", description: "16-type cognitive profile + how your type pairs in relationships", icon: Brain, path: "/quiz/mbti", duration: "8 min", questions: "20 Q", badge: "16 types" },
      ],
    },
    {
      title: "Decode Her",
      sub: "Read the dynamic, win the game",
      quizzes: [
        { id: "love", title: "Love Language", description: "How YOU give love + how to spot HER primary language", icon: Heart, path: "/quiz/love", duration: "5 min", questions: "15 Q", badge: "Chapman" },
        { id: "style", title: "Attachment Style", description: "Anxious, avoidant, secure — how you bond and what derails you", icon: Users, path: "/quiz/relationship-style", duration: "6 min", questions: "12 Q", badge: "Bowlby" },
        { id: "compatibility", title: "Compatibility", description: "Gottman-inspired analysis: communication, conflict, intimacy, values, growth", icon: Users2, path: "/quiz/compatibility", duration: "4 min", questions: "10 Q", badge: "Gottman" },
      ],
    },
    {
      title: "Tactical",
      sub: "Skills you can deploy tonight",
      quizzes: [
        { id: "date-iq", title: "Date Night IQ", description: "Personal evening profile + curated date moves matched to your blend", icon: Stars, path: "/quiz/date-night-iq", duration: "3 min", questions: "8 Q", badge: "Tactical" },
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
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-2">Self Recon</p>
            <h1 className="text-display text-foreground mb-2">Psych</h1>
            <p className="text-body max-w-sm mx-auto">
              Evidence-based assessments for men — understand yourself, then decode her.
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
