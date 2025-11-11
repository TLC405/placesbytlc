import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface ReferenceImage {
  id: string;
  dataUrl: string;
  angle: "front" | "left-3/4" | "right-3/4" | "left-profile" | "right-profile" | "closeup";
  hasSmile: boolean;
}

interface FaceReferenceUploaderProps {
  references: ReferenceImage[];
  onReferencesChange: (refs: ReferenceImage[]) => void;
}

const ANGLE_REQUIREMENTS = [
  { angle: "front", label: "Front View", emoji: "👤", min: 2 },
  { angle: "left-3/4", label: "¾ Left", emoji: "↖️", min: 1 },
  { angle: "right-3/4", label: "¾ Right", emoji: "↗️", min: 1 },
  { angle: "left-profile", label: "Left Profile", emoji: "⬅️", min: 1 },
  { angle: "right-profile", label: "Right Profile", emoji: "➡️", min: 1 },
  { angle: "closeup", label: "Close-ups", emoji: "🔍", min: 3 },
] as const;

export function FaceReferenceUploader({ references, onReferencesChange }: FaceReferenceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAngle, setSelectedAngle] = useState<ReferenceImage["angle"]>("front");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (references.length + files.length > 20) {
      toast.error("Maximum 20 reference photos allowed");
      return;
    }

    const newReferences: ReferenceImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = () => {
          newReferences.push({
            id: Math.random().toString(36).slice(2),
            dataUrl: reader.result as string,
            angle: selectedAngle,
            hasSmile: false,
          });
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }

    onReferencesChange([...references, ...newReferences]);
    toast.success(`Added ${newReferences.length} photo(s)`);
  };

  const removeReference = (id: string) => {
    onReferencesChange(references.filter((ref) => ref.id !== id));
    toast.info("Photo removed");
  };

  const toggleSmile = (id: string) => {
    onReferencesChange(
      references.map((ref) =>
        ref.id === id ? { ...ref, hasSmile: !ref.hasSmile } : ref
      )
    );
  };

  const changeAngle = (id: string, angle: ReferenceImage["angle"]) => {
    onReferencesChange(
      references.map((ref) => (ref.id === id ? { ...ref, angle } : ref))
    );
  };

  const getAngleCounts = () => {
    const counts: Record<string, number> = {};
    ANGLE_REQUIREMENTS.forEach(({ angle }) => {
      counts[angle] = references.filter((ref) => ref.angle === angle).length;
    });
    return counts;
  };

  const angleCounts = getAngleCounts();
  const isComplete = ANGLE_REQUIREMENTS.every(({ angle, min }) => angleCounts[angle] >= min);
  const totalPhotos = references.length;
  const isReady = totalPhotos >= 12 && isComplete;

  return (
    <div className="space-y-6">
      {/* Requirements Alert */}
      <Alert className={isReady ? "border-primary bg-primary/10" : "border-accent bg-accent/10"}>
        <AlertCircle className="h-5 w-5 text-foreground" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-bold text-foreground">
              {isReady ? "✅ Ready to Generate!" : "📸 Reference Pack Requirements"}
            </p>
            <p className="text-sm text-muted-foreground">
              Upload 12–20 photos: even lighting, no hats, glasses consistent (all on or all off), hair styled as desired.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Angle Requirements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ANGLE_REQUIREMENTS.map(({ angle, label, emoji, min }) => (
          <button
            key={angle}
            onClick={() => setSelectedAngle(angle)}
            className={`p-4 rounded-2xl border-2 transition-all hover-lift ${
              selectedAngle === angle
                ? "border-primary bg-primary/10 scale-105 shadow-lg shadow-primary/20"
                : "border-border bg-card hover:border-accent"
            }`}
          >
            <div className="text-center space-y-1">
              <div className="text-3xl">{emoji}</div>
              <p className="font-bold text-sm text-foreground">{label}</p>
              <div className={`text-xs font-semibold ${
                angleCounts[angle] >= min ? "text-primary" : "text-muted-foreground"
              }`}>
                {angleCounts[angle]}/{min} {angleCounts[angle] >= min && "✓"}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Upload Button */}
      <div className="flex gap-3">
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 h-14 text-lg font-bold"
          variant={totalPhotos < 12 ? "premium" : "outline"}
        >
          <Upload className="w-5 h-5 mr-2" />
          Add {selectedAngle} Photos ({totalPhotos}/20)
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Reference Grid */}
      {references.length > 0 && (
        <div className="space-y-3">
          <p className="font-bold text-foreground text-lg">Your Reference Pack</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {references.map((ref) => (
              <Card key={ref.id} className="relative group overflow-hidden premium-card">
                <CardContent className="p-0">
                  <img
                    src={ref.dataUrl}
                    alt={ref.angle}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <Button
                      size="sm"
                      variant={ref.hasSmile ? "default" : "secondary"}
                      onClick={() => toggleSmile(ref.id)}
                      className="h-7 text-xs"
                    >
                      {ref.hasSmile ? "😊 Smile" : "😐 Neutral"}
                    </Button>
                    <select
                      value={ref.angle}
                      onChange={(e) => changeAngle(ref.id, e.target.value as ReferenceImage["angle"])}
                      className="text-xs p-1 rounded bg-background"
                    >
                      {ANGLE_REQUIREMENTS.map(({ angle, label }) => (
                        <option key={angle} value={angle}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeReference(ref.id)}
                      className="h-7 w-7 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {ANGLE_REQUIREMENTS.find((a) => a.angle === ref.angle)?.emoji}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
