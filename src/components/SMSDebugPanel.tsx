import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCheck, Eye, Skull, Lock } from "lucide-react";

interface SMSStatus {
  sending: boolean;
  sent: boolean;
  delivered: boolean;
  read: boolean;
}

interface SMSDebugPanelProps {
  placeName?: string;
  placeAddress?: string;
}

export const SMSDebugPanel = ({ placeName, placeAddress }: SMSDebugPanelProps) => {
  const [status, setStatus] = useState<SMSStatus>({
    sending: false,
    sent: false,
    delivered: false,
    read: false,
  });

  const handleSendSMS = async () => {
    if (!placeName || !placeAddress) return;

    const message = `Yo! Check out ${placeName} - ${placeAddress} - looks fire 🔥`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Start sending
    setStatus({ sending: true, sent: false, delivered: false, read: false });

    try {
      if (isMobile) {
        // Open SMS with pre-filled message
        window.location.href = `sms:?body=${encodeURIComponent(message)}`;
        
        // Simulate status progression (in real app, this would come from backend)
        setTimeout(() => setStatus(prev => ({ ...prev, sending: false, sent: true })), 1000);
        setTimeout(() => setStatus(prev => ({ ...prev, delivered: true })), 2500);
        setTimeout(() => setStatus(prev => ({ ...prev, read: true })), 5000);
      } else {
        // Copy to clipboard for desktop
        await navigator.clipboard.writeText(message);
        setStatus({ sending: false, sent: true, delivered: true, read: false });
      }
    } catch (error) {
      console.error("SMS send error:", error);
      setStatus({ sending: false, sent: false, delivered: false, read: false });
    }
  };

  const prankOptions = [
    { id: "spam", label: "Spam Mode (100 texts)", icon: Skull },
    { id: "autocorrect", label: "Autocorrect Chaos", icon: MessageCircle },
    { id: "emoji", label: "Emoji Overload 💀", icon: MessageCircle },
  ];

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-background to-muted/20">
      <div className="space-y-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          SMS Debug Panel
        </h3>
        <p className="text-sm text-muted-foreground">
          Track your message delivery status in real-time
        </p>
      </div>

      {/* Status Timeline */}
      <div className="space-y-3">
        <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
          status.sending ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status.sending ? "bg-primary animate-pulse" : status.sent ? "bg-green-500" : "bg-muted"
          }`}>
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Sending Text</div>
            <div className="text-xs text-muted-foreground">
              {status.sending ? "In progress..." : status.sent ? "Completed" : "Waiting"}
            </div>
          </div>
          {status.sent && <Badge variant="outline" className="bg-green-500/10 text-green-600">✓</Badge>}
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
          status.delivered ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status.delivered ? "bg-green-500" : "bg-muted"
          }`}>
            <CheckCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Text Received</div>
            <div className="text-xs text-muted-foreground">
              {status.delivered ? "Delivered to device" : "Pending"}
            </div>
          </div>
          {status.delivered && <Badge variant="outline" className="bg-green-500/10 text-green-600">✓</Badge>}
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
          status.read ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status.read ? "bg-green-500" : "bg-muted"
          }`}>
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Text Read</div>
            <div className="text-xs text-muted-foreground">
              {status.read ? "Message opened" : "Not yet read"}
            </div>
          </div>
          {status.read && <Badge variant="outline" className="bg-green-500/10 text-green-600">✓</Badge>}
        </div>
      </div>

      {/* Send Button */}
      <Button 
        onClick={handleSendSMS}
        disabled={status.sending || !placeName || !placeAddress}
        className="w-full"
        size="lg"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {status.sending ? "Sending..." : "Send to Homie"}
      </Button>

      {/* Future Pranks Section */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm text-muted-foreground">Future Pranks (Coming Soon)</h4>
        </div>
        <div className="space-y-2">
          {prankOptions.map((prank) => (
            <Button
              key={prank.id}
              variant="outline"
              className="w-full justify-start opacity-50 cursor-not-allowed"
              disabled
            >
              <prank.icon className="w-4 h-4 mr-2" />
              {prank.label}
              <Lock className="w-3 h-3 ml-auto" />
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">
          These features are locked and will be available in a future update 🔒
        </p>
      </div>
    </Card>
  );
};
