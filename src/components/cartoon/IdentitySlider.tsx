import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface IdentitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function IdentitySlider({ value, onChange }: IdentitySliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">
          Identity Preservation
        </Label>
        <span className="text-sm font-bold text-primary">{value}%</span>
      </div>
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Style Freedom ↔</span>
          <span>↔ Identity Lock</span>
        </div>
      </div>
    </div>
  );
}
