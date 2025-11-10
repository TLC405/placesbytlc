import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export type TransformMode = "tmnt-classic" | "hyper-realistic" | "custom-character" | "standard-cartoon";

export interface CharacterTransformSettings {
  mode: TransformMode;
  tmntRole?: "leader" | "tech" | "muscle" | "wild";
  bandanaColor?: string;
  transformerStyle?: "sleek" | "rugged" | "elegant" | "tactical";
  armorColor?: string;
  customCharacter?: string;
  cartoonStyle?: string;
}

interface CharacterTransformSelectorProps {
  settings: CharacterTransformSettings;
  onSettingsChange: (settings: CharacterTransformSettings) => void;
}

const TMNT_ROLES = [
  { value: "leader", label: "Leader (Blue)", color: "#0066CC", emoji: "🔵" },
  { value: "tech", label: "Tech Genius (Purple)", color: "#7B2FBE", emoji: "🟣" },
  { value: "muscle", label: "Muscle (Red)", color: "#CC0000", emoji: "🔴" },
  { value: "wild", label: "Wild Card (Orange)", color: "#FF8800", emoji: "🟠" },
];

const TRANSFORMER_STYLES = [
  { value: "sleek", label: "Sleek & Modern", description: "Clean lines, minimal panels" },
  { value: "rugged", label: "Rugged & Battle-Worn", description: "Heavy armor, scratches" },
  { value: "elegant", label: "Elegant & Refined", description: "Smooth curves, chrome finish" },
  { value: "tactical", label: "Tactical & Military", description: "Camo patterns, gear" },
];

const CUSTOM_CHARACTERS = [
  "SpongeBob SquarePants",
  "Patrick Star",
  "Squidward Tentacles",
  "Sandy Cheeks",
  "Shrek",
  "Pikachu",
  "Mickey Mouse",
  "Bugs Bunny",
  "Homer Simpson",
  "Sonic",
  "Mario",
  "Totoro",
];

export function CharacterTransformSelector({
  settings,
  onSettingsChange,
}: CharacterTransformSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Character Transform Mode
        </Label>
        <p className="text-sm text-muted-foreground">
          Choose how to transform into your character
        </p>
      </div>

      <Tabs value={settings.mode} onValueChange={(v) => onSettingsChange({ ...settings, mode: v as TransformMode })}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="standard-cartoon">🎨 Standard</TabsTrigger>
          <TabsTrigger value="tmnt-classic">🐢 TMNT</TabsTrigger>
          <TabsTrigger value="hyper-realistic">🤖 Transformer</TabsTrigger>
          <TabsTrigger value="custom-character">⭐ Custom</TabsTrigger>
        </TabsList>

        {/* Standard Cartoon */}
        <TabsContent value="standard-cartoon" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Classic cartoon transformation with TV/anime styles
              </p>
              <div className="space-y-2">
                <Label>Cartoon Style</Label>
                <Select
                  value={settings.cartoonStyle}
                  onValueChange={(v) => onSettingsChange({ ...settings, cartoonStyle: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simpsons">The Simpsons</SelectItem>
                    <SelectItem value="american-dad">American Dad</SelectItem>
                    <SelectItem value="family-guy">Family Guy</SelectItem>
                    <SelectItem value="south-park">South Park</SelectItem>
                    <SelectItem value="archer">Archer</SelectItem>
                    <SelectItem value="rick-morty">Rick & Morty</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="pixar-3d">Pixar 3D</SelectItem>
                    <SelectItem value="disney-2d">Disney 2D</SelectItem>
                    <SelectItem value="comic-book">Comic Book</SelectItem>
                    <SelectItem value="manga">Manga</SelectItem>
                    <SelectItem value="looney-tunes">Looney Tunes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TMNT Classic */}
        <TabsContent value="tmnt-classic" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                1987 TMNT Saturday-morning style with turtle-themed gear
              </p>
              <div className="space-y-2">
                <Label>Your TMNT Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  {TMNT_ROLES.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => onSettingsChange({ ...settings, tmntRole: role.value as any, bandanaColor: role.color })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        settings.tmntRole === role.value
                          ? "border-primary bg-primary/10 scale-105"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-2xl mb-1">{role.emoji}</div>
                      <p className="font-bold text-sm">{role.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Badge>Environment: NYC sewer lair • Pizza boxes • Boombox</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hyper-Realistic Transformer */}
        <TabsContent value="hyper-realistic" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Photoreal AI cartoon transformer with exo-suit armor
              </p>
              <div className="space-y-2">
                <Label>Transformer Style</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {TRANSFORMER_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => onSettingsChange({ ...settings, transformerStyle: style.value as any })}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        settings.transformerStyle === style.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-bold text-sm mb-1">{style.label}</p>
                      <p className="text-xs text-muted-foreground">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="armorColor">Armor Accent Color</Label>
                <input
                  id="armorColor"
                  type="color"
                  value={settings.armorColor || "#00ffff"}
                  onChange={(e) => onSettingsChange({ ...settings, armorColor: e.target.value })}
                  className="w-full h-12 rounded-lg border-2 cursor-pointer"
                />
              </div>
              <Badge>Environment: Futuristic rooftop • Golden hour • Bokeh lights</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Character */}
        <TabsContent value="custom-character" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Transform into any iconic character with their signature colors & accessories
              </p>
              <div className="space-y-2">
                <Label>Select Character</Label>
                <Select
                  value={settings.customCharacter}
                  onValueChange={(v) => onSettingsChange({ ...settings, customCharacter: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose character..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOM_CHARACTERS.map((char) => (
                      <SelectItem key={char} value={char}>
                        {char}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge>Outfit will match character's color palette & signature accessories</Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
