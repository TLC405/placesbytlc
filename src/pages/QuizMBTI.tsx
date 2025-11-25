import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mbtiQuestions, getMBTITraits } from "@/data/mbtiQuiz";
import { MBTIScores } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ArrowLeft, Share2 } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";

export default function QuizMBTI() {
  useTesterCheck();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check all answered
    if (Object.keys(answers).length !== mbtiQuestions.length) {
      toast.error("Please rate every statement.");
      return;
    }

    // Calculate scores
    const scores: MBTIScores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    mbtiQuestions.forEach((q, idx) => {
      const rating = answers[idx];
      const centered = rating - 3; // Convert 1-5 to -2 to +2
      scores[q.k] += centered * q.dir;
    });

    const type = `${scores.EI >= 0 ? "E" : "I"}${scores.SN >= 0 ? "S" : "N"}${scores.TF >= 0 ? "T" : "F"}${
      scores.JP >= 0 ? "J" : "P"
    }`;

    storage.saveMBTIScores(scores);
    setResult(type);
    toast.success("Assessment completed!");
  };

  const handleShare = async () => {
    if (!result) return;
    
    const text = `My type is ${result} on TLC Date Night`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        // Fallback to clipboard
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
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">Personality Match (16‑Type)</CardTitle>
            <Link to="/quizzes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <CardDescription>
            Rate how much you agree with each statement (1–5). Relationship‑centric prompts only.
          </CardDescription>
          {!result && <Progress value={progress} className="mt-4" />}
        </CardHeader>
        <CardContent>
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {mbtiQuestions.map((q, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4 space-y-3">
                  <div className="text-sm mb-3">{q.t}</div>
                  <RadioGroup
                    value={answers[idx]?.toString()}
                    onValueChange={(val) => setAnswers({ ...answers, [idx]: parseInt(val, 10) })}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">Strongly Disagree</span>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <Label
                          key={v}
                          htmlFor={`q${idx}-${v}`}
                          className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                          <RadioGroupItem value={v.toString()} id={`q${idx}-${v}`} />
                          <span className="text-xs">{v}</span>
                        </Label>
                      ))}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">Strongly Agree</span>
                    </div>
                  </RadioGroup>
                </div>
              ))}
              <Button type="submit" className="w-full" size="lg">
                Get Type
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">Your Type:</h3>
                    <Badge className="gradient-primary text-lg px-4 py-1">{result}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Strengths on dates</h4>
                    <ul className="space-y-1">
                      {traits?.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-success">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Watch‑outs</h4>
                    <ul className="space-y-1">
                      {traits?.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Date ideas tuned to {result}</h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {traits?.ideas.map((idea, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm bg-accent/30 rounded-lg p-2">
                        <span className="text-primary">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                Retake Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
