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
      <div className="min-h-screen bg-[#964B00] py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl animate-pulse">🍄</span>
              <h1 className="text-5xl font-black text-[#03A9F4]">
                ✨ ADVANCED CARTOONIFY SYSTEM ✨
              </h1>
              <span className="text-4xl animate-bounce">🌿</span>
            </div>
            <p className="text-[#F7DC6F] font-semibold text-lg">
              20 Advanced Features • 12 Styles • Identity-Locked Perfection 🎨
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-white border-2 border-[#DDDDDD] shadow-xl p-8 rounded-[10px]">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="generate">🎨 Generate</TabsTrigger>
                <TabsTrigger value="batch">⚡ Batch All Styles</TabsTrigger>
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
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-[#03A9F4]">
                      <Upload className="w-5 h-5" />
                      Upload Your Photo
                    </h3>
                    <div
                      className="relative aspect-square rounded-[10px] border-2 border-dashed border-[#8BC34A] hover:border-[#F7DC6F] transition-all bg-white flex items-center justify-center overflow-hidden cursor-pointer group shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {originalImage ? (
                        <img src={originalImage} alt="Original" className="w-full h-full object-cover rounded-[10px]" />
                      ) : (
                        <div className="text-center space-y-3 p-6">
                          <Upload className="w-20 h-20 text-[#8BC34A] mx-auto group-hover:text-[#F7DC6F] transition-colors animate-bounce" />
                          <p className="text-[#03A9F4] font-semibold">Tap to choose image 📸</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </div>

                  {/* Cartoon Result */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-[#03A9F4]">
                      <Sparkles className="w-5 h-5" />
                      Your Cartoon Magic ✨
                    </h3>
                    {showComparison && originalImage && cartoonImage ? (
                      <ComparisonSlider originalImage={originalImage} cartoonImage={cartoonImage} />
                    ) : (
                      <div className="relative aspect-square rounded-[10px] border-2 border-[#8BC34A] bg-white flex items-center justify-center overflow-hidden shadow-lg">
                        {cartoonImage ? (
                          <img src={cartoonImage} alt="Cartoon" className="w-full h-full object-cover rounded-[10px] animate-fade-in" />
                        ) : (
                          <div className="text-center space-y-3 p-6">
                            <Sparkles className="w-20 h-20 text-[#8BC34A] mx-auto animate-pulse" />
                            <p className="text-[#03A9F4] font-semibold">Your masterpiece appears here 🎨</p>
                          </div>
                        )}
                      </div>
                    )}
                    {cartoonImage && (
                      <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)} className="w-full">
                        {showComparison ? "Hide" : "Show"} Comparison Slider
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
                    className="bg-[#F7DC6F] hover:bg-[#F7DC6F]/90 text-[#964B00] font-bold shadow-xl border border-[#DDDDDD] min-w-[220px] h-14 text-lg rounded-[10px]"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-3 border-[#964B00]/30 border-t-[#964B00] rounded-full animate-spin mr-2" />
                        Cartoonifying...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🍄</span>
                        Generate Cartoon!
                      </>
                    )}
                  </Button>

                  {cartoonImage && refinementCount < 3 && (
                    <Button onClick={refineResult} disabled={processing} size="lg" variant="outline" className="border-2 border-[#03A9F4]">
                      ✨ Refine Result ({refinementCount}/3)
                    </Button>
                  )}

                  {cartoonImage && (
                    <Button onClick={downloadCartoon} size="lg" variant="outline" className="border-2 border-[#8BC34A]">
                      <Download className="w-6 h-6 mr-2" />
                      Download ⬇️
                    </Button>
                  )}

                  {(originalImage || cartoonImage) && (
                    <Button onClick={reset} size="lg" variant="outline" className="border-2 border-[#DDDDDD]">
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Start Over
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
          <div className="text-center text-sm text-[#F7DC6F] font-medium space-y-2">
            <p className="flex items-center justify-center gap-2">
              <span>🍄</span>
              Powered by TeeFeeMe AI Systems • 20 Advanced Features Active
              <span>🍄</span>
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
