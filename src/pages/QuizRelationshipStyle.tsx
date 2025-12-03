import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, RotateCcw, Heart } from "lucide-react";
import {
  relationshipStylePairs,
  relationshipStyleLabels,
  relationshipStyleDescriptions,
  relationshipStyleIdeas,
  type RelationshipStylePair
} from "@/data/relationshipStyleQuiz";

const styleColors = {
  ADVENTURER: "bg-orange-100 dark:bg-orange-900/30 text-orange-500",
  NURTURER: "bg-green-100 dark:bg-green-900/30 text-green-500",
  INTELLECTUAL: "bg-blue-100 dark:bg-blue-900/30 text-blue-500",
  ROMANTIC: "bg-rose-100 dark:bg-rose-900/30 text-rose-500",
  PRAGMATIC: "bg-slate-100 dark:bg-slate-900/30 text-slate-500",
};

const styleEmojis = {
  ADVENTURER: "🏔️",
  NURTURER: "🤗",
  INTELLECTUAL: "🧠",
  ROMANTIC: "💕",
  PRAGMATIC: "🎯",
};

export default function QuizRelationshipStyle() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({
    ADVENTURER: 0,
    NURTURER: 0,
    INTELLECTUAL: 0,
    ROMANTIC: 0,
    PRAGMATIC: 0,
  });
  const [finished, setFinished] = useState(false);

  const currentPair = relationshipStylePairs[currentIndex];
  const progress = ((currentIndex + 1) / relationshipStylePairs.length) * 100;

  const handleAnswer = (key: RelationshipStylePair["a"]["k"]) => {
    setScores((prev) => ({ ...prev, [key]: prev[key] + 1 }));

    if (currentIndex < relationshipStylePairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const topStyle = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0] as keyof typeof scores;
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScores({ ADVENTURER: 0, NURTURER: 0, INTELLECTUAL: 0, ROMANTIC: 0, PRAGMATIC: 0 });
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="page-shell">
        <div className="page-content space-y-6">
          <header className="pt-2 animate-in">
            <button onClick={() => navigate("/quizzes")} className="btn-ghost -ml-3 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </header>

          {/* Result */}
          <div className="text-center animate-in">
            <span className="text-6xl mb-4 block">{styleEmojis[topStyle]}</span>
            <p className="text-caption mb-2">Your Style</p>
            <h1 className="text-display text-foreground mb-2">
              {relationshipStyleLabels[topStyle]}
            </h1>
            <p className="text-body max-w-sm mx-auto">
              {relationshipStyleDescriptions[topStyle]}
            </p>
          </div>

          {/* Breakdown */}
          <div className="card-luxury animate-in-delay-1">
            <h3 className="font-semibold text-foreground mb-4">Style Breakdown</h3>
            <div className="space-y-3">
              {sortedScores.map(([style, score], idx) => (
                <div key={style}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className={`font-medium ${idx === 0 ? "text-primary" : "text-foreground"}`}>
                      {styleEmojis[style as keyof typeof styleEmojis]}{" "}
                      {relationshipStyleLabels[style as keyof typeof relationshipStyleLabels]}
                    </span>
                    <span className="text-muted-foreground">
                      {score}/{relationshipStylePairs.length}
                    </span>
                  </div>
                  <Progress
                    value={(score / relationshipStylePairs.length) * 100}
                    className={`h-2 ${idx === 0 ? "[&>div]:bg-primary" : ""}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Date Ideas */}
          <div className="card-highlight animate-in-delay-2">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Perfect Date Ideas</h3>
            </div>
            <ul className="space-y-2">
              {relationshipStyleIdeas[topStyle].map((idea, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 animate-in-delay-3">
            <button onClick={resetQuiz} className="btn-secondary flex-1">
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button onClick={() => navigate("/quizzes")} className="btn-primary flex-1">
              More Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Relationship Style</h1>
              <p className="text-xs text-muted-foreground">
                Question {currentIndex + 1} of {relationshipStylePairs.length}
              </p>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </header>

        {/* Question */}
        <div className="space-y-3 animate-in-delay-1">
          <p className="text-caption text-center">Choose the one that resonates more</p>

          <button
            onClick={() => handleAnswer(currentPair.a.k)}
            className="card-luxury w-full p-5 text-left hover:border-primary/30 border-2 border-transparent"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{styleEmojis[currentPair.a.k]}</span>
              <span className="text-sm text-foreground">{currentPair.a.t}</span>
            </div>
          </button>

          <div className="text-center text-xs text-muted-foreground">or</div>

          <button
            onClick={() => handleAnswer(currentPair.b.k)}
            className="card-luxury w-full p-5 text-left hover:border-primary/30 border-2 border-transparent"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{styleEmojis[currentPair.b.k]}</span>
              <span className="text-sm text-foreground">{currentPair.b.t}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
