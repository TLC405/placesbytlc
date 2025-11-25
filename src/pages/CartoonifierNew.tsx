import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Sparkles, Download, RefreshCw, Zap } from "lucide-react";
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
    <RoleGuard allowedRoles={["admin", "alpha", "beta", "delta"]}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                TEEFEEME CARTOONIFIER
              </h1>
              <Zap className="w-10 h-10 text-yellow-500 animate-bounce" />
            </div>
            <p className="text-muted-foreground font-mono text-lg">
              Transform your photos into epic cartoons
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-card/80 backdrop-blur-xl border-primary/20 shadow-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Original Image */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Original Image
                </h3>
                <div
                  className="relative aspect-square rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors bg-background/50 flex items-center justify-center overflow-hidden cursor-pointer group"
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
                      <Upload className="w-16 h-16 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
                      <p className="text-muted-foreground font-mono">
                        Click to upload image
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
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Cartoon Result
                </h3>
                <div className="relative aspect-square rounded-lg border-2 border-primary/30 bg-background/50 flex items-center justify-center overflow-hidden">
                  {cartoonImage ? (
                    <img
                      src={cartoonImage}
                      alt="Cartoon"
                      className="w-full h-full object-cover animate-fade-in"
                    />
                  ) : (
                    <div className="text-center space-y-3 p-6">
                      <Sparkles className="w-16 h-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground font-mono">
                        Your cartoon will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {processing && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span className="text-muted-foreground">Generating...</span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button
                onClick={generateCartoon}
                disabled={!originalImage || processing}
                size="lg"
                className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-white font-bold shadow-lg min-w-[200px]"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Cartoon
                  </>
                )}
              </Button>

              {cartoonImage && (
                <Button
                  onClick={downloadCartoon}
                  size="lg"
                  variant="outline"
                  className="border-primary/50 hover:bg-primary/10 font-bold min-w-[200px]"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
              )}

              {(originalImage || cartoonImage) && (
                <Button
                  onClick={reset}
                  size="lg"
                  variant="outline"
                  className="border-muted-foreground/50 hover:bg-muted font-bold"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </Card>

          {/* Info Footer */}
          <div className="text-center text-sm text-muted-foreground font-mono">
            <p>🎨 Powered by TLC AI Systems • Beta Testing Phase</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
