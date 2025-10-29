import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Sparkles, Download, RefreshCw, Heart } from "lucide-react";

export default function CartoonifierNew() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setCartoonImage(null);
      setProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const generateCartoon = async () => {
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

      const { data, error } = await supabase.functions.invoke("teefeeme-cartoonify", {
        body: { image: base64Data },
      });

      clearInterval(progressInterval);

      if (error) throw error;

      if (data?.cartoonImage) {
        setProgress(100);
        setCartoonImage(`data:image/png;base64,${data.cartoonImage}`);
        toast.success("🎨 Cartoon Generated!", {
          description: "Your epic cartoon is ready",
        });
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

  const downloadCartoon = () => {
    if (!cartoonImage) return;

    const link = document.createElement("a");
    link.href = cartoonImage;
    link.download = `tlc-cartoon-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  const reset = () => {
    setOriginalImage(null);
    setCartoonImage(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Cupid Theme */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-pink-500 animate-pulse fill-pink-500" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              💘 CARTOONIFY YOUR LOVE 💘
            </h1>
            <Sparkles className="w-10 h-10 text-purple-500 animate-bounce" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
            Transform your photos into adorable cartoons ✨
          </p>
        </div>

        {/* Main Card with Glass Effect */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-pink-200 dark:border-pink-500/30 shadow-2xl shadow-pink-500/20 p-8 rounded-3xl">
          <div className="grid md:grid-cols-2 gap-8">
              {/* Original Image */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-pink-600 dark:text-pink-400">
                  <Upload className="w-5 h-5" />
                  Upload Your Photo
                </h3>
                <div
                  className="relative aspect-square rounded-2xl border-3 border-dashed border-pink-300 dark:border-pink-500/50 hover:border-pink-500 dark:hover:border-pink-400 transition-all bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/30 flex items-center justify-center overflow-hidden cursor-pointer group shadow-lg hover:shadow-pink-500/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {originalImage ? (
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-6">
                      <Upload className="w-20 h-20 text-pink-400 mx-auto group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors animate-bounce" />
                      <p className="text-gray-600 dark:text-gray-300 font-semibold">
                        Tap to choose image 📸
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Cartoon Result */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-5 h-5" />
                  Your Cartoon Magic ✨
                </h3>
                <div className="relative aspect-square rounded-2xl border-3 border-purple-300 dark:border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-pink-900/30 flex items-center justify-center overflow-hidden shadow-lg">
                  {cartoonImage ? (
                    <img
                      src={cartoonImage}
                      alt="Cartoon"
                      className="w-full h-full object-cover animate-fade-in"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-6">
                      <Sparkles className="w-20 h-20 text-purple-400 mx-auto animate-pulse" />
                      <p className="text-gray-600 dark:text-gray-300 font-semibold">
                        Your masterpiece appears here 🎨
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {processing && (
              <div className="mt-6 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-gray-600 dark:text-gray-300">Creating magic...</span>
                  <span className="text-pink-600 dark:text-pink-400">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-pink-100 dark:bg-pink-900/30" />
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button
                onClick={generateCartoon}
                disabled={!originalImage || processing}
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 hover:from-pink-600 hover:via-purple-600 hover:to-rose-600 text-white font-bold shadow-xl shadow-pink-500/50 min-w-[220px] h-14 text-lg rounded-full"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Cartoonifying...
                  </>
                ) : (
                  <>
                    <Heart className="w-6 h-6 mr-2 fill-white" />
                    Make It Cute!
                  </>
                )}
              </Button>

              {cartoonImage && (
                <Button
                  onClick={downloadCartoon}
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold min-w-[220px] h-14 text-lg rounded-full shadow-lg"
                >
                  <Download className="w-6 h-6 mr-2" />
                  Download ⬇️
                </Button>
              )}

              {(originalImage || cartoonImage) && (
                <Button
                  onClick={reset}
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold h-14 rounded-full shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Start Over
                </Button>
              )}
            </div>
          </Card>

          {/* Info Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium space-y-2">
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              Powered by TLC AI Love Systems
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            </p>
          </div>
        </div>
      </div>
  );
}
