import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, AlertTriangle, Laugh } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export const PeriodTrackerForGuys = () => {
  const [periodDate, setPeriodDate] = useState("");
  const [guyPhone, setGuyPhone] = useState("");
  const [guyName, setGuyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!periodDate || !guyPhone || !guyName) {
      toast.error("Fill out all fields so he doesn't mess up! 😅");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(`🎯 ${guyName} will get hilarious reminders! Check his phone in 3... 2... 1...`, {
        duration: 5000,
      });
      setIsLoading(false);
      
      // Store in localStorage for demo
      localStorage.setItem('periodTrackerSetup', JSON.stringify({
        date: periodDate,
        phone: guyPhone,
        name: guyName,
        setupDate: new Date().toISOString()
      }));
    }, 1500);
  };

  const funnyTips = [
    "He'll get a 3-day warning: 'Stock up on chocolate NOW'",
    "Day-of reminder: 'Whatever she says, just agree'",
    "Bonus tip text: 'Netflix, heating pad, and silence = survival'",
    "Emergency alert: 'She's NOT overreacting. You're underreacting.'",
  ];

  return (
    <Card className="shadow-soft border-2 border-rose/20 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-rose via-mauve to-rose animate-gradient" />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose to-mauve flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Period Tracker for Guys</CardTitle>
                <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                  BETA
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Because he <span className="italic">will</span> forget. Save him. Save yourself.
              </CardDescription>
            </div>
          </div>
          <Laugh className="w-8 h-8 text-rose/60" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Warning Alert */}
        <div className="flex items-start gap-3 p-4 bg-rose/5 border border-rose/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-rose mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Ladies: Set it and forget it
            </p>
            <p className="text-xs text-muted-foreground">
              Your man will get automated text reminders so he can actually be helpful for once. 
              Revolutionary concept, we know.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSetup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guyName" className="text-sm font-medium">
              His Name <span className="text-muted-foreground">(so texts are personal)</span>
            </Label>
            <Input
              id="guyName"
              type="text"
              placeholder="e.g., Marcus, Babe, That Guy"
              value={guyName}
              onChange={(e) => setGuyName(e.target.value)}
              className="h-12"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodDate" className="text-sm font-medium">
              Next Period Start Date
            </Label>
            <Input
              id="periodDate"
              type="date"
              value={periodDate}
              onChange={(e) => setPeriodDate(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guyPhone" className="text-sm font-medium">
              His Phone Number <span className="text-muted-foreground">(SMS reminders)</span>
            </Label>
            <Input
              id="guyPhone"
              type="tel"
              placeholder="(555) 123-4567"
              value={guyPhone}
              onChange={(e) => setGuyPhone(e.target.value)}
              className="h-12"
              maxLength={15}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-rose to-mauve hover:opacity-90 transition-all"
          >
            <MessageCircle className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Setting Up..." : "Activate His Survival Mode"}
          </Button>
        </form>

        {/* What He'll Get */}
        <div className="space-y-3 p-4 bg-gradient-to-br from-mauve/5 to-rose/5 rounded-xl border border-mauve/20">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-mauve" />
            <h4 className="text-sm font-semibold">What He'll Actually Receive:</h4>
          </div>
          <ul className="space-y-2">
            {funnyTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-rose mt-0.5">📱</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-center text-muted-foreground italic pt-2 border-t border-mauve/10">
            Texts sent via SMS at strategic times for maximum helpfulness (and minimum cluelessness)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
