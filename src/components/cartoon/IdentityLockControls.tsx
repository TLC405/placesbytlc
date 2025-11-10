import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export interface IdentityLockSettings {
  lockEyebrows: boolean;
  lockEyeSpacing: boolean;
  lockNose: boolean;
  lockPhiltrum: boolean;
  lockLips: boolean;
  lockJawline: boolean;
  preventDeaging: boolean;
  preventSkinLightening: boolean;
  preventFaceReshaping: boolean;
  preventEyeColorChange: boolean;
  customFeatures: string; // e.g., "mole at left cheek, scar above right eyebrow"
}

interface IdentityLockControlsProps {
  settings: IdentityLockSettings;
  onSettingsChange: (settings: IdentityLockSettings) => void;
}

const LOCK_OPTIONS = [
  { key: "lockEyebrows" as const, label: "Eyebrow Arc & Shape", icon: "🧐" },
  { key: "lockEyeSpacing" as const, label: "Eye Distance & Spacing", icon: "👀" },
  { key: "lockNose" as const, label: "Nose Bridge & Width", icon: "👃" },
  { key: "lockPhiltrum" as const, label: "Philtrum Length", icon: "👄" },
  { key: "lockLips" as const, label: "Lip Contour & Shape", icon: "💋" },
  { key: "lockJawline" as const, label: "Jawline Structure", icon: "🗿" },
];

const PREVENT_OPTIONS = [
  { key: "preventDeaging" as const, label: "No De-aging" },
  { key: "preventSkinLightening" as const, label: "No Skin Lightening" },
  { key: "preventFaceReshaping" as const, label: "No Face Reshaping" },
  { key: "preventEyeColorChange" as const, label: "No Eye Color Change" },
];

export function IdentityLockControls({
  settings,
  onSettingsChange,
}: IdentityLockControlsProps) {
  const toggleLock = (key: keyof IdentityLockSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const lockedCount = LOCK_OPTIONS.filter((opt) => settings[opt.key]).length;
  const preventCount = PREVENT_OPTIONS.filter((opt) => settings[opt.key]).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-lg font-bold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Identity Lock Settings
          </Label>
          <p className="text-sm text-muted-foreground">
            Lock specific facial features to preserve exact likeness
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {lockedCount + preventCount}/{LOCK_OPTIONS.length + PREVENT_OPTIONS.length} Active
        </Badge>
      </div>

      {/* Feature Locks */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label className="text-sm font-bold text-muted-foreground">
            LOCK FACIAL FEATURES
          </Label>
          <div className="grid md:grid-cols-2 gap-4">
            {LOCK_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Checkbox
                  id={opt.key}
                  checked={settings[opt.key]}
                  onCheckedChange={() => toggleLock(opt.key)}
                />
                <label
                  htmlFor={opt.key}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer flex-1"
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prevention Locks */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label className="text-sm font-bold text-muted-foreground">
            PREVENT MODIFICATIONS
          </Label>
          <div className="grid md:grid-cols-2 gap-4">
            {PREVENT_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Checkbox
                  id={opt.key}
                  checked={settings[opt.key]}
                  onCheckedChange={() => toggleLock(opt.key)}
                />
                <label
                  htmlFor={opt.key}
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Features */}
      <div className="space-y-2">
        <Label htmlFor="customFeatures" className="font-bold">
          Custom Features to Lock
        </Label>
        <Input
          id="customFeatures"
          value={settings.customFeatures}
          onChange={(e) =>
            onSettingsChange({ ...settings, customFeatures: e.target.value })
          }
          placeholder="e.g., mole at left cheek, scar above right eyebrow, dimples"
          className="h-12"
        />
        <p className="text-xs text-muted-foreground">
          Specify any distinctive features, scars, moles, or unique characteristics
        </p>
      </div>
    </div>
  );
}
