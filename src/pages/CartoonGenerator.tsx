import { useState, useRef } from "react";
import { Upload, Sparkles, Download, RefreshCw, Heart, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import crownImage from "@/assets/felicia-crown.png";

type CartoonStyle = "disney" | "pixar" | "anime" | "comic" | "watercolor";

const CartoonGenerator = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cartoonUrl, setCartoonUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>("disney");
  const [showResult, setShowResult] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    { id: "disney" as CartoonStyle, name: "Disney Classic", emoji: "🏰" },
    { id: "pixar" as CartoonStyle, name: "Pixar 3D", emoji: "🎬" },
    { id: "anime" as CartoonStyle, name: "Anime Style", emoji: "⚡" },
    { id: "comic" as CartoonStyle, name: "Comic Book", emoji: "💥" },
    { id: "watercolor" as CartoonStyle, name: "Watercolor", emoji: "🎨" },
  ];

  const loadingMessages = [
    "Sprinkling cartoon fairy dust ✨",
    "Applying royal cartoon magic 👑",
    "Transforming you into a cartoon character 🎨",
    "Adding sparkles and magic ⭐",
    "Almost there... making it perfect! 💫",
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
    if (!selectedFile) return;

    setIsProcessing(true);
    setCurrentMessageIndex(0);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    try {
      // TODO: Implement actual AI cartoonification
      // For now, simulate processing
      await new Promise((resolve) => setTimeout(resolve, 6000));
      
      // Use the original image as placeholder
      setCartoonUrl(previewUrl);
      setShowResult(true);
      toast.success("✨ Your cartoon is ready!");
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
      clearInterval(messageInterval);
    }
  };

  const handleDownload = () => {
    if (!cartoonUrl) return;
    const link = document.createElement("a");
    link.href = cartoonUrl;
    link.download = `felicia-crown-cartoon-${Date.now()}.png`;
    link.click();
    toast.success("Cartoon downloaded! 🎉");
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setCartoonUrl("");
    setShowResult(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background - Inspired by LoadingScreen */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-yellow-500/20 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        {!selectedFile && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative inline-block mb-6">
              <img
                src={crownImage}
                alt="Felicia's Crown"
                className="w-64 h-auto mx-auto animate-float cursor-pointer hover:scale-110 transition-transform duration-300"
                onClick={() => fileInputRef.current?.click()}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent blur-3xl animate-pulse-subtle" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
              Felicia's Crown 👑
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Touch the crown to transform your photo into cartoon magic!
            </p>

            {/* Upload Zone */}
            <Card
              className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer glass ${
                dragActive ? "border-primary bg-primary/5 scale-105" : "border-muted-foreground/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-glow">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2">Drop your photo here or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, or WEBP (Max 10MB)
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

            {/* Mobile Camera Button */}
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
              Take a Photo
            </Button>
          </div>
        )}

        {/* Preview & Style Selection */}
        {selectedFile && !showResult && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2 gradient-text">Choose Your Style ✨</h2>
              <p className="text-muted-foreground">Pick a cartoon style for your transformation</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {styles.map((style) => (
                <Card
                  key={style.id}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedStyle === style.id
                      ? "border-2 border-primary shadow-glow bg-primary/10"
                      : "border border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{style.emoji}</div>
                    <p className="font-semibold text-sm">{style.name}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-8 glass">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto rounded-lg shadow-elegant max-h-96 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    onClick={handleCartoonify}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-glow"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="mr-2 animate-spin" />
                        Transforming...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2" />
                        Cartoonify Me!
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="mr-2" />
                    Choose Different Photo
                  </Button>
                </div>
              </div>

              {isProcessing && (
                <div className="mt-8 text-center animate-fade-in">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <p className="text-lg font-medium gradient-text animate-pulse-subtle">
                    {loadingMessages[currentMessageIndex]}
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Results */}
        {showResult && cartoonUrl && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2 gradient-text">Ta-da! 🎉</h2>
              <p className="text-muted-foreground">Your magical cartoon transformation is complete!</p>
            </div>

            <Card className="p-8 glass">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">Original</h3>
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto rounded-lg shadow-elegant"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">Cartoon ✨</h3>
                  <img
                    src={cartoonUrl}
                    alt="Cartoon"
                    className="w-full h-auto rounded-lg shadow-glow"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Download className="mr-2" />
                  Download Cartoon
                </Button>
                <Button variant="outline" size="lg" onClick={handleReset}>
                  <RefreshCw className="mr-2" />
                  Try Another Photo
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="mr-2" />
                  Share
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
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CartoonGenerator;
