import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Sparkles, Download, RefreshCw } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { StyleGallery } from "@/components/cartoon/StyleGallery";
import { IdentitySlider } from "@/components/cartoon/IdentitySlider";
import { BackgroundControl, type BackgroundMode } from "@/components/cartoon/BackgroundControl";
import { PoseSelector, type Pose } from "@/components/cartoon/PoseSelector";
import { EmotionPicker, type Emotion } from "@/components/cartoon/EmotionPicker";
import { ColorPalette, type ColorPalette as ColorPaletteType } from "@/components/cartoon/ColorPalette";
import { AdvancedSettings, type AdvancedSettingsState } from "@/components/cartoon/AdvancedSettings";
import { ComparisonSlider } from "@/components/cartoon/ComparisonSlider";
import { ProgressMessages } from "@/components/cartoon/ProgressMessages";
import { HistoryGallery } from "@/components/cartoon/HistoryGallery";
import { SharePanel, type WatermarkMode } from "@/components/cartoon/SharePanel";
import { BatchGenerator } from "@/components/cartoon/BatchGenerator";
import { optimizeImage } from "@/components/cartoon/ImageOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CartoonifierNew() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feature states
  const [selectedStyle, setSelectedStyle] = useState("simpsons");
  const [identityStrength, setIdentityStrength] = useState(80);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("auto");
  const [pose, setPose] = useState<Pose>("portrait");
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [colorPalette, setColorPalette] = useState<ColorPaletteType>("classic");
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 1000000));
  const [showComparison, setShowComparison] = useState(false);
  const [watermarkMode, setWatermarkMode] = useState<WatermarkMode>("brand");
  const [customWatermark, setCustomWatermark] = useState("");
  const [refinementCount, setRefinementCount] = useState(0);

  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsState>({
    resolution: "standard",
    denoiseStrength: 50,
    cfgScale: 7.5,
    steps: 50,
    exportFormat: "png",
    compressionLevel: 80,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      toast.info("Optimizing image...");
      const optimizedImage = await optimizeImage(file);
      setOriginalImage(optimizedImage);
      setCartoonImage(null);
      setProgress(0);
      setShowComparison(false);
      setRefinementCount(0);
      toast.success("Image ready!");
    } catch (error) {
      toast.error("Failed to process image");
    }
  };

  const generateCartoon = async (isRefinement = false) => {
    if (!originalImage) return;

    setProcessing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const base64Data = originalImage.split(",")[1];
      const startTime = Date.now();

      const { data, error } = await supabase.functions.invoke("teefeeme-cartoonify", {
        body: {
          image: base64Data,
          style: selectedStyle,
          identityStrength,
          backgroundMode,
          pose,
          emotion,
          colorPalette,
          seed,
          resolution: advancedSettings.resolution,
          denoiseStrength: advancedSettings.denoiseStrength,
          cfgScale: advancedSettings.cfgScale,
          isRefinement,
          refinementCount,
        },
      });

      clearInterval(progressInterval);

      if (error) throw error;

      if (data?.cartoonImage) {
        setProgress(100);
        const newCartoonImage = `data:image/png;base64,${data.cartoonImage}`;
        setCartoonImage(newCartoonImage);

        if (isRefinement) {
          setRefinementCount((prev) => prev + 1);
          toast.success(`🎨 Refinement ${refinementCount + 1} Complete!`);
        } else {
          toast.success("🎨 Cartoon Generated!", {
            description: "Your epic cartoon is ready",
          });
        }

        // Save to history
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const generationTime = Date.now() - startTime;
          await supabase.from("cartoon_generations").insert({
            user_id: user.id,
            style_id: selectedStyle,
            cartoon_image_url: newCartoonImage,
            seed,
            identity_strength: identityStrength,
            background_mode: backgroundMode,
            pose,
            emotion,
            color_palette: colorPalette,
            resolution: advancedSettings.resolution,
            generation_time_ms: generationTime,
            refinement_count: refinementCount,
          });
        }
      } else {
        throw new Error("No cartoon image returned");
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

  const refineResult = () => {
    if (refinementCount >= 3) {
      toast.error("Maximum 3 refinements reached");
      return;
    }
    generateCartoon(true);
  };

  const downloadCartoon = () => {
    if (!cartoonImage) return;
    const link = document.createElement("a");
    link.href = cartoonImage;
    link.download = `tlc-${selectedStyle}-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  const reset = () => {
    setOriginalImage(null);
    setCartoonImage(null);
    setProgress(0);
    setShowComparison(false);
    setRefinementCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <RoleGuard allowedRoles={['admin','alpha','beta','delta','moderator']} featureName="Cartoonifier">
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              <h1 className="text-6xl font-black cartoon-title">
                CARTOONIFY STUDIO
              </h1>
              <Sparkles className="w-12 h-12 text-secondary animate-bounce" />
            </div>
            <p className="text-foreground/80 font-black text-xl">
              20 Features • 12 Styles • Face-Locked Magic ✨
            </p>
          </div>

          {/* Main Card */}
          <Card className="cartoon-container p-8">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-16">
                <TabsTrigger value="generate" className="text-lg font-black">🎨 Generate</TabsTrigger>
                <TabsTrigger value="batch" className="text-lg font-black">⚡ Batch Styles</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6">
                {/* Style Gallery */}
                <StyleGallery selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle} />

                {/* Controls Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <IdentitySlider value={identityStrength} onChange={setIdentityStrength} />
                    <BackgroundControl value={backgroundMode} onChange={setBackgroundMode} />
                  </div>
                  <div className="space-y-4">
                    <PoseSelector value={pose} onChange={setPose} />
                  </div>
                </div>

                {/* Emotion & Color */}
                <div className="space-y-4">
                  <EmotionPicker value={emotion} onChange={setEmotion} />
                  <ColorPalette value={colorPalette} onChange={setColorPalette} />
                </div>

                {/* Image Upload & Result */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Original Image */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black flex items-center gap-2 text-primary">
                      <Upload className="w-6 h-6" />
                      Upload Photo 📸
                    </h3>
                    <div
                      className="relative aspect-square rounded-3xl border-8 border-dashed border-primary hover:border-secondary transition-all bg-card flex items-center justify-center overflow-hidden cursor-pointer group shadow-2xl"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {originalImage ? (
                        <img src={originalImage} alt="Original" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <div className="text-center space-y-3 p-6">
                          <Upload className="w-24 h-24 text-primary mx-auto group-hover:text-secondary transition-colors animate-bounce" />
                          <p className="text-foreground font-black text-lg">Tap to Upload! 🎉</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </div>

                  {/* Cartoon Result */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black flex items-center gap-2 text-secondary">
                      <Sparkles className="w-6 h-6" />
                      Cartoon Magic ✨
                    </h3>
                    {showComparison && originalImage && cartoonImage ? (
                      <ComparisonSlider originalImage={originalImage} cartoonImage={cartoonImage} />
                    ) : (
                      <div className="relative aspect-square rounded-3xl border-8 border-secondary bg-card flex items-center justify-center overflow-hidden shadow-2xl">
                        {cartoonImage ? (
                          <img src={cartoonImage} alt="Cartoon" className="w-full h-full object-cover rounded-2xl animate-fade-in" />
                        ) : (
                          <div className="text-center space-y-3 p-6">
                            <Sparkles className="w-24 h-24 text-secondary mx-auto animate-pulse" />
                            <p className="text-foreground font-black text-lg">Result Shows Here! 🎨</p>
                          </div>
                        )}
                      </div>
                    )}
                    {cartoonImage && (
                      <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)} className="w-full font-bold">
                        {showComparison ? "Hide" : "Show"} Comparison
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress */}
                {processing && (
                  <div className="space-y-3 animate-fade-in">
                    <ProgressMessages style={selectedStyle} progress={progress} />
                    <Progress value={progress} className="h-3 bg-[#8BC34A]/20" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => generateCartoon(false)}
                    disabled={!originalImage || processing}
                    size="lg"
                    className="cartoon-button min-w-[240px] h-16 text-xl"
                  >
                    {processing ? (
                      <>
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-2" />
                        Generate! 🚀
                      </>
                    )}
                  </Button>

                  {cartoonImage && refinementCount < 3 && (
                    <Button onClick={refineResult} disabled={processing} size="lg" className="cartoon-button min-w-[200px] h-16 text-xl">
                      ✨ Refine ({refinementCount}/3)
                    </Button>
                  )}

                  {cartoonImage && (
                    <Button onClick={downloadCartoon} size="lg" className="cartoon-button min-w-[200px] h-16 text-xl">
                      <Download className="w-6 h-6 mr-2" />
                      Download 💾
                    </Button>
                  )}

                  {(originalImage || cartoonImage) && (
                    <Button onClick={reset} size="lg" variant="outline" className="border-4 border-foreground/20 min-w-[200px] h-16 text-xl font-black">
                      <RefreshCw className="w-6 h-6 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>

                {/* Advanced Settings */}
                <AdvancedSettings settings={advancedSettings} onChange={setAdvancedSettings} />

                {/* Share Panel */}
                {cartoonImage && (
                  <SharePanel
                    cartoonImage={cartoonImage}
                    watermarkMode={watermarkMode}
                    customWatermark={customWatermark}
                    onWatermarkModeChange={setWatermarkMode}
                    onCustomWatermarkChange={setCustomWatermark}
                  />
                )}

                {/* History Gallery */}
                <HistoryGallery onSelect={(url) => setCartoonImage(url)} />
              </TabsContent>

              <TabsContent value="batch">
                {originalImage ? (
                  <BatchGenerator originalImage={originalImage} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Upload an image first to use batch generation</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Footer */}
          <div className="text-center text-lg text-foreground/80 font-black space-y-2">
            <p className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Powered by TeeFeeMee AI • 20 Features Active
              <Sparkles className="w-6 h-6 text-secondary" />
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
