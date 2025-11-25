import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  relationshipStylePairs,
  relationshipStyleLabels,
  relationshipStyleDescriptions,
  relationshipStyleIdeas,
  type RelationshipStylePair
} from "@/data/relationshipStyleQuiz";

const styleColors = {
  ADVENTURER: "from-orange-500 to-red-500",
  NURTURER: "from-green-500 to-emerald-500",
  INTELLECTUAL: "from-blue-500 to-purple-500",
  ROMANTIC: "from-pink-500 to-rose-500",
  PRAGMATIC: "from-slate-500 to-gray-600",
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

  if (finished) {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-green-400 font-mono p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="outline"
            onClick={() => navigate("/quizzes")}
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            [BACK_TO_QUIZZES]
          </Button>

          <Card className="border-2 border-green-500/30 bg-black/80 backdrop-blur-sm shadow-2xl shadow-green-500/20">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className={`text-6xl mb-4 p-6 rounded-full bg-gradient-to-br ${styleColors[topStyle]} flex items-center justify-center animate-pulse shadow-glow`}>
                  {styleEmojis[topStyle]}
                </div>
              </div>
              <CardTitle className="text-4xl font-black text-green-400">
                [ANALYSIS_COMPLETE]
              </CardTitle>
              <CardDescription className="text-xl font-bold text-green-500">
                Your Primary Relationship Style: {relationshipStyleLabels[topStyle]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
                <p className="text-lg leading-relaxed font-medium text-green-300">
                  {relationshipStyleDescriptions[topStyle]}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-black mb-4 text-green-400 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  [YOUR_STYLE_BREAKDOWN]
                </h3>
                <div className="space-y-3">
                  {sortedScores.map(([style, score]) => (
                    <div key={style} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 font-bold text-green-400">
                          <span className="text-2xl">{styleEmojis[style as keyof typeof styleEmojis]}</span>
                          <span>{relationshipStyleLabels[style as keyof typeof relationshipStyleLabels]}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                          {score} / {relationshipStylePairs.length}
                        </Badge>
                      </div>
                      <Progress 
                        value={(score / relationshipStylePairs.length) * 100} 
                        className="h-2 bg-green-950 border border-green-500/30"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
                <h3 className="text-xl font-black mb-3 text-purple-400 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  [PERFECT_DATE_IDEAS]
                </h3>
                <ul className="space-y-2">
                  {relationshipStyleIdeas[topStyle].map((idea, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-purple-300 font-medium">
                      <span className="text-purple-400 font-black">▸</span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    setCurrentIndex(0);
                    setScores({ ADVENTURER: 0, NURTURER: 0, INTELLECTUAL: 0, ROMANTIC: 0, PRAGMATIC: 0 });
                    setFinished(false);
                  }}
                  variant="outline"
                  className="h-12 border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  [RETAKE_QUIZ]
                </Button>
                <Button
                  onClick={() => navigate("/quizzes")}
                  className="h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-black"
                >
                  [EXPLORE_MORE_QUIZZES]
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-green-400 font-mono p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/quizzes")}
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            [EXIT]
          </Button>
          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2">
            QUESTION {currentIndex + 1} / {relationshipStylePairs.length}
          </Badge>
        </div>

        <Progress value={progress} className="h-2 bg-green-950 border border-green-500/30" />

        <Card className="border-2 border-green-500/30 bg-black/80 backdrop-blur-sm shadow-2xl shadow-green-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-center text-green-400">
              [RELATIONSHIP_STYLE_ANALYSIS]
            </CardTitle>
            <CardDescription className="text-center text-lg font-bold text-green-500">
              Choose the statement that resonates more with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleAnswer(currentPair.a.k)}
              className="w-full h-auto p-6 text-left border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 text-green-400 font-bold text-lg transition-all"
              variant="outline"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{styleEmojis[currentPair.a.k]}</span>
                <span>{currentPair.a.t}</span>
              </div>
            </Button>
            
            <div className="text-center text-green-500/50 font-black">OR</div>
            
            <Button
              onClick={() => handleAnswer(currentPair.b.k)}
              className="w-full h-auto p-6 text-left border-2 border-green-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-green-400 font-bold text-lg transition-all"
              variant="outline"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{styleEmojis[currentPair.b.k]}</span>
                <span>{currentPair.b.t}</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-green-500/50 font-bold">
          [TERMINAL_SECURE] • [DATA_ENCRYPTED] • [PRIVACY_PROTECTED]
        </div>
      </div>
    </div>
  );
}
