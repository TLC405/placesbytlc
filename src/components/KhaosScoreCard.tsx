import { Shield, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

interface KhaosScore {
  score_total: number;
  components: {
    reliability: number;
    experience: number;
    safety: number;
    transparency: number;
    media: number;
  };
  explain: Record<string, string>;
  confidence: string;
}

interface Props {
  score: KhaosScore;
  organizerName: string;
}

const confidenceColors: Record<string, string> = {
  high: "text-green-500",
  medium: "text-yellow-500",
  low: "text-muted-foreground",
};

export const KhaosScoreCard = ({ score, organizerName }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const radarData = [
    { label: "Reliability", value: score.components.reliability * 10, fullMark: 10 },
    { label: "Experience", value: score.components.experience * 10, fullMark: 10 },
    { label: "Safety", value: score.components.safety * 10, fullMark: 10 },
    { label: "Transparency", value: score.components.transparency * 10, fullMark: 10 },
    { label: "Media", value: score.components.media * 10, fullMark: 10 },
  ];

  const scoreColor = score.score_total >= 7 ? "text-green-500" : score.score_total >= 5 ? "text-yellow-500" : "text-red-400";

  return (
    <div className="card-premium p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="icon-premium w-10 h-10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">KHAOS Score</p>
            <p className="text-caption">{organizerName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${scoreColor}`}>{score.score_total.toFixed(1)}</p>
          <p className={`text-[10px] font-medium uppercase ${confidenceColors[score.confidence]}`}>
            {score.confidence === "low" && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
            {score.confidence} confidence
          </p>
        </div>
      </div>

      {score.confidence === "low" && (
        <div className="bg-muted/50 rounded-lg p-2.5 text-xs text-muted-foreground">
          ⚠️ Insufficient data for confident scoring. Score is preliminary.
        </div>
      )}

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-primary font-medium w-full justify-center">
        {expanded ? "Hide details" : "Why this score?"}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="space-y-2 animate-in text-xs">
          {score.explain.summary && (
            <p className="text-foreground font-medium">{score.explain.summary}</p>
          )}
          {score.explain.ai_summary && (
            <p className="text-muted-foreground italic">{score.explain.ai_summary}</p>
          )}
          {["reliability", "experience", "safety", "transparency", "media"].map((key) => (
            score.explain[key] && (
              <div key={key} className="flex gap-2">
                <span className="capitalize font-medium text-foreground w-24 flex-shrink-0">{key}:</span>
                <span className="text-muted-foreground">{score.explain[key]}</span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export const KhaosScoreBadge = ({ score }: { score: number }) => {
  const color = score >= 7 ? "bg-green-500/10 text-green-600" : score >= 5 ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-500";
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
      <Shield className="w-2.5 h-2.5" />
      {score.toFixed(1)}
    </span>
  );
};
