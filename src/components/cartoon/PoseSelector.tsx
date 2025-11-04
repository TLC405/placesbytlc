import { Card } from "@/components/ui/card";

export type Pose = "portrait" | "waist-up" | "full-body" | "action" | "heroic";

const poses = [
  { id: "portrait", icon: "👤", label: "Portrait" },
  { id: "waist-up", icon: "🧍", label: "Waist-Up" },
  { id: "full-body", icon: "🚶", label: "Full-Body" },
  { id: "action", icon: "🏃", label: "Action" },
  { id: "heroic", icon: "🦸", label: "Heroic" },
];

interface PoseSelectorProps {
  value: Pose;
  onChange: (pose: Pose) => void;
}

export function PoseSelector({ value, onChange }: PoseSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Character Pose</h3>
      <div className="grid grid-cols-5 gap-2">
        {poses.map((pose) => (
          <Card
            key={pose.id}
            onClick={() => onChange(pose.id as Pose)}
            className={`p-3 cursor-pointer text-center transition-all hover:scale-105 ${
              value === pose.id
                ? "border-2 border-primary bg-primary/10"
                : "border border-border hover:border-primary/50"
            }`}
          >
            <div className="text-2xl mb-1">{pose.icon}</div>
            <div className="text-[10px] font-medium">{pose.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
