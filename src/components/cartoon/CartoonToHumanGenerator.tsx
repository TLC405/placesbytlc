import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Sparkles, Download, User, Users2 } from "lucide-react";
import { ComparisonSlider } from "./ComparisonSlider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PRESET_CHARACTERS = [
  { name: "SpongeBob", emoji: "🧽", colors: "#F7DC6F" },
  { name: "Patrick Star", emoji: "⭐", colors: "#EC9FBF" },
  { name: "Squidward", emoji: "🦑", colors: "#7FC8DB" },
  { name: "Shrek", emoji: "👹", colors: "#8BC34A" },
  { name: "Pikachu", emoji: "⚡", colors: "#F7DC6F" },
  { name: "Mickey Mouse", emoji: "🐭", colors: "#964B00" },
  { name: "Bugs Bunny", emoji: "🐰", colors: "#DDDDDD" },
  { name: "Homer Simpson", emoji: "🍩", colors: "#F7DC6F" },
  { name: "Sonic", emoji: "💨", colors: "#03A9F4" },
  { name: "Mario", emoji: "🍄", colors: "#FF0000" },
  { name: "Totoro", emoji: "🌿", colors: "#8BC34A" },
  { name: "Sandy Cheeks", emoji: "🐿️", colors: "#F7DC6F" },
];

export function CartoonToHumanGenerator() {
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [humanImage, setHumanImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [realisticStyle, setRealisticStyle] = useState("professional");
  const [genderStyle, setGenderStyle] = useState("male");
  const [showComparison, setShowComparison] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCartoonImage(reader.result as string);
      setHumanImage(null);
      setShowComparison(false);
    };
    reader.readAsDataURL(file);
    toast.success("Cartoon image loaded!");
  };

  const selectPresetCharacter = (character: string) => {
    setSelectedCharacter(character);
    toast.success(`${character} selected! Ready to generate.`);
  };

  const generateHuman = async () => {
    if (!cartoonImage && !selectedCharacter) {
      toast.error("Please upload a cartoon image or select a preset character");
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("cartoon-to-human", {
        body: {
          image: cartoonImage ? cartoonImage.split(",")[1] : null,
          characterName: selectedCharacter,
          realisticStyle,
          genderStyle,
        },
      });

      if (error) throw error;

      if (data?.humanImage) {
        const newHumanImage = `data:image/png;base64,${data.humanImage}`;
        setHumanImage(newHumanImage);
        toast.success("🎨 Realistic Human Generated!", {
          description: "Your hyper-realistic transformation is ready",
        });

        // Save to history
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("cartoon_generations").insert({
            user_id: user.id,
            generation_type: "toon2human",
            character_name: selectedCharacter || "Custom",
            realistic_style: realisticStyle,
            gender_style: genderStyle,
            cartoon_image_url: newHumanImage,
            style_id: "realistic",
          });
        }
      }
    } catch (error: any) {
      toast.error("Generation Failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadHuman = () => {
    if (!humanImage) return;
    const link = document.createElement("a");
    link.href = humanImage;
    link.download = `toon2human-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Preset Character Gallery */}
      <Card className="border-2 border-border shadow-lg">
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Select a Character Preset
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {PRESET_CHARACTERS.map((char) => (
              <button
                key={char.name}
                onClick={() => selectPresetCharacter(char.name)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedCharacter === char.name
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="text-4xl mb-2">{char.emoji}</div>
                <p className="text-xs font-semibold text-foreground">{char.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Style Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground font-semibold">Realistic Style</Label>
          <Select value={realisticStyle} onValueChange={setRealisticStyle}>
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="streetwear">Streetwear</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="cosplay">Cosplay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-semibold">Gender Style</Label>
          <Select value={genderStyle} onValueChange={setGenderStyle}>
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Image Upload & Result */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cartoon Input */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Cartoon Image
          </h3>
          <div
            className="relative aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-all bg-card flex items-center justify-center overflow-hidden cursor-pointer group shadow-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            {cartoonImage ? (
              <img src={cartoonImage} alt="Cartoon" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-center space-y-3 p-6">
                <Upload className="w-20 h-20 text-primary mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-muted-foreground font-semibold">
                  {selectedCharacter ? `Or upload custom ${selectedCharacter} image` : "Upload cartoon image"}
                </p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* Human Result */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-5 h-5" />
            Realistic Human Result
          </h3>
          {showComparison && cartoonImage && humanImage ? (
            <ComparisonSlider originalImage={cartoonImage} cartoonImage={humanImage} />
          ) : (
            <div className="relative aspect-square rounded-lg border-2 border-border bg-card flex items-center justify-center overflow-hidden shadow-lg">
              {humanImage ? (
                <img src={humanImage} alt="Human" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center space-y-3 p-6">
                  <Users2 className="w-20 h-20 text-primary mx-auto" />
                  <p className="text-muted-foreground font-semibold">Your realistic human appears here</p>
                </div>
              )}
            </div>
          )}
          {humanImage && (
            <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)} className="w-full">
              {showComparison ? "Hide" : "Show"} Comparison
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={generateHuman}
          disabled={(!cartoonImage && !selectedCharacter) || processing}
          size="lg"
          className="min-w-[220px] h-14 text-lg"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-2" />
              Generate Realistic Human
            </>
          )}
        </Button>

        {humanImage && (
          <Button onClick={downloadHuman} size="lg" variant="outline" className="border-2">
            <Download className="w-6 h-6 mr-2" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
}
