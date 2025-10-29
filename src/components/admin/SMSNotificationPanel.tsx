import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const SMSNotificationPanel = () => {
  const [toPhone, setToPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendSMS = async () => {
    if (!toPhone || !message) {
      toast.error("Phone number and message are required");
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-admin-sms", {
        body: {
          toPhone: toPhone.trim(),
          message: message.trim(),
        },
      });

      if (error) throw error;

      toast.success("✅ SMS sent successfully!");
      setToPhone("");
      setMessage("");
    } catch (error: any) {
      console.error("SMS error:", error);
      toast.error(error.message || "Failed to send SMS");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black gradient-text">SMS Notifications</h2>
          <p className="text-sm text-muted-foreground">Send SMS from admin phone</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Recipient Phone Number
          </label>
          <Input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={toPhone}
            onChange={(e) => setToPhone(e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">Include country code (e.g., +1 for US)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="resize-none"
            maxLength={320}
          />
          <p className="text-xs text-muted-foreground text-right">
            {message.length}/320 characters
          </p>
        </div>

        <Button
          onClick={sendSMS}
          disabled={sending || !toPhone || !message}
          className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
        >
          <Send className="w-5 h-5" />
          {sending ? "Sending..." : "Send SMS"}
        </Button>
      </div>
    </Card>
  );
};
