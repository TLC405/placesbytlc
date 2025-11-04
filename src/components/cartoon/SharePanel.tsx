import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type WatermarkMode = "none" | "brand" | "custom";

interface SharePanelProps {
  cartoonImage: string;
  watermarkMode: WatermarkMode;
  customWatermark: string;
  onWatermarkModeChange: (mode: WatermarkMode) => void;
  onCustomWatermarkChange: (text: string) => void;
}

export function SharePanel({
  cartoonImage,
  watermarkMode,
  customWatermark,
  onWatermarkModeChange,
  onCustomWatermarkChange,
}: SharePanelProps) {
  const shareToTwitter = () => {
    const text = "Check out my TeeFeeMe cartoon! 🎨🍄";
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    toast.success("Sharing to Twitter!");
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    toast.success("Sharing to Facebook!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share & Watermark
      </h3>

      <div className="space-y-3">
        <Label className="text-sm">Watermark Options</Label>
        <RadioGroup value={watermarkMode} onValueChange={(v) => onWatermarkModeChange(v as WatermarkMode)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="wm-none" />
            <Label htmlFor="wm-none" className="font-normal cursor-pointer">None (Clean)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="brand" id="wm-brand" />
            <Label htmlFor="wm-brand" className="font-normal cursor-pointer">Made with TeeFeeMe 🍄</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="wm-custom" />
            <Label htmlFor="wm-custom" className="font-normal cursor-pointer">Custom Text</Label>
          </div>
        </RadioGroup>

        {watermarkMode === "custom" && (
          <Input
            placeholder="Enter custom watermark..."
            value={customWatermark}
            onChange={(e) => onCustomWatermarkChange(e.target.value)}
            maxLength={50}
          />
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={shareToTwitter} size="sm" variant="outline" className="flex-1">
          🐦 Twitter
        </Button>
        <Button onClick={shareToFacebook} size="sm" variant="outline" className="flex-1">
          📘 Facebook
        </Button>
        <Button onClick={copyLink} size="sm" variant="outline" className="flex-1">
          🔗 Copy Link
        </Button>
      </div>
    </Card>
  );
}
