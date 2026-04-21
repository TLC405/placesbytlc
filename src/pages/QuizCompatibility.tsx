import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  compatibilityQuestions,
  compatLabels,
  compatDescriptions,
  compatRecommendations,
  CompatDimension,
} from "@/data/compatibilityQuiz";
import { toast } from "sonner";
import { ArrowLeft, Users2, RotateCcw, Sparkles, Trophy } from "lucide-react";

type Scores = Record<CompatDimension, number>;

export default function QuizCompatibility() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Scores | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length !== compatibilityQuestions.length) {
      toast.error("Please answer every question");
      return;
    }
    const scores: Scores = { COMM: 0, CONFLICT: 0, INTIMACY: 0, VALUES: 0, GROWTH: 0 };
    compatibilityQuestions.forEach((q, idx) => {
      const opt = q.options[answers[idx]];
      scores[opt.k] += opt.weight;
    });
    setResult(scores);
    toast.success("Your compatibility profile is ready ✨");
    try { localStorage.setItem("compat_scores", JSON.stringify(scores)); } catch {}
  };

  const sorted = result
    ? (Object.entries(result) as [CompatDimension, number][])
        .sort((a, b) => b[1] - a[1])
    : [];
  const top = sorted[0]?.[0];
  const max = sorted[0]?.[1] || 1;
  const progress = (Object.keys(answers).length / compatibilityQuestions.length) * 100;

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        <header className="pt-2 animate-in">
          <button onClick={() => navigate("/quizzes")} className="btn-ghost -ml-3 mb-4">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Users2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Compatibility</h1>
              <p className="text-xs text-muted-foreground">Gottman-inspired relational profile</p>
            </div>
          </div>

          {!result && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Object.keys(answers).length}/{compatibilityQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </header>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in-delay-1">
            {compatibilityQuestions.map((q, idx) => (
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
                      htmlFor={`c${idx}-${oi}`}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        answers[idx] === oi
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem value={oi.toString()} id={`c${idx}-${oi}`} className="mt-0.5" />
                      <span className="text-sm">{opt.t}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <button type="submit" className="btn-primary w-full h-12">
              Reveal My Compatibility Profile
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in">
            <div className="card-highlight">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-caption">Your dominant strength</span>
              </div>
              <h3 className="text-headline text-foreground mb-2">{compatLabels[top!]}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{compatDescriptions[top!]}</p>
            </div>

            <div className="card-luxury">
              <h4 className="font-semibold text-foreground mb-4">Full breakdown</h4>
              <div className="space-y-3">
                {sorted.map(([k, v], idx) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`font-medium ${idx === 0 ? "text-primary" : "text-foreground"}`}>
                        {idx === 0 && "🏆 "}{compatLabels[k]}
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
                <h4 className="font-semibold text-foreground">Grow this strength</h4>
              </div>
              <ul className="space-y-2">
                {compatRecommendations[top!].map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setResult(null); setAnswers({}); }} className="btn-secondary">
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              <button onClick={() => navigate("/places")} className="btn-primary">
                Find date spots
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
