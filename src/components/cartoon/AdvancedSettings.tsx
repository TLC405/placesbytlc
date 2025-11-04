import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface AdvancedSettingsState {
  resolution: "standard" | "hd" | "ultra";
  denoiseStrength: number;
  cfgScale: number;
  steps: number;
  exportFormat: "png" | "jpg" | "webp";
  compressionLevel: number;
}

interface AdvancedSettingsProps {
  settings: AdvancedSettingsState;
  onChange: (settings: AdvancedSettingsState) => void;
}

export function AdvancedSettings({ settings, onChange }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="font-semibold">⚙️ Advanced Settings</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg bg-card">
        <div className="space-y-2">
          <Label>Resolution</Label>
          <Select
            value={settings.resolution}
            onValueChange={(v) => onChange({ ...settings, resolution: v as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (1024px)</SelectItem>
              <SelectItem value="hd">HD (2048px)</SelectItem>
              <SelectItem value="ultra">Ultra (4096px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Denoise Strength</Label>
            <span className="text-sm text-muted-foreground">{settings.denoiseStrength}%</span>
          </div>
          <Slider
            value={[settings.denoiseStrength]}
            onValueChange={(v) => onChange({ ...settings, denoiseStrength: v[0] })}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>CFG Scale (Creativity)</Label>
            <span className="text-sm text-muted-foreground">{settings.cfgScale}</span>
          </div>
          <Slider
            value={[settings.cfgScale]}
            onValueChange={(v) => onChange({ ...settings, cfgScale: v[0] })}
            min={1}
            max={20}
            step={0.5}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Steps (Quality)</Label>
            <span className="text-sm text-muted-foreground">{settings.steps}</span>
          </div>
          <Slider
            value={[settings.steps]}
            onValueChange={(v) => onChange({ ...settings, steps: v[0] })}
            min={20}
            max={100}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select
            value={settings.exportFormat}
            onValueChange={(v) => onChange({ ...settings, exportFormat: v as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="webp">WEBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Compression Level</Label>
            <span className="text-sm text-muted-foreground">{settings.compressionLevel}%</span>
          </div>
          <Slider
            value={[settings.compressionLevel]}
            onValueChange={(v) => onChange({ ...settings, compressionLevel: v[0] })}
            min={0}
            max={100}
            step={10}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
