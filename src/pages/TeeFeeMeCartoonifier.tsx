import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, Camera, Sparkles, ImageIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type CartoonStyle = "simpsons" | "flintstones" | "trump" | "elon" | "familyguy" | "renandstimpy" | "southpark" | "anime" | "disney" | "marvel" | "pixar" | "rickmorty";

const TeeFeeMeCartoonifier = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cartoonUrl, setCartoonUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>("simpsons");
  const [showResult, setShowResult] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    { 
      id: "simpsons" as CartoonStyle, 
      name: "Simpsons", 
      icon: "🍩",
      color: "bg-yellow-500",
      available: true
    },
    { 
      id: "flintstones" as CartoonStyle, 
      name: "Flintstones", 
      icon: "🦴",
      color: "bg-orange-500",
      available: true
    },
    { 
      id: "trump" as CartoonStyle, 
      name: "Trump", 
      icon: "🎩",
      color: "bg-blue-600",
      available: true
    },
    { 
      id: "elon" as CartoonStyle, 
      name: "Elon", 
      icon: "🚀",
      color: "bg-purple-600",
      available: true
    },
    { 
      id: "familyguy" as CartoonStyle, 
      name: "Family Guy", 
      icon: "🍺",
      color: "bg-teal-500",
      available: true
    },
    { 
      id: "renandstimpy" as CartoonStyle, 
      name: "Ren & Stimpy", 
      icon: "😵",
      color: "bg-red-500",
      available: true
    },
    { 
      id: "southpark" as CartoonStyle, 
      name: "South Park", 
      icon: "🎿",
      color: "bg-cyan-500",
      available: false
    },
    { 
      id: "anime" as CartoonStyle, 
      name: "Anime", 
      icon: "⚡",
      color: "bg-pink-500",
      available: false
    },
    { 
      id: "disney" as CartoonStyle, 
      name: "Disney", 
      icon: "✨",
      color: "bg-blue-400",
      available: false
    },
    { 
      id: "marvel" as CartoonStyle, 
      name: "Marvel", 
      icon: "💥",
      color: "bg-red-600",
      available: false
    },
    { 
      id: "pixar" as CartoonStyle, 
      name: "Pixar", 
      icon: "🎬",
      color: "bg-teal-600",
      available: false
    },
    { 
      id: "rickmorty" as CartoonStyle, 
      name: "Rick & Morty", 
      icon: "🧪",
      color: "bg-green-600",
      available: false
    },
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

  const handleCartoonify = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setCartoonUrl("");
    setStatusMessage("Analyzing your image...");

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 2, 95);
        // Update status messages based on progress
        if (newProgress >= 20 && newProgress < 40) {
          setStatusMessage("Applying style transformation...");
        } else if (newProgress >= 40 && newProgress < 70) {
          setStatusMessage("Processing artistic effects...");
        } else if (newProgress >= 70) {
          setStatusMessage("Finalizing your cartoon...");
        }
        return newProgress;
      });
    }, 300);

    try {
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      
      const imageData = await imageDataPromise;

      const { data, error } = await supabase.functions.invoke('teefeeme-cartoonify', {
        body: { imageData, style: selectedStyle }
      });

      clearInterval(progressInterval);

      if (error) {
        if (error.message?.includes('429')) {
          toast.error('Too many requests - wait 30 seconds');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits depleted - contact admin');
        } else {
          throw error;
        }
        return;
      }

      if (data?.error) {
        if (data.code === 429) {
          toast.error('Too many requests - wait 30 seconds');
        } else if (data.code === 402) {
          toast.error('AI credits depleted - contact admin');
        } else {
          toast.error(`Error: ${data.error}`);
        }
        return;
      }

      if (data?.cartoonImage) {
        setStatusMessage("Complete! 🎉");
        setProgress(100);
        setCartoonUrl(data.cartoonImage);
        setTimeout(() => {
          setShowResult(true);
          toast.success('TeeFee transformation complete!');
        }, 500);
      } else {
        throw new Error('No image returned');
      }
    } catch (error) {
      console.error('Cartoonify error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to transform image";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
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
    setCartoonUrl("");
    setShowResult(false);
  };

  const handleNewPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setCartoonUrl("");
    setShowResult(false);
    setSelectedStyle("simpsons");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        {!selectedFile && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="text-8xl mb-6">🎨</div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              TeeFee Me
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your photos into legendary cartoon styles
            </p>

            <Card
              className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer ${
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
                  <p className="text-xl font-semibold mb-2">Drop photo here or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, or WEBP • Max 10MB
                  </p>
                </div>
              </div>
            </Card>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <Button
              variant="outline"
              size="lg"
              className="mt-6 md:hidden"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.setAttribute("capture", "environment");
                  fileInputRef.current.click();
                }
              }}
            >
              <Camera className="mr-2" />
              Take Selfie
            </Button>
          </div>
        )}

        {/* Style Selection & Processing */}
        {selectedFile && !showResult && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-4xl font-black mb-3">
                Pick Your Style
              </h2>
              <p className="text-lg text-muted-foreground">Choose your transformation</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {styles.map((style) => (
                <Button
                  key={style.id}
                  onClick={() => {
                    if (!style.available) {
                      toast.info(`${style.name} coming soon!`);
                      return;
                    }
                    setSelectedStyle(style.id);
                    if (cartoonUrl) {
                      setCartoonUrl("");
                      setShowResult(false);
                    }
                  }}
                  disabled={!style.available}
                  variant={selectedStyle === style.id ? "default" : "outline"}
                  className={`h-24 flex flex-col gap-2 relative ${
                    !style.available ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {!style.available && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                      SOON
                    </div>
                  )}
                  <span className="text-3xl">{style.icon}</span>
                  <span className="font-bold text-sm">{style.name}</span>
                </Button>
              ))}
            </div>

            <Card className="p-6">
              <div className="relative">
                <h3 className="text-xl font-bold mb-4 text-center">
                  {isProcessing ? 'Processing...' : 'Your Photo'}
                </h3>
                
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={`w-full h-auto rounded-lg border-2 transition-opacity duration-300 ${
                      isProcessing ? 'opacity-50 border-primary' : 'border-border'
                    }`}
                  />
                  
                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                      <div className="text-center space-y-4 p-6">
                        <Zap className="w-16 h-16 mx-auto text-primary animate-pulse" />
                        <p className="text-lg font-bold animate-pulse">{statusMessage}</p>
                        
                        <div className="w-full max-w-xs space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-3 bg-background/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          This may take 20-40 seconds
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isProcessing && (
                  <div className="flex flex-col gap-3 mt-6">
                    <Button
                      size="lg"
                      onClick={handleCartoonify}
                      className="w-full text-lg py-6"
                    >
                      <Sparkles className="mr-2" />
                      TeeFee Me!
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleNewPhoto} className="w-full">
                      <RefreshCw className="mr-2" />
                      Different Photo
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Results */}
        {showResult && cartoonUrl && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-5xl font-black mb-3">
                You've Been TeeFeed!
              </h2>
              <p className="text-lg text-muted-foreground">Transformation complete</p>
            </div>

            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-center">Before</h3>
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto rounded-lg border-2 border-border"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-center">
                    After - {styles.find(s => s.id === selectedStyle)?.name}
                  </h3>
                  <img
                    src={cartoonUrl}
                    alt="Cartoon"
                    className="w-full h-auto rounded-lg border-2 border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="text-lg py-6"
                >
                  <Download className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="lg" onClick={handleReset}>
                  <Sparkles className="mr-2" />
                  Try Another Style
                </Button>
                <Button variant="secondary" size="lg" onClick={handleNewPhoto}>
                  <ImageIcon className="mr-2" />
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

export default TeeFeeMeCartoonifier;
