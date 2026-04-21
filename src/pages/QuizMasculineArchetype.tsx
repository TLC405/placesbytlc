import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { archetypeQuestions, archetypeLabels, archetypeDescriptions, archetypeDatingTips, type Archetype } from "@/data/masculineArchetypeQuiz";
import { toast } from "sonner";
import { ArrowLeft, Crown, RotateCcw, Sparkles, Trophy } from "lucide-react";

type Scores = Record<Archetype, number>;

export default function QuizMasculineArchetype() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Scores | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length !== archetypeQuestions.length) {
      toast.error("Answer every question");
      return;
    }
    const scores: Scores = { KING: 0, WARRIOR: 0, MAGICIAN: 0, LOVER: 0 };
    archetypeQuestions.forEach((q, idx) => {
      scores[q.options[answers[idx]].k]++;
    });
    setResult(scores);
    toast.success("Archetype unlocked 👑");
    try { localStorage.setItem("deeper_archetype", JSON.stringify(scores)); } catch {}
  };

  const sorted = result ? (Object.entries(result) as [Archetype, number][]).sort((a, b) => b[1] - a[1]) : [];
  const top = sorted[0]?.[0];
  const max = sorted[0]?.[1] || 1;
  const progress = (Object.keys(answers).length / archetypeQuestions.length) * 100;

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        <header className="pt-2 animate-in">
          <button onClick={() => navigate("/quizzes")} className="btn-ghost -ml-3 mb-4">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-premium">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground">Self Recon</p>
              <h1 className="text-headline text-foreground">Masculine Archetype</h1>
            </div>
          </div>
          {!result && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Object.keys(answers).length}/{archetypeQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </header>

        {!result ? (
          <form onSubmit={submit} className="space-y-4 animate-in-delay-1">
            {archetypeQuestions.map((q, idx) => (
              <div key={idx} className="card-luxury p-4">
                <div className="text-caption mb-1">Question {idx + 1}</div>
                <p className="text-sm font-medium text-foreground mb-3">{q.q}</p>
                <RadioGroup
                  value={answers[idx]?.toString()}
                  onValueChange={(v) => setAnswers({ ...answers, [idx]: parseInt(v) })}
                  className="space-y-2"
                >
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      htmlFor={`a${idx}-${oi}`}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        answers[idx] === oi ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem value={oi.toString()} id={`a${idx}-${oi}`} className="mt-0.5" />
                      <span className="text-sm">{opt.t}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <button type="submit" className="btn-primary w-full h-12">Reveal My Archetype</button>
          </form>
        ) : (
          <div className="space-y-6 animate-in">
            <div className="card-highlight">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-caption">Your dominant archetype</span>
              </div>
              <h3 className="text-display text-foreground mb-2">{archetypeLabels[top!]}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{archetypeDescriptions[top!]}</p>
            </div>

            <div className="card-luxury">
              <h4 className="font-semibold text-foreground mb-4">Full breakdown</h4>
              <div className="space-y-3">
                {sorted.map(([k, v], idx) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`font-medium ${idx === 0 ? "text-primary" : "text-foreground"}`}>
                        {idx === 0 && "👑 "}{archetypeLabels[k]}
                      </span>
                      <span className="text-muted-foreground">{v} pts</span>
                    </div>
                    <Progress value={(v / max) * 100} className={`h-2 ${idx === 0 ? "[&>div]:bg-primary" : ""}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-luxury">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Dating playbook for The {archetypeLabels[top!].replace("The ", "")}</h4>
              </div>
              <ul className="space-y-2">
                {archetypeDatingTips[top!].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold mt-0.5">→</span>
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setResult(null); setAnswers({}); }} className="btn-secondary">
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              <button onClick={() => navigate("/recon")} className="btn-primary">Plan a date</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
