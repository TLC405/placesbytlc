import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  placeName: string;
  placeAddress: string;
  className?: string;
}

export const ShareButton = ({ placeName, placeAddress, className }: ShareButtonProps) => {
  const handleShare = () => {
    const message = `Yo! Check out ${placeName} - ${placeAddress} - looks fire 🔥`;
    
    // Check if on mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Open SMS with pre-filled message
      window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    } else {
      // Copy to clipboard for desktop
      navigator.clipboard.writeText(message).then(() => {
        toast.success("Message copied! Send it to your homie 💬");
      }).catch(() => {
        toast.error("Couldn't copy message");
      });
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
