import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { mbtiQuestions, getMBTITraits } from "@/data/mbtiQuiz";
import { MBTIScores } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ArrowLeft, Brain, RotateCcw, Share2 } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";

export default function QuizMBTI() {
  useTesterCheck();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (Object.keys(answers).length !== mbtiQuestions.length) {
      toast.error("Please rate all statements");
      return;
    }

    const scores: MBTIScores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    mbtiQuestions.forEach((q, idx) => {
      const rating = answers[idx];
      const centered = rating - 3;
      scores[q.k] += centered * q.dir;
    });

    const type = `${scores.EI >= 0 ? "E" : "I"}${scores.SN >= 0 ? "S" : "N"}${scores.TF >= 0 ? "T" : "F"}${
      scores.JP >= 0 ? "J" : "P"
    }`;

    storage.saveMBTIScores(scores);
    setResult(type);
    toast.success("Assessment complete!");
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `My personality type is ${result}!`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        navigator.clipboard.writeText(result);
        toast.success("Copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(result);
      toast.success("Copied to clipboard!");
    }
  };

  const traits = result ? getMBTITraits(result) : null;
  const progress = (Object.keys(answers).length / mbtiQuestions.length) * 100;

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
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Personality Type</h1>
              <p className="text-xs text-muted-foreground">16 personalities assessment</p>
            </div>
          </div>

          {!result && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Object.keys(answers).length}/{mbtiQuestions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </header>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in-delay-1">
            {mbtiQuestions.map((q, idx) => (
              <div key={idx} className="card-luxury p-4">
                <p className="text-sm text-foreground mb-3">{q.t}</p>
                <RadioGroup
                  value={answers[idx]?.toString()}
                  onValueChange={(val) => setAnswers({ ...answers, [idx]: parseInt(val, 10) })}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground">Disagree</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <label
                          key={v}
                          htmlFor={`q${idx}-${v}`}
                          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all text-sm font-medium ${
                            answers[idx] === v
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80 text-muted-foreground"
                          }`}
                        >
                          <RadioGroupItem value={v.toString()} id={`q${idx}-${v}`} className="sr-only" />
                          {v}
                        </label>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Agree</span>
                  </div>
                </RadioGroup>
              </div>
            ))}

            <button type="submit" className="btn-primary w-full h-12">
              See My Type
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in">
            {/* Result Badge */}
            <div className="card-highlight text-center py-6">
              <p className="text-caption mb-2">Your Type</p>
              <div className="inline-flex items-center gap-2">
                <span className="text-4xl font-display font-bold text-primary">{result}</span>
                <button onClick={handleShare} className="btn-ghost p-2">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Strengths */}
            <div className="card-luxury">
              <h4 className="font-semibold text-foreground mb-3">Strengths on Dates</h4>
              <ul className="space-y-2">
                {traits?.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-muted-foreground">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Watch-outs */}
            <div className="card-luxury">
              <h4 className="font-semibold text-foreground mb-3">Watch-outs</h4>
              <ul className="space-y-2">
                {traits?.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span className="text-muted-foreground">{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Date Ideas */}
            <div className="card-luxury">
              <h4 className="font-semibold text-foreground mb-3">Date Ideas for {result}</h4>
              <ul className="space-y-2">
                {traits?.ideas.map((idea, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setResult(null)} className="btn-secondary w-full">
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
