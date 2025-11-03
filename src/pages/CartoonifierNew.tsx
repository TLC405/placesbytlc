import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Sparkles, Download, RefreshCw, Heart } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

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
    <RoleGuard allowedRoles={['admin','alpha','beta','delta','moderator']} featureName="Cartoonifier">
    <div className="min-h-screen bg-[#964B00] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl animate-pulse">🍄</span>
            <h1 className="text-5xl font-black text-[#03A9F4]">
              ✨ CARTOONIFY YOUR IDENTITY ✨
            </h1>
            <span className="text-4xl animate-bounce">🌿</span>
          </div>
          <p className="text-[#F7DC6F] font-semibold text-lg">
            Transform your photos into perfectly identity-locked cartoons 🎨
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white border-2 border-[#DDDDDD] shadow-xl p-8 rounded-[10px]">
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
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-6">
                      <Upload className="w-20 h-20 text-[#8BC34A] mx-auto group-hover:text-[#F7DC6F] transition-colors animate-bounce" />
                      <p className="text-[#03A9F4] font-semibold">
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
                <h3 className="text-2xl font-bold flex items-center gap-2 text-[#03A9F4]">
                  <Sparkles className="w-5 h-5" />
                  Your Cartoon Magic ✨
                </h3>
                <div className="relative aspect-square rounded-[10px] border-2 border-[#8BC34A] bg-white flex items-center justify-center overflow-hidden shadow-lg">
                  {cartoonImage ? (
                    <img
                      src={cartoonImage}
                      alt="Cartoon"
                      className="w-full h-full object-cover rounded-[10px] animate-fade-in"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-6">
                      <Sparkles className="w-20 h-20 text-[#8BC34A] mx-auto animate-pulse" />
                      <p className="text-[#03A9F4] font-semibold">
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
                  <span className="text-[#03A9F4]">Creating magic...</span>
                  <span className="text-[#8BC34A]">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-[#8BC34A]/20" />
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button
                onClick={generateCartoon}
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
                    Make It Cute!
                  </>
                )}
              </Button>

              {cartoonImage && (
                <Button
                  onClick={downloadCartoon}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#8BC34A] hover:bg-[#F7DC6F] hover:text-[#964B00] text-[#03A9F4] font-bold min-w-[220px] h-14 text-lg rounded-[10px] shadow-lg"
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
                  className="border-2 border-[#DDDDDD] hover:bg-[#F7DC6F] hover:text-[#964B00] text-[#03A9F4] font-bold h-14 rounded-[10px] shadow-lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Start Over
                </Button>
              )}
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-[#F7DC6F] font-medium space-y-2">
            <p className="flex items-center justify-center gap-2">
              <span>🍄</span>
              Powered by TeeFeeMe AI Systems
              <span>🍄</span>
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
