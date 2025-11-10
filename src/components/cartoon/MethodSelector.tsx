import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Target } from "lucide-react";

export type GenerationMethod = "instant-id" | "lora" | "dreambooth";

interface MethodSelectorProps {
  method: GenerationMethod;
  onMethodChange: (method: GenerationMethod) => void;
  idWeight: number;
  onIdWeightChange: (weight: number) => void;
}

const METHODS = [
  {
    id: "instant-id" as const,
    name: "InstantID",
    icon: Zap,
    speed: "⚡ Instant",
    quality: "⭐⭐⭐",
    description: "Face-reference (no training). Upload 3–5 best refs. Perfect for quick tests.",
    time: "< 1 min",
    bestFor: "Quick previews, testing styles",
    idWeightRange: [0.9, 1.1],
    color: "cyan",
  },
  {
    id: "lora" as const,
    name: "LoRA Mini-Tune",
    icon: Target,
    speed: "⚡⚡ Fast",
    quality: "⭐⭐⭐⭐",
    description: "10–20 refs. Best balance of fidelity + style freedom.",
    time: "15–30 min",
    bestFor: "Production-ready results",
    idWeightRange: [0.8, 1.2],
    color: "lime",
  },
  {
    id: "dreambooth" as const,
    name: "DreamBooth",
    icon: Clock,
    speed: "⚡⚡⚡ Power",
    quality: "⭐⭐⭐⭐⭐",
    description: "Full tune. Maximum fidelity. Use only if first two fail.",
    time: "45–90 min",
    bestFor: "Perfect identity match",
    idWeightRange: [0.7, 1.3],
    color: "fuchsia",
  },
];

export function MethodSelector({
  method,
  onMethodChange,
  idWeight,
  onIdWeightChange,
}: MethodSelectorProps) {
  const selectedMethod = METHODS.find((m) => m.id === method)!;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg font-bold">Generation Method</Label>
        <p className="text-sm text-muted-foreground">
          Choose based on time vs quality tradeoff
        </p>
      </div>

      {/* Method Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {METHODS.map((m) => {
          const Icon = m.icon;
          const isSelected = m.id === method;
          return (
            <button
              key={m.id}
              onClick={() => onMethodChange(m.id)}
              className={`text-left transition-all ${
                isSelected ? "scale-105" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Card className={`border-2 ${
                isSelected
                  ? `border-${m.color}-400 bg-${m.color}-50`
                  : "border-border"
              }`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-6 h-6 text-${m.color}-500`} />
                    <Badge variant={isSelected ? "default" : "secondary"}>
                      {m.speed}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {m.description}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">⏱️ {m.time}</span>
                    <span className="text-muted-foreground">{m.quality}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    Best for: {m.bestFor}
                  </p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* ID Weight Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-bold">ID Weight: {idWeight.toFixed(2)}</Label>
          <Badge variant="outline">
            Range: {selectedMethod.idWeightRange[0]} – {selectedMethod.idWeightRange[1]}
          </Badge>
        </div>
        <Slider
          value={[idWeight]}
          onValueChange={([v]) => onIdWeightChange(v)}
          min={selectedMethod.idWeightRange[0]}
          max={selectedMethod.idWeightRange[1]}
          step={0.01}
          className="py-4"
        />
        <div className="grid grid-cols-3 text-xs text-muted-foreground">
          <span>Lower = More Style</span>
          <span className="text-center font-semibold text-foreground">
            Perfect Identity
          </span>
          <span className="text-right">Higher = Max Fidelity</span>
        </div>
      </div>
    </div>
  );
}
