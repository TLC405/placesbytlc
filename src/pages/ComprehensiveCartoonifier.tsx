import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Download, RefreshCw, Loader2 } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ComparisonSlider } from "@/components/cartoon/ComparisonSlider";
import {
  FaceReferenceUploader,
  type ReferenceImage,
} from "@/components/cartoon/FaceReferenceUploader";
import {
  MethodSelector,
  type GenerationMethod,
} from "@/components/cartoon/MethodSelector";
import {
  IdentityLockControls,
  type IdentityLockSettings,
} from "@/components/cartoon/IdentityLockControls";
import {
  CharacterTransformSelector,
  type CharacterTransformSettings,
} from "@/components/cartoon/CharacterTransformSelector";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function ComprehensiveCartoonifier() {
  const [step, setStep] = useState<"refs" | "method" | "settings" | "generate">("refs");
  
  // Reference Pack
  const [references, setReferences] = useState<ReferenceImage[]>([]);
  
  // Method Selection
  const [method, setMethod] = useState<GenerationMethod>("lora");
  const [idWeight, setIdWeight] = useState(1.0);
  
  // Identity Lock
  const [identityLock, setIdentityLock] = useState<IdentityLockSettings>({
    lockEyebrows: true,
    lockEyeSpacing: true,
    lockNose: true,
    lockPhiltrum: true,
    lockLips: true,
    lockJawline: true,
    preventDeaging: true,
    preventSkinLightening: true,
    preventFaceReshaping: true,
    preventEyeColorChange: true,
    customFeatures: "",
  });
  
  // Character Transform
  const [characterTransform, setCharacterTransform] = useState<CharacterTransformSettings>({
    mode: "standard-cartoon",
    cartoonStyle: "simpsons",
  });
  
  // Advanced Settings
  const [img2imgStrength, setImg2imgStrength] = useState(0.45);
  const [cfgScale, setCfgScale] = useState(7);
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 1000000));
  const [multiPass, setMultiPass] = useState(false);
  
  // Generation
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const isRefsReady = references.length >= 12;
  const primaryRef = references.find((r) => r.angle === "front") || references[0];

  const generateTransformation = async () => {
    if (!isRefsReady) {
      toast.error("Upload at least 12 reference photos first!");
      return;
    }

    setProcessing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        const increment = method === "instant-id" ? 15 : method === "lora" ? 10 : 5;
        return prev + increment;
      });
    }, method === "instant-id" ? 150 : method === "lora" ? 200 : 400);

    try {
      // Build identity block prompt
      const lockedFeatures: string[] = [];
      if (identityLock.lockEyebrows) lockedFeatures.push("eyebrow arc");
      if (identityLock.lockEyeSpacing) lockedFeatures.push("eye spacing");
      if (identityLock.lockNose) lockedFeatures.push("nose bridge/width");
      if (identityLock.lockPhiltrum) lockedFeatures.push("philtrum length");
      if (identityLock.lockLips) lockedFeatures.push("lip contour");
      if (identityLock.lockJawline) lockedFeatures.push("jawline");
      if (identityLock.customFeatures) lockedFeatures.push(identityLock.customFeatures);

      const preventions: string[] = [];
      if (identityLock.preventDeaging) preventions.push("no de-aging");
      if (identityLock.preventSkinLightening) preventions.push("no skin lightening");
      if (identityLock.preventFaceReshaping) preventions.push("no face reshaping");
      if (identityLock.preventEyeColorChange) preventions.push("no eye color change");

      // Build character transform prompt based on mode
      let transformPrompt = "";
      switch (characterTransform.mode) {
        case "tmnt-classic":
          transformPrompt = `Create a TMNT 1987 Saturday-morning cartoon style transformation. Role: ${characterTransform.tmntRole}. Bandana color: ${characterTransform.bandanaColor}. Clean cel animation, thick black outlines, flat colors. NYC sewer lair background with pizza boxes.`;
          break;
        case "hyper-realistic":
          transformPrompt = `Create a hyper-realistic AI cartoon transformer. Photoreal face with ${characterTransform.transformerStyle} exo-suit. Armor accent color: ${characterTransform.armorColor}. Futuristic rooftop at golden hour. Ultra-high detail, 8K quality.`;
          break;
        case "custom-character":
          transformPrompt = `Transform into ${characterTransform.customCharacter}. Realistic person wearing clothing with character's signature colors, patterns, and accessories. Professional photography, studio lighting.`;
          break;
        default:
          transformPrompt = `${characterTransform.cartoonStyle} cartoon style transformation.`;
      }

      const identityPrompt = `
IDENTITY: preserve exact likeness using ${references.length} reference images.
Lock features: ${lockedFeatures.join(", ")}.
${preventions.join(", ")}.
ID_WEIGHT: ${idWeight}
`;

      const fullPrompt = `${identityPrompt}\n\n${transformPrompt}`;

      // Call edge function with comprehensive settings
      const { data, error } = await supabase.functions.invoke("comprehensive-cartoonify", {
        body: {
          references: references.slice(0, method === "instant-id" ? 5 : 20).map((r) => r.dataUrl.split(",")[1]),
          method,
          idWeight,
          img2imgStrength,
          cfgScale,
          seed,
          identityLock,
          characterTransform,
          multiPass,
          prompt: fullPrompt,
        },
      });

      clearInterval(progressInterval);

      if (error) throw error;

      if (data?.resultImage) {
        setProgress(100);
        const newResultImage = `data:image/png;base64,${data.resultImage}`;
        setResultImage(newResultImage);
        toast.success("🎨 Transformation Complete!", {
          description: `Your ${characterTransform.mode} is ready!`,
        });

        // Save to history
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("cartoon_generations").insert([{
            user_id: user.id,
            generation_type: "face-lock",
            character_name: characterTransform.customCharacter || characterTransform.mode,
            style_id: characterTransform.cartoonStyle || characterTransform.mode,
            cartoon_image_url: newResultImage,
            seed,
            identity_strength: idWeight,
          }]);
        }
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setProgress(0);
      toast.error("Generation Failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `tlc-facelock-${characterTransform.mode}-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  const reset = () => {
    setStep("refs");
    setReferences([]);
    setResultImage(null);
    setProgress(0);
    setShowComparison(false);
  };

  return (
    <RoleGuard allowedRoles={["admin", "alpha", "beta", "delta", "moderator"]} featureName="Face-Lock Cartoonifier">
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-3 sticker-effect">
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl floating-cartoon">🔒</span>
              <h1 className="text-5xl md:text-6xl font-black text-foreground cartoon-text">
                FACE-LOCK CARTOONIFIER
              </h1>
              <span className="text-5xl floating-cartoon">✨</span>
            </div>
            <p className="text-muted-foreground font-bold text-lg">
              Professional Identity-Locked Transformations • 3 Methods • Perfect Likeness
            </p>
          </div>

          {/* Progress Steps */}
          <Card className="premium-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                {["refs", "method", "settings", "generate"].map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <button
                      onClick={() => setStep(s as any)}
                      disabled={s === "generate" && !isRefsReady}
                      className={`flex flex-col items-center gap-2 transition-all hover-lift ${
                        step === s ? "opacity-100" : "opacity-50 hover:opacity-75"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                        step === s ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 premium-glow" : "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-xs font-semibold">
                        {s === "refs" && "References"}
                        {s === "method" && "Method"}
                        {s === "settings" && "Settings"}
                        {s === "generate" && "Generate"}
                      </span>
                    </button>
                    {i < 3 && <div className="flex-1 h-0.5 bg-border mx-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card className="premium-card premium-glow">
            <CardContent className="pt-8 space-y-8">
              {/* Step 1: Reference Pack */}
              {step === "refs" && (
                <div className="space-y-6">
                  <FaceReferenceUploader
                    references={references}
                    onReferencesChange={setReferences}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setStep("method")}
                      disabled={!isRefsReady}
                      size="lg"
                      variant="premium"
                      className="min-w-[200px]"
                    >
                      Next: Choose Method →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Method Selection */}
              {step === "method" && (
                <div className="space-y-6">
                  <MethodSelector
                    method={method}
                    onMethodChange={setMethod}
                    idWeight={idWeight}
                    onIdWeightChange={setIdWeight}
                  />
                  <div className="flex justify-between">
                    <Button onClick={() => setStep("refs")} variant="outline">
                      ← Back
                    </Button>
                    <Button onClick={() => setStep("settings")} size="lg" variant="premium" className="min-w-[200px]">
                      Next: Configure Settings →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Settings */}
              {step === "settings" && (
                <div className="space-y-8">
                  <Tabs defaultValue="identity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="identity">🔒 Identity Lock</TabsTrigger>
                      <TabsTrigger value="character">⭐ Character</TabsTrigger>
                      <TabsTrigger value="advanced">⚙️ Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="identity" className="space-y-6">
                      <IdentityLockControls
                        settings={identityLock}
                        onSettingsChange={setIdentityLock}
                      />
                    </TabsContent>

                    <TabsContent value="character" className="space-y-6">
                      <CharacterTransformSelector
                        settings={characterTransform}
                        onSettingsChange={setCharacterTransform}
                      />
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="font-bold">Img2Img Strength: {img2imgStrength.toFixed(2)}</Label>
                            <span className="text-xs text-muted-foreground">Higher = More Style</span>
                          </div>
                          <Slider
                            value={[img2imgStrength]}
                            onValueChange={([v]) => setImg2imgStrength(v)}
                            min={0.35}
                            max={0.55}
                            step={0.01}
                            className="py-4"
                          />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="font-bold">CFG Scale: {cfgScale}</Label>
                            <span className="text-xs text-muted-foreground">Guidance strength</span>
                          </div>
                          <Slider
                            value={[cfgScale]}
                            onValueChange={([v]) => setCfgScale(v)}
                            min={3}
                            max={12}
                            step={0.5}
                            className="py-4"
                          />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Label className="font-bold">Seed: {seed}</Label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
                              className="flex-1"
                            >
                              🎲 Random Seed
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between">
                    <Button onClick={() => setStep("method")} variant="outline">
                      ← Back
                    </Button>
                    <Button onClick={() => setStep("generate")} size="lg" variant="premium" className="min-w-[200px]">
                      Ready to Generate →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Generate */}
              {step === "generate" && (
                <div className="space-y-6">
                  {/* Preview & Result */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Reference Preview */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-foreground cartoon-text">
                        Your Reference
                      </h3>
                      {primaryRef ? (
                        <div className="aspect-square rounded-2xl border-2 border-primary/20 overflow-hidden shadow-2xl premium-glow">
                          <img
                            src={primaryRef.dataUrl}
                            alt="Primary Reference"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-muted/20">
                          <p className="text-muted-foreground">No reference selected</p>
                        </div>
                      )}
                    </div>

                    {/* Result */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-foreground flex items-center gap-2 cartoon-text">
                        <Sparkles className="w-5 h-5 text-accent" />
                        Transformation Result
                      </h3>
                      {showComparison && primaryRef && resultImage ? (
                        <ComparisonSlider
                          originalImage={primaryRef.dataUrl}
                          cartoonImage={resultImage}
                        />
                      ) : (
                        <div className="aspect-square rounded-2xl border-2 border-border bg-card flex items-center justify-center overflow-hidden shadow-2xl premium-glow">
                          {resultImage ? (
                            <img
                              src={resultImage}
                              alt="Result"
                              className="w-full h-full object-cover animate-fade-in"
                            />
                          ) : (
                            <div className="text-center space-y-3 p-6">
                              <Sparkles className="w-20 h-20 text-primary mx-auto animate-pulse" />
                              <p className="text-muted-foreground font-semibold">
                                Your transformation appears here
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {resultImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowComparison(!showComparison)}
                          className="w-full"
                        >
                          {showComparison ? "Hide" : "Show"} Comparison
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {processing && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-foreground">
                          {method === "instant-id" && "InstantID Processing..."}
                          {method === "lora" && "LoRA Fine-tuning in progress..."}
                          {method === "dreambooth" && "DreamBooth training... This may take a while."}
                        </p>
                        <span className="text-sm font-bold text-primary">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                      onClick={generateTransformation}
                      disabled={!isRefsReady || processing}
                      size="lg"
                      className="min-w-[250px] h-16 text-lg font-bold"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 mr-2" />
                          Generate Transformation!
                        </>
                      )}
                    </Button>

                    {resultImage && (
                      <Button
                        onClick={downloadResult}
                        size="lg"
                        variant="outline"
                        className="border-2"
                      >
                        <Download className="w-6 h-6 mr-2" />
                        Download Result
                      </Button>
                    )}

                    {(references.length > 0 || resultImage) && (
                      <Button onClick={reset} size="lg" variant="outline" className="border-2">
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Start Over
                      </Button>
                    )}
                  </div>

                  <div className="flex justify-start">
                    <Button onClick={() => setStep("settings")} variant="ghost">
                      ← Back to Settings
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground font-medium">
            <p className="flex items-center justify-center gap-2">
              <span>🔒</span>
              Face-Lock Technology • Professional Identity Preservation • Powered by TLC AI
              <span>✨</span>
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
