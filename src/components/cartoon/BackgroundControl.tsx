import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type BackgroundMode = "auto" | "minimal" | "immersive";

interface BackgroundControlProps {
  value: BackgroundMode;
  onChange: (value: BackgroundMode) => void;
}

export function BackgroundControl({ value, onChange }: BackgroundControlProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground">Background Style</Label>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as BackgroundMode)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="auto" id="bg-auto" />
          <Label htmlFor="bg-auto" className="font-normal cursor-pointer">
            <span className="font-semibold">Auto</span> - Style-appropriate scene
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="minimal" id="bg-minimal" />
          <Label htmlFor="bg-minimal" className="font-normal cursor-pointer">
            <span className="font-semibold">Minimal</span> - Clean gradient
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="immersive" id="bg-immersive" />
          <Label htmlFor="bg-immersive" className="font-normal cursor-pointer">
            <span className="font-semibold">Immersive</span> - Rich detailed environment
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
