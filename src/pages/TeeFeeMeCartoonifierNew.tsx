import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, Camera, Sparkles, Zap, Sliders, Wand2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type CartoonStyle = 
  | "simpsons" | "familyguy" | "renandstimpy" | "southpark" | "boondocks"
  | "dbz" | "tmnt" | "invincible" | "spiderverse" | "arcane"
  | "ghibli" | "disney" | "pixar" | "papercut" | "nicktoon"
  | "noir" | "anime-neon" | "arcade" | "tlc-cinematic" | "teefeeme-fusion";

const TeeFeeMeCartoonifierNew = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cartoonUrl, setCartoonUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>("simpsons");
  const [showResult, setShowResult] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // New features state
  const [faceLock, setFaceLock] = useState(true);
  const [customPrompt, setCustomPrompt] = useState("");
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [outlineWeight, setOutlineWeight] = useState([50]);
  const [funMode, setFunMode] = useState(false);
  const [background, setBackground] = useState("auto");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styleCategories = {
    classic: [
      { id: "simpsons" as CartoonStyle, name: "Simpsons", icon: "🍩", desc: "Bright suburban" },
      { id: "familyguy" as CartoonStyle, name: "Family Guy", icon: "🍺", desc: "Bold outlines" },
      { id: "renandstimpy" as CartoonStyle, name: "Ren & Stimpy 3D", icon: "😵", desc: "Gross-fun vintage" },
      { id: "southpark" as CartoonStyle, name: "South Park", icon: "🎿", desc: "Simple cutout" },
      { id: "boondocks" as CartoonStyle, name: "Boondocks", icon: "✊", desc: "Anime attitude" },
    ],
    action: [
      { id: "dbz" as CartoonStyle, name: "DBZ", icon: "⚡", desc: "Aura & speed lines" },
      { id: "tmnt" as CartoonStyle, name: "TMNT", icon: "🍕", desc: "Mutant action" },
      { id: "invincible" as CartoonStyle, name: "Invincible", icon: "💥", desc: "Comic realism" },
      { id: "spiderverse" as CartoonStyle, name: "Spider-Verse", icon: "🕷️", desc: "Halftone glow" },
      { id: "arcane" as CartoonStyle, name: "Arcane", icon: "🎨", desc: "Painterly 3D" },
    ],
    soft: [
      { id: "ghibli" as CartoonStyle, name: "Ghibli Dream", icon: "🌸", desc: "Watercolor serenity" },
      { id: "disney" as CartoonStyle, name: "Disney Classic", icon: "✨", desc: "Smooth nostalgic" },
      { id: "pixar" as CartoonStyle, name: "Pixar Realism", icon: "🎬", desc: "3D rounded faces" },
      { id: "papercut" as CartoonStyle, name: "Paper Cutout", icon: "✂️", desc: "Minimal handmade" },
      { id: "nicktoon" as CartoonStyle, name: "NickToon 90s", icon: "📺", desc: "Zany neon" },
    ],
    stylized: [
      { id: "noir" as CartoonStyle, name: "Comic Noir", icon: "🌑", desc: "Dark dramatic" },
      { id: "anime-neon" as CartoonStyle, name: "Anime Neon", icon: "💜", desc: "Glowing futuristic" },
      { id: "arcade" as CartoonStyle, name: "Arcade Pop", icon: "🎮", desc: "Vaporwave holo" },
      { id: "tlc-cinematic" as CartoonStyle, name: "TLC Cinematic", icon: "🎞️", desc: "Poster-grade" },
      { id: "teefeeme-fusion" as CartoonStyle, name: "TeeFeeMe Fusion", icon: "🔮", desc: "AI morph blend" },
    ],
  };

  const backgrounds = [
    { value: "auto", label: "Auto" },
    { value: "gradient", label: "Gradient" },
    { value: "okc-skyline", label: "OKC Skyline" },
    { value: "cafe", label: "Cafe" },
    { value: "gym", label: "Gym" },
    { value: "galaxy", label: "Galaxy" },
  ];

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large - max 10MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowResult(false);
    setCartoonUrl("");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const suggestPrompt = () => {
    const suggestions = [
      "Make me look heroic and powerful",
      "Give me a cheerful, playful vibe",
      "Transform me into an epic warrior",
      "Make it dreamy and romantic",
      "Turn me into a comedy character",
    ];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setCustomPrompt(random);
    toast.success("Prompt suggested!");
  };

  const handleCartoonify = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setCartoonUrl("");

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1.5, 90));
    }, 200);

    try {
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      
      const imageData = await imageDataPromise;

      // Build enhanced prompt
      let enhancedPrompt = `Transform into ${selectedStyle} style.`;
      if (customPrompt) enhancedPrompt += ` ${customPrompt}`;
      if (faceLock) enhancedPrompt += " Maintain facial features accurately.";

      const { data, error } = await supabase.functions.invoke('teefeeme-cartoonify', {
        body: { 
          imageData, 
          style: selectedStyle,
          prompt: enhancedPrompt,
          background,
        }
      });

      clearInterval(progressInterval);

      if (error || data?.error) {
        if (error?.message?.includes('429') || data?.code === 429) {
          toast.error('Too many requests - wait 30 seconds');
        } else if (error?.message?.includes('402') || data?.code === 402) {
          toast.error('AI credits depleted - contact admin');
        } else {
          toast.error('Failed to transform image');
        }
        return;
      }

      if (data?.cartoonImage) {
        setCartoonUrl(data.cartoonImage);
        
        // Smoothly complete progress to 100
        const completeProgress = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(completeProgress);
              setTimeout(() => {
                setShowResult(true);
                if (funMode) {
                  toast.success('🎉 TeeFee transformation complete! Looking good!');
                } else {
                  toast.success('✨ Transformation complete!');
                }
              }, 300);
              return 100;
            }
            return prev + 5;
          });
        }, 100);
      }
    } catch (error) {
      console.error('Cartoonify error:', error);
      toast.error('Failed to transform image');
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownload = () => {
    if (!cartoonUrl) return;
    const link = document.createElement("a");
    link.href = cartoonUrl;
    link.download = `teefeeme-${selectedStyle}-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  const applyFilters = () => {
    // Apply CSS filters to preview
    toast.info("Filters applied to preview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Hero Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black mb-2 gradient-text">
            🎨 TeeFeeMe — Cartoonifier Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform your photos into 20+ legendary cartoon styles
          </p>
        </div>

        {/* Upload Section */}
        {!selectedFile && (
          <Card
            className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer mb-8 ${
              dragActive ? "border-primary bg-primary/5 scale-105" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-6 rounded-full bg-primary/10">
                <Upload className="w-12 h-12 text-primary" />
              </div>
              <div>
                <p className="text-xl font-semibold mb-2">Drop photo or click to browse</p>
                <p className="text-sm text-muted-foreground">JPG, PNG, WEBP • Max 10MB</p>
              </div>
            </div>
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Main Interface */}
        {selectedFile && !showResult && (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left: Preview & Controls */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Preview</h3>
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto rounded-lg border-2 border-border"
                    style={{
                      filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
                    }}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg">
                      <Zap className="w-16 h-16 text-primary animate-pulse mb-4" />
                      <p className="text-white font-bold text-lg">Processing... {progress}%</p>
                      <div className="w-64 h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Refine Sliders */}
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    Refine Image
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Brightness: {brightness[0]}%</Label>
                      <Slider value={brightness} onValueChange={setBrightness} min={50} max={150} />
                    </div>
                    <div>
                      <Label>Contrast: {contrast[0]}%</Label>
                      <Slider value={contrast} onValueChange={setContrast} min={50} max={150} />
                    </div>
                    <div>
                      <Label>Color Pop: {saturation[0]}%</Label>
                      <Slider value={saturation} onValueChange={setSaturation} min={0} max={200} />
                    </div>
                    <div>
                      <Label>Outline Weight: {outlineWeight[0]}%</Label>
                      <Slider value={outlineWeight} onValueChange={setOutlineWeight} min={0} max={100} />
                    </div>
                    <Button variant="outline" size="sm" onClick={applyFilters} className="w-full">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Prompt & Options */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Switch checked={faceLock} onCheckedChange={setFaceLock} />
                    <Label>Face-Lock (Keep Identity Accurate)</Label>
                  </div>

                  <div>
                    <Label>Describe Your Vibe</Label>
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="e.g., Make me look heroic and powerful"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={2}
                      />
                      <Button variant="outline" size="icon" onClick={suggestPrompt}>
                        <Wand2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Background</Label>
                    <Select value={background} onValueChange={setBackground}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgrounds.map(bg => (
                          <SelectItem key={bg.value} value={bg.value}>{bg.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch checked={funMode} onCheckedChange={setFunMode} />
                    <Label>Fun Mode (Voiceover Jokes)</Label>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handleCartoonify}
                    disabled={isProcessing}
                  >
                    <Sparkles className="mr-2" />
                    TeeFee Me!
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right: Style Picker */}
            <div>
              <Card className="p-6 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Pick Your Style</h3>
                <Tabs defaultValue="classic">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="classic">Classic</TabsTrigger>
                    <TabsTrigger value="action">Action</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="soft">Soft</TabsTrigger>
                    <TabsTrigger value="stylized">Stylized</TabsTrigger>
                  </TabsList>

                  {Object.entries(styleCategories).map(([category, styles]) => (
                    <TabsContent key={category} value={category} className="space-y-2">
                      {styles.map((style) => (
                        <Button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          variant={selectedStyle === style.id ? "default" : "outline"}
                          className="w-full justify-start h-auto py-3"
                        >
                          <span className="text-2xl mr-3">{style.icon}</span>
                          <div className="text-left">
                            <div className="font-bold">{style.name}</div>
                            <div className="text-xs opacity-70">{style.desc}</div>
                          </div>
                        </Button>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            </div>
          </div>
        )}

        {/* Results */}
        {showResult && cartoonUrl && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-4xl font-black mb-6 text-center gradient-text">
                You've Been TeeFeed! 🎉
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">Before</h3>
                  <img src={previewUrl} alt="Before" className="w-full rounded-lg border-2" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 gradient-text">After</h3>
                  <img src={cartoonUrl} alt="After" className="w-full rounded-lg border-4 border-primary" />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <Button size="lg" onClick={handleDownload}>
                  <Download className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowResult(false)}>
                  <Sparkles className="mr-2" />
                  Try Another Style
                </Button>
                <Button variant="secondary" size="lg" onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl("");
                  setCartoonUrl("");
                  setShowResult(false);
                }}>
                  <RefreshCw className="mr-2" />
                  New Photo
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeeFeeMeCartoonifierNew;