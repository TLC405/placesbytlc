import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { loveLanguagePairs, loveLanguageLabels, loveLanguageIdeas } from "@/data/loveLanguageQuiz";
import { LoveLanguageScores } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ArrowLeft, Heart, RotateCcw } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";

export default function QuizLove() {
  useTesterCheck();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, "A" | "B">>({});
  const [result, setResult] = useState<LoveLanguageScores | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (Object.keys(answers).length !== loveLanguagePairs.length) {
      toast.error("Please answer all questions");
      return;
    }

    const scores: LoveLanguageScores = { WORDS: 0, ACTS: 0, GIFTS: 0, TIME: 0, TOUCH: 0 };
    loveLanguagePairs.forEach((pair, idx) => {
      const choice = answers[idx];
      const pick = choice === "A" ? pair.a : pair.b;
      scores[pick.k]++;
    });

    storage.saveLoveScores(scores);
    setResult(scores);
    toast.success("Quiz completed!");
  };

  const sortedScores = result
    ? Object.entries(result)
        .map(([k, v]) => ({ k, v }))
        .sort((a, b) => b.v - a.v)
    : [];

  const topLanguages = sortedScores.slice(0, 2).map((x) => x.k);
  const dateIdeas = topLanguages.flatMap((k) => loveLanguageIdeas[k] || []).slice(0, 5);

  const progress = (Object.keys(answers).length / loveLanguagePairs.length) * 100;

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        {/* Header */}
        <header className="pt-2 animate-in">
          <button onClick={() => navigate("/quizzes")} className="btn-ghost -ml-3 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Love Language</h1>
              <p className="text-xs text-muted-foreground">
                Discover how you express love
              </p>
            </div>
          </div>

          {!result && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Object.keys(answers).length}/{loveLanguagePairs.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </header>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in-delay-1">
            {loveLanguagePairs.map((pair, idx) => (
              <div key={idx} className="card-luxury p-4">
                <div className="text-caption mb-3">Question {idx + 1}</div>
                <RadioGroup
                  value={answers[idx]}
                  onValueChange={(val) => setAnswers({ ...answers, [idx]: val as "A" | "B" })}
                  className="space-y-2"
                >
                  <label
                    htmlFor={`pair${idx}-a`}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      answers[idx] === "A"
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <RadioGroupItem value="A" id={`pair${idx}-a`} className="mt-0.5" />
                    <span className="text-sm">{pair.a.t}</span>
                  </label>
                  <label
                    htmlFor={`pair${idx}-b`}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      answers[idx] === "B"
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <RadioGroupItem value="B" id={`pair${idx}-b`} className="mt-0.5" />
                    <span className="text-sm">{pair.b.t}</span>
                  </label>
                </RadioGroup>
              </div>
            ))}
            
            <button type="submit" className="btn-primary w-full h-12">
              See My Results
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in">
            {/* Results */}
            <div className="card-highlight">
              <h3 className="text-headline text-foreground mb-4">Your Results</h3>
              <div className="space-y-4">
                {sortedScores.map((x, idx) => (
                  <div key={x.k}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`font-medium ${idx === 0 ? "text-primary" : "text-foreground"}`}>
                        {idx === 0 && "🏆 "}
                        {loveLanguageLabels[x.k]}
                      </span>
                      <span className="text-muted-foreground">
                        {x.v}/{loveLanguagePairs.length}
                      </span>
                    </div>
                    <Progress 
                      value={(x.v / loveLanguagePairs.length) * 100} 
                      className={`h-2 ${idx === 0 ? "[&>div]:bg-primary" : ""}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Date Ideas */}
            <div className="card-luxury">
              <h4 className="font-semibold text-foreground mb-3">
                Date Ideas For You
              </h4>
              <ul className="space-y-2">
                {dateIdeas.map((idea, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setResult(null)} className="btn-secondary w-full">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
