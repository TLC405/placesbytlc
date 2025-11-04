import { Card } from "@/components/ui/card";

export type Emotion = "neutral" | "happy" | "excited" | "serious" | "surprised" | "silly" | "cool";

const emotions = [
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "serious", emoji: "😎", label: "Serious" },
  { id: "surprised", emoji: "😲", label: "Surprised" },
  { id: "silly", emoji: "🤪", label: "Silly" },
  { id: "cool", emoji: "😏", label: "Cool" },
];

interface EmotionPickerProps {
  value: Emotion;
  onChange: (emotion: Emotion) => void;
}

export function EmotionPicker({ value, onChange }: EmotionPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Expression Override</h3>
      <div className="grid grid-cols-7 gap-2">
        {emotions.map((emotion) => (
          <Card
            key={emotion.id}
            onClick={() => onChange(emotion.id as Emotion)}
            className={`p-2 cursor-pointer text-center transition-all hover:scale-110 ${
              value === emotion.id
                ? "border-2 border-primary bg-primary/10"
                : "border border-border hover:border-primary/50"
            }`}
          >
            <div className="text-2xl mb-1">{emotion.emoji}</div>
            <div className="text-[9px] font-medium">{emotion.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
