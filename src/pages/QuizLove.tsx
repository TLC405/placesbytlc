import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { loveLanguagePairs, loveLanguageLabels, loveLanguageIdeas } from "@/data/loveLanguageQuiz";
import { LoveLanguageScores } from "@/types";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useTesterCheck } from "@/hooks/useTesterCheck";

export default function QuizLove() {
  useTesterCheck();
  const [answers, setAnswers] = useState<Record<number, "A" | "B">>({});
  const [result, setResult] = useState<LoveLanguageScores | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check all answered
    if (Object.keys(answers).length !== loveLanguagePairs.length) {
      toast.error("Please answer all pairs.");
      return;
    }

    // Calculate scores
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
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">Love Language Quiz</CardTitle>
            <Link to="/quizzes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <CardDescription>
            Choose which statement feels more caring to you in each pair.
          </CardDescription>
          {!result && <Progress value={progress} className="mt-4" />}
        </CardHeader>
        <CardContent>
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {loveLanguagePairs.map((pair, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4 space-y-3">
                  <div className="text-sm font-semibold text-muted-foreground">Pair {idx + 1}</div>
                  <RadioGroup
                    value={answers[idx]}
                    onValueChange={(val) => setAnswers({ ...answers, [idx]: val as "A" | "B" })}
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                      <RadioGroupItem value="A" id={`pair${idx}-a`} />
                      <Label htmlFor={`pair${idx}-a`} className="cursor-pointer flex-1">
                        {pair.a.t}
                      </Label>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                      <RadioGroupItem value="B" id={`pair${idx}-b`} />
                      <Label htmlFor={`pair${idx}-b`} className="cursor-pointer flex-1">
                        {pair.b.t}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
              <Button type="submit" className="w-full" size="lg">
                See Results
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Your Top Languages</h3>
                <div className="space-y-3">
                  {sortedScores.map((x) => (
                    <div key={x.k}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{loveLanguageLabels[x.k]}</span>
                        <span className="text-muted-foreground">
                          {x.v}/{loveLanguagePairs.length}
                        </span>
                      </div>
                      <Progress value={(x.v / loveLanguagePairs.length) * 100} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="font-semibold mb-3">Date ideas tailored to your top 2:</h4>
                <ul className="space-y-2">
                  {dateIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm">{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                Retake Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
