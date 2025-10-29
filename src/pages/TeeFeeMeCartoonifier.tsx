import { useState, useRef } from "react";
import { Upload, Download, Sparkles, Zap, Wand2, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RoleGuard } from "@/components/RoleGuard";

type CartoonStyle = 
  | "simpsons" | "familyguy" | "renandstimpy" | "southpark" | "boondocks"
  | "dbz" | "tmnt" | "invincible" | "spiderverse" | "arcane"
  | "ghibli" | "disney" | "pixar" | "anime" | "comic";

const TeeFeeMeCartoonifier = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cartoonUrl, setCartoonUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>("simpsons");
  const [showResult, setShowResult] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styleCategories = {
    classic: [
      { id: "simpsons" as CartoonStyle, name: "Simpsons", icon: "🍩", desc: "Yellow skin, spiky hair", premium: false },
      { id: "familyguy" as CartoonStyle, name: "Family Guy", icon: "🍺", desc: "Bold flat colors", premium: false },
      { id: "renandstimpy" as CartoonStyle, name: "Ren & Stimpy", icon: "😵", desc: "Gross-out vintage", premium: true },
      { id: "southpark" as CartoonStyle, name: "South Park", icon: "🎿", desc: "Simple cutout style", premium: false },
      { id: "boondocks" as CartoonStyle, name: "Boondocks", icon: "✊", desc: "Anime-influenced", premium: true },
    ],
    action: [
      { id: "dbz" as CartoonStyle, name: "Dragon Ball Z", icon: "⚡", desc: "Muscular, aura effects", premium: true },
      { id: "tmnt" as CartoonStyle, name: "TMNT", icon: "🍕", desc: "Comic book action", premium: true },
      { id: "invincible" as CartoonStyle, name: "Invincible", icon: "💥", desc: "Detailed superhero", premium: true },
      { id: "spiderverse" as CartoonStyle, name: "Spider-Verse", icon: "🕷️", desc: "Halftone comic pop", premium: true },
      { id: "arcane" as CartoonStyle, name: "Arcane", icon: "🎨", desc: "Painterly 3D art", premium: true },
    ],
    artistic: [
      { id: "ghibli" as CartoonStyle, name: "Studio Ghibli", icon: "🌸", desc: "Watercolor dream", premium: true },
      { id: "disney" as CartoonStyle, name: "Disney Classic", icon: "✨", desc: "Smooth timeless", premium: false },
      { id: "pixar" as CartoonStyle, name: "Pixar 3D", icon: "🎬", desc: "Rounded realistic", premium: true },
      { id: "anime" as CartoonStyle, name: "Anime", icon: "🎌", desc: "Big eyes, detailed", premium: false },
      { id: "comic" as CartoonStyle, name: "Comic Book", icon: "💥", desc: "Bold ink lines", premium: false },
    ],
  };

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

  const handleCartoonify = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setCartoonUrl("");

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 95));
    }, 150);

    try {
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      
      const imageData = await imageDataPromise;

      const { data, error } = await supabase.functions.invoke('teefeeme-cartoonify', {
        body: { 
          imageData, 
          style: selectedStyle,
          prompt: customPrompt || undefined
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
        setProgress(100);
        setCartoonUrl(data.cartoonImage);
        setTimeout(() => {
          setShowResult(true);
          toast.success('🎉 TeeFee transformation complete!');
        }, 300);
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

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setCartoonUrl("");
    setShowResult(false);
    setCustomPrompt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <RoleGuard 
      requiredRoles={['admin', 'alpha', 'beta', 'delta']} 
      featureName="TeeFeeMe Cartoonifier"
      fallbackMessage="Only Alpha, Beta, Delta testers and Admins can use this epic feature"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Epic Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4 p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30">
              <Sparkles className="w-16 h-16 text-purple-400" />
            </div>
            <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              TeeFeeMe Cartoonifier
            </h1>
            <p className="text-xl text-purple-300/80 font-mono">
              [ TRANSFORM YOUR PHOTOS INTO LEGENDARY CARTOON STYLES ]
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 font-mono">
                15+ STYLES
              </Badge>
              <Badge variant="outline" className="border-pink-500/50 text-pink-400 font-mono">
                AI POWERED
              </Badge>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 font-mono">
                BETA ACCESS
              </Badge>
            </div>
          </div>

          {/* Upload Section */}
          {!selectedFile && (
            <Card
              className={`p-16 border-2 border-dashed transition-all duration-300 cursor-pointer mb-8 ${
                dragActive 
                  ? "border-purple-500 bg-purple-500/10 scale-105 shadow-2xl shadow-purple-500/20" 
                  : "border-purple-500/30 bg-slate-900/50 hover:border-purple-500/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="p-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30">
                  <Upload className="w-16 h-16 text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold mb-2 text-purple-300">Drop your photo here</p>
                  <p className="text-sm text-purple-400/60 font-mono">
                    JPG, PNG, WEBP • Max 10MB
                  </p>
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
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Preview */}
              <div className="lg:col-span-2">
                <Card className="p-6 bg-slate-900/50 border-purple-500/30">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto rounded-lg"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm">
                        <Zap className="w-20 h-20 text-purple-400 animate-pulse mb-4" />
                        <p className="text-2xl font-black text-purple-300 mb-2 font-mono">
                          [ PROCESSING ]
                        </p>
                        <div className="w-80 h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-purple-400 font-mono mt-2">{progress}%</p>
                      </div>
                    )}
                  </div>

                  {/* Custom Prompt */}
                  <div className="mt-6 space-y-4">
                    <Label className="text-purple-300 font-mono">CUSTOM INSTRUCTIONS (OPTIONAL)</Label>
                    <Textarea 
                      placeholder="e.g., Make me look heroic and powerful with vibrant colors"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={3}
                      className="bg-slate-800/50 border-purple-500/30 text-purple-200 font-mono"
                    />
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold font-mono"
                      onClick={handleCartoonify}
                      disabled={isProcessing}
                    >
                      <Sparkles className="mr-2" />
                      [ TEEFEEME! ]
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-mono"
                      onClick={handleReset}
                    >
                      <RefreshCw className="mr-2" />
                      [ RESET ]
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Style Selector */}
              <div>
                <Card className="p-6 bg-slate-900/50 border-purple-500/30 sticky top-4">
                  <h3 className="text-xl font-black mb-4 text-purple-300 font-mono">
                    [ SELECT STYLE ]
                  </h3>
                  <Tabs defaultValue="classic">
                    <TabsList className="grid grid-cols-3 mb-4 bg-slate-800/50">
                      <TabsTrigger value="classic" className="font-mono text-xs">CLASSIC</TabsTrigger>
                      <TabsTrigger value="action" className="font-mono text-xs">ACTION</TabsTrigger>
                      <TabsTrigger value="artistic" className="font-mono text-xs">ART</TabsTrigger>
                    </TabsList>

                    {Object.entries(styleCategories).map(([category, styles]) => (
                      <TabsContent key={category} value={category} className="space-y-2">
                        {styles.map((style) => (
                          <Button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            variant={selectedStyle === style.id ? "default" : "outline"}
                            className={`w-full justify-start h-auto py-3 ${
                              selectedStyle === style.id 
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0" 
                                : "border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10"
                            }`}
                          >
                            <span className="text-2xl mr-3">{style.icon}</span>
                            <div className="text-left flex-1">
                              <div className="font-bold text-sm">{style.name}</div>
                              <div className="text-xs opacity-70">{style.desc}</div>
                            </div>
                            {style.premium && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-pink-500/20 text-pink-400 border-pink-500/30">
                                PRO
                              </Badge>
                            )}
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
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  🎨 YOU'VE BEEN TEEFEED!
                </h2>
              </div>

              <Card className="p-8 bg-slate-900/50 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-center text-purple-300 font-mono">
                      [ BEFORE ]
                    </h3>
                    <img
                      src={previewUrl}
                      alt="Original"
                      className="w-full h-auto rounded-lg border-2 border-purple-500/30"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
                      [ AFTER - {selectedStyle.toUpperCase()} ]
                    </h3>
                    <img
                      src={cartoonUrl}
                      alt="Cartoon"
                      className="w-full h-auto rounded-lg border-4 border-purple-500 shadow-2xl shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  <Button
                    size="lg"
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold font-mono shadow-xl hover:shadow-2xl transition-all"
                  >
                    <Download className="mr-2" />
                    [ DOWNLOAD ]
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleReset}
                    className="border-2 border-purple-500/40 hover:bg-purple-500/10 text-purple-400 font-mono"
                  >
                    <Sparkles className="mr-2" />
                    [ NEW PHOTO ]
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default TeeFeeMeCartoonifier;
