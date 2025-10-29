import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  placeName: string;
  placeAddress: string;
  className?: string;
}

export const ShareButton = ({ placeName, placeAddress, className }: ShareButtonProps) => {
  const handleShare = async () => {
    try {
      const message = `Yo! Check out ${placeName} - ${placeAddress} - looks fire 🔥`;
      
      // Check if on mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Open SMS with pre-filled message
        const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
        window.location.href = smsUrl;
        toast.success("Opening messages app... 📱");
      } else {
        // Copy to clipboard for desktop
        if (!navigator.clipboard) {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = message;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success("Message copied! Send it to your homie 💬");
        } else {
          await navigator.clipboard.writeText(message);
          toast.success("Message copied! Send it to your homie 💬");
        }
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Couldn't share - try again or copy manually");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={`shadow-sm hover:shadow-md transition-all ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-1" />
      Send to Homie
    </Button>
  );
};
