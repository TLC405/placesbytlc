import { useState, useRef } from "react";
import { Upload, Sparkles, Download, RefreshCw, Camera, Wand2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type CartoonStyle = "simpsons" | "flintstones" | "trump" | "elon" | "familyguy" | "renandstimpy";

const TeeFeeMeCartoonifier = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cartoonUrl, setCartoonUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>("simpsons");
  const [showResult, setShowResult] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime] = useState(30); // 30 seconds estimated
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const styles = [
    { 
      id: "simpsons" as CartoonStyle, 
      name: "The Simpsons", 
      emoji: "💛",
      gradient: "from-yellow-400 to-yellow-600",
      borderColor: "border-yellow-500"
    },
    { 
      id: "flintstones" as CartoonStyle, 
      name: "Flintstones", 
      emoji: "🦴",
      gradient: "from-orange-400 to-red-500",
      borderColor: "border-orange-500"
    },
    { 
      id: "trump" as CartoonStyle, 
      name: "Trump Style", 
      emoji: "🎩",
      gradient: "from-red-500 to-blue-600",
      borderColor: "border-blue-500"
    },
    { 
      id: "elon" as CartoonStyle, 
      name: "Elon Musk", 
      emoji: "🚀",
      gradient: "from-blue-500 to-purple-600",
      borderColor: "border-purple-500"
    },
    { 
      id: "familyguy" as CartoonStyle, 
      name: "Family Guy", 
      emoji: "🍺",
      gradient: "from-green-400 to-blue-500",
      borderColor: "border-teal-500"
    },
    { 
      id: "renandstimpy" as CartoonStyle, 
      name: "Ren & Stimpy", 
      emoji: "😵",
      gradient: "from-pink-500 to-red-600",
      borderColor: "border-red-500"
    },
  ];

  const funnyMessages = [
    "🎨 Adding cartoon magic...",
    "✨ Transforming your face into art...",
    "🎭 Applying legendary style...",
    "🌟 Making you absolutely fabulous...",
    "💫 Almost ready... perfecting details...",
    "🎪 Creating cartoon masterpiece...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large! Please upload an image under 10MB.");
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
    if (!previewUrl) return;

    setIsProcessing(true);
    setElapsedTime(0);
    setCurrentMessageIndex(0);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 0.1);
    }, 100);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % funnyMessages.length);
    }, 2000);

    try {
      // Convert image to base64
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      
      const imageData = await imageDataPromise;

      // Call AI edge function
      const { data, error } = await supabase.functions.invoke('teefeeme-cartoonify', {
        body: {
          imageData,
          style: selectedStyle
        }
      });

      if (error) throw error;

      if (data?.cartoonImage) {
        setCartoonUrl(data.cartoonImage);
        setShowResult(true);
        toast.success("🎉 Your TeeFee cartoon is ready!");
      } else {
        throw new Error('No cartoon image returned');
      }
    } catch (error) {
      console.error('Cartoonify error:', error);
      toast.error("Oops! The magic didn't work. Try again!");
    } finally {
      setIsProcessing(false);
      clearInterval(messageInterval);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleDownload = () => {
    if (!cartoonUrl) return;
    const link = document.createElement("a");
    link.href = cartoonUrl;
    link.download = `teefeeme-${selectedStyle}-${Date.now()}.png`;
    link.click();
    toast.success("🎁 Your cartoon downloaded!");
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Festive Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-pink-500/20 to-purple-600/20 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,0,255,0.15),transparent_50%)]" />
        
        {/* Floating Sparkles */}
        <div className="absolute top-20 left-20 animate-float">✨</div>
        <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: "0.5s" }}>🎨</div>
        <div className="absolute bottom-32 left-40 animate-float" style={{ animationDelay: "1s" }}>💫</div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: "1.5s" }}>⭐</div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        {!selectedFile && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="text-8xl mb-6 animate-float">🎨</div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text drop-shadow-2xl">
              TeeFee Me
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your photos into legendary cartoon styles
            </p>

            {/* Upload Zone */}
            <Card
              className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer glass ${
                dragActive ? "border-primary bg-primary/10 scale-105" : "border-muted-foreground/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 rounded-full bg-gradient-to-br from-yellow-500 via-pink-500 to-purple-600 shadow-glow animate-pulse-subtle">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2">Drop your photo here or click to browse</p>
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
              Take a Selfie
            </Button>
          </div>
        )}

        {/* Style Selection */}
        {selectedFile && !showResult && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-3 gradient-text">
                Pick Your Style 🎭
              </h2>
              <p className="text-lg text-muted-foreground">Choose your legendary transformation</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {styles.map((style) => (
                <Button
                  key={style.id}
                  onClick={() => {
                    setSelectedStyle(style.id);
                    if (cartoonUrl) {
                      setCartoonUrl("");
                      setShowResult(false);
                    }
                  }}
                  className={`h-32 flex flex-col gap-2 transition-all duration-300 border-4 rounded-2xl ${
                    selectedStyle === style.id 
                      ? `bg-gradient-to-br ${style.gradient} ${style.borderColor} text-white shadow-glow scale-110 animate-bounce-in` 
                      : `bg-muted/50 border-muted hover:border-primary/50 hover:scale-105 hover:shadow-lg`
                  }`}
                  style={{
                    transform: selectedStyle === style.id ? 'rotate(-2deg)' : 'rotate(0deg)',
                    fontFamily: selectedStyle === style.id ? '"Comic Sans MS", cursive' : 'inherit'
                  }}
                >
                  <span className="text-4xl drop-shadow-lg">{style.emoji}</span>
                  <span className="font-bold text-lg">{style.name}</span>
                </Button>
              ))}
            </div>

            <Card className="p-8 glass">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto rounded-xl shadow-elegant max-h-96 object-contain border-4 border-primary/20"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    onClick={handleCartoonify}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:opacity-90 shadow-glow text-lg py-6"
                  >
                    {isProcessing ? (
                      <>
                        <Wand2 className="mr-2 animate-spin" />
                        Creating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 animate-bounce" />
                        TeeFee Me!
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleNewPhoto}>
                    <RefreshCw className="mr-2" />
                    Different Photo
                  </Button>
                </div>
              </div>

              {isProcessing && (
                <div className="mt-8 text-center animate-fade-in">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse-subtle">
                    {funnyMessages[currentMessageIndex]}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="text-5xl font-black text-primary animate-pulse">
                      {Math.max(0, Math.ceil(estimatedTime - elapsedTime))}s
                    </div>
                    <p className="text-sm text-muted-foreground font-semibold">
                      Estimated time remaining
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Results */}
        {showResult && cartoonUrl && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-5xl font-bold mb-3 gradient-text">
                You've Been TeeFeed! 🎉
              </h2>
              <p className="text-lg text-muted-foreground">Transformation complete</p>
            </div>

            <Card className="p-8 glass">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-center">Before</h3>
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto rounded-xl shadow-elegant border-4 border-muted-foreground/20"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    After - {styles.find(s => s.id === selectedStyle)?.name} ✨
                  </h3>
                  <img
                    src={cartoonUrl}
                    alt="Cartoon"
                    className="w-full h-auto rounded-xl shadow-glow border-4 border-primary animate-pulse-subtle"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:opacity-90 text-lg py-6"
                >
                  <Download className="mr-2" />
                  Download Cartoon
                </Button>
                <Button variant="outline" size="lg" onClick={handleReset}>
                  <Sparkles className="mr-2" />
                  Try Another Style!
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

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
          font-size: 2rem;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TeeFeeMeCartoonifier;
