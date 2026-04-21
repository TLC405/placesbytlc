import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  dateNightQuestions,
  dateVibeLabels,
  dateVibeDescriptions,
  dateVibeRecommendations,
  DateVibe,
} from "@/data/dateNightIQQuiz";
import { toast } from "sonner";
import { ArrowLeft, Stars, RotateCcw, MapPin, Sparkles } from "lucide-react";

type Scores = Record<DateVibe, number>;

export default function QuizDateNightIQ() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Scores | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length !== dateNightQuestions.length) {
      toast.error("Please answer every question");
      return;
    }
    const scores: Scores = { ROMANTIC: 0, ADVENTUROUS: 0, CHILL: 0, SOCIAL: 0, CULTURED: 0 };
    dateNightQuestions.forEach((q, idx) => {
      const opt = q.options[answers[idx]];
      scores[opt.k]++;
    });
    setResult(scores);
    toast.success("Your Date Night IQ is unlocked 🌟");
    try { localStorage.setItem("date_night_iq", JSON.stringify(scores)); } catch {}
  };

  const sorted = result
    ? (Object.entries(result) as [DateVibe, number][]).sort((a, b) => b[1] - a[1])
    : [];
  const top = sorted[0]?.[0];
  const iq = result ? Math.round((sorted[0][1] / dateNightQuestions.length) * 100 + 60) : 0;
  const progress = (Object.keys(answers).length / dateNightQuestions.length) * 100;

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        <header className="pt-2 animate-in">
          <button onClick={() => navigate("/quizzes")} className="btn-ghost -ml-3 mb-4">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Stars className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Date Night IQ</h1>
              <p className="text-xs text-muted-foreground">Your personal evening profile</p>
            </div>
          </div>

          {!result && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Object.keys(answers).length}/{dateNightQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </header>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in-delay-1">
            {dateNightQuestions.map((q, idx) => (
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
                      htmlFor={`d${idx}-${oi}`}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        answers[idx] === oi
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem value={oi.toString()} id={`d${idx}-${oi}`} className="mt-0.5" />
                      <span className="text-sm">{opt.t}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <button type="submit" className="btn-primary w-full h-12">
              Calculate My Date Night IQ
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in">
            <div className="card-highlight text-center">
              <span className="text-caption">Date Night IQ</span>
              <div className="text-5xl font-bold text-primary my-2">{iq}</div>
              <h3 className="text-headline text-foreground mb-2">{dateVibeLabels[top!]}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{dateVibeDescriptions[top!]}</p>
            </div>

            <div className="card-luxury">
              <h4 className="font-semibold text-foreground mb-4">Your vibe blend</h4>
              <div className="space-y-3">
                {sorted.map(([k, v], idx) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`font-medium ${idx === 0 ? "text-primary" : "text-foreground"}`}>
                        {idx === 0 && "🏆 "}{dateVibeLabels[k]}
                      </span>
                      <span className="text-muted-foreground">{v}/{dateNightQuestions.length}</span>
                    </div>
                    <Progress value={(v / dateNightQuestions.length) * 100} className={`h-2 ${idx === 0 ? "[&>div]:bg-primary" : ""}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-luxury">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">OKC dates curated for you</h4>
              </div>
              <ul className="space-y-2">
                {dateVibeRecommendations[top!].map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
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
                Build my date
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
