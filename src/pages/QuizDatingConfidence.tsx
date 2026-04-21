import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { confidenceQuestions, tierFor } from "@/data/datingConfidenceQuiz";
import { toast } from "sonner";
import { ArrowLeft, Flame, RotateCcw, Sparkles } from "lucide-react";

export default function QuizDatingConfidence() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length !== confidenceQuestions.length) {
      toast.error("Answer every question");
      return;
    }
    let total = 0;
    confidenceQuestions.forEach((q, idx) => {
      total += q.options[answers[idx]].score;
    });
    setScore(total);
    toast.success("Confidence Index calculated 🔥");
    try { localStorage.setItem("deeper_confidence", JSON.stringify({ score: total, at: Date.now() })); } catch {}
  };

  const tier = score !== null ? tierFor(score) : null;
  const max = confidenceQuestions.length * 4;
  const pct = score !== null ? Math.round((score / max) * 100) : 0;
  const progress = (Object.keys(answers).length / confidenceQuestions.length) * 100;

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        <header className="pt-2 animate-in">
          <button onClick={() => navigate("/quizzes")} className="btn-ghost -ml-3 mb-4">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-premium">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground">Self Recon</p>
              <h1 className="text-headline text-foreground">Dating Confidence Index</h1>
            </div>
          </div>
          {score === null && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Object.keys(answers).length}/{confidenceQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </header>

        {score === null ? (
          <form onSubmit={submit} className="space-y-4 animate-in-delay-1">
            <p className="text-body text-sm">
              No fluff. Pick the answer that's actually true — not the one that sounds best.
            </p>
            {confidenceQuestions.map((q, idx) => (
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
                      htmlFor={`dc${idx}-${oi}`}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        answers[idx] === oi ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem value={oi.toString()} id={`dc${idx}-${oi}`} className="mt-0.5" />
                      <span className="text-sm">{opt.t}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <button type="submit" className="btn-primary w-full h-12">Calculate My Index</button>
          </form>
        ) : tier && (
          <div className="space-y-6 animate-in">
            <div className="card-highlight text-center">
              <span className="text-caption">Confidence Index</span>
              <div className="text-6xl font-black text-primary my-2">{pct}</div>
              <div className="text-3xl mb-2">{tier.emoji}</div>
              <h3 className="text-display text-foreground mb-2">{tier.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{tier.oneLiner}</p>
            </div>

            <div className="card-luxury">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">This week's focus</h4>
              </div>
              <ul className="space-y-2">
                {tier.focus.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold mt-0.5">→</span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setScore(null); setAnswers({}); }} className="btn-secondary">
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              <button onClick={() => navigate("/quiz/masculine-archetype")} className="btn-primary">Next quiz</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
