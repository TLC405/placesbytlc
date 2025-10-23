import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, AlertTriangle, Laugh, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface TrackerSetup {
  id?: string;
  guy_name: string;
  guy_phone: string;
  period_date: string;
  cycle_length: number;
  created_at?: string;
}

export default function PeriodTracker() {
  const [periodDate, setPeriodDate] = useState("");
  const [guyPhone, setGuyPhone] = useState("");
  const [guyName, setGuyName] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [isLoading, setIsLoading] = useState(false);
  const [existingSetup, setExistingSetup] = useState<TrackerSetup | null>(null);
  const [spamMode, setSpamMode] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [pin, setPin] = useState("");
  const [showPinVerification, setShowPinVerification] = useState(false);

  useEffect(() => {
    loadExistingSetup();
  }, []);

  const loadExistingSetup = async () => {
    const stored = localStorage.getItem('periodTrackerSetup');
    if (stored) {
      const data = JSON.parse(stored);
      setExistingSetup(data);
      setGuyName(data.guy_name);
      setGuyPhone(data.guy_phone);
      setPeriodDate(data.period_date);
      setCycleLength(data.cycle_length?.toString() || "28");
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!periodDate || !guyPhone || !guyName) {
      toast.error("Fill out all fields so he doesn't mess up! 😅");
      return;
    }

    // Show PIN verification
    setShowPinVerification(true);
  };

  const handlePinSubmit = async () => {
    if (pin !== "666") {
      toast.error("Wrong PIN! Try again 😈");
      setPin("");
      return;
    }

    // Clean phone number - handle US numbers with or without +1
    let cleanPhone = guyPhone.replace(/\D/g, '');
    
    // If it's a 10-digit US number, add the country code
    if (cleanPhone.length === 10) {
      cleanPhone = '1' + cleanPhone;
    }
    
    // Validate phone number (should be 11 digits for US with country code)
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('1')) {
      toast.error("Please enter a valid 10-digit US phone number");
      return;
    }

    setIsLoading(true);
    setShowPinVerification(false);

    try {
      // Call edge function to set up SMS notifications
      const { data, error } = await supabase.functions.invoke('period-tracker-setup', {
        body: {
          guyName,
          guyPhone: '+' + cleanPhone, // Add + prefix for international format
          periodDate,
          cycleLength: parseInt(cycleLength),
          spamMode,
          dryRun
        }
      });

      if (error) throw error;

      // Store locally as well
      const setupData = {
        guy_name: guyName,
        guy_phone: '+' + cleanPhone,
        period_date: periodDate,
        cycle_length: parseInt(cycleLength),
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('periodTrackerSetup', JSON.stringify(setupData));
      setExistingSetup(setupData);

      if (dryRun) {
        toast.success(`🧪 Test successful. No SMS sent.`, {
          duration: 4000,
        });
      } else if (spamMode) {
        toast.success(`😈 ${guyName}'s phone is getting BLOWN UP! Revenge complete!`, {
          duration: 5000,
        });
      } else {
        toast.success(`🎯 ${guyName} will get survival texts! He'll thank you later 💝`, {
          duration: 5000,
        });
      }

      // Reset form
      setPin("");
      setSpamMode(false);
    } catch (error: any) {
      console.error('Period tracker setup error:', error);
      toast.error(error.message || "Failed to set up tracker. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    localStorage.removeItem('periodTrackerSetup');
    setExistingSetup(null);
    setGuyName("");
    setGuyPhone("");
    setPeriodDate("");
    setCycleLength("28");
    setPin("");
    setSpamMode(false);
    toast.success("Period tracker cleared!");
  };

  const funnyTips = [
    { emoji: "⏰", text: "3-day warning: 'Stock up on chocolate & heating pads NOW'" },
    { emoji: "🚨", text: "Day-before alert: 'Whatever she says tomorrow, just agree'" },
    { emoji: "💡", text: "Day-of reminder: 'Netflix, snacks, and silence = survival mode'" },
    { emoji: "🛡️", text: "Emergency tip: 'She's NOT overreacting. You're underreacting.'" },
    { emoji: "🎯", text: "Pro move: 'Flowers solve 90% of problems you didn't know existed'" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-10">
        <div className="flex items-center justify-center gap-4">
          <Calendar className="w-12 h-12 text-primary animate-pulse-subtle" />
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Peripod Tracker for Him
          </h1>
          <Laugh className="w-12 h-12 text-accent animate-pulse-subtle" />
        </div>
        <p className="text-xl md:text-2xl font-medium text-foreground max-w-3xl mx-auto leading-relaxed">
          Because he <span className="italic font-black text-primary">will</span> forget. Save him. Save yourself.
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Send real SMS survival alerts straight to his phone. Revolutionary concept, we know. 😏
        </p>
        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-base px-6 py-2 font-bold">
          BETA • Real SMS Notifications
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="shadow-glow border-2 border-primary/30 overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_100%]" />
        
        <CardHeader className="space-y-4">
          {/* Warning Alert */}
          <div className="flex items-start gap-3 p-5 bg-primary/5 border-2 border-primary/20 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="text-base font-bold text-foreground">
                Ladies: Set it and forget it 💅
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                Your man will get automated SMS reminders sent directly to his phone at strategic times. 
                He'll be prepared with chocolate, empathy, and zero dumb questions. Revolutionary, we know. 🎯
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Existing Setup Display */}
          {existingSetup && (
            <div className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-6 h-6 text-success" />
                  <span className="font-bold text-lg text-foreground">Active Tracker 🎉</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium">His Name</p>
                  <p className="font-bold text-base">{existingSetup.guy_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Phone</p>
                  <p className="font-bold text-base">{existingSetup.guy_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Next Period</p>
                  <p className="font-bold text-base">{new Date(existingSetup.period_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Cycle Length</p>
                  <p className="font-bold text-base">{existingSetup.cycle_length} days</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSetup} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guyName" className="text-sm font-semibold">
                  His Name
                </Label>
                <Input
                  id="guyName"
                  type="text"
                  placeholder="e.g., Marcus, Babe, Chad"
                  value={guyName}
                  onChange={(e) => setGuyName(e.target.value)}
                  className="h-12 text-base"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guyPhone" className="text-sm font-semibold">
                  His Phone Number <span className="text-rose">*</span>
                </Label>
                <Input
                  id="guyPhone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={guyPhone}
                  onChange={(e) => setGuyPhone(e.target.value)}
                  className="h-12 text-base"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodDate" className="text-sm font-semibold">
                  Next Period Start Date <span className="text-rose">*</span>
                </Label>
                <Input
                  id="periodDate"
                  type="date"
                  value={periodDate}
                  onChange={(e) => setPeriodDate(e.target.value)}
                  className="h-12 text-base"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycleLength" className="text-sm font-semibold">
                  Cycle Length (days)
                </Label>
                <Input
                  id="cycleLength"
                  type="number"
                  placeholder="28"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="h-12 text-base"
                  min="21"
                  max="35"
                />
              </div>
            </div>

            {/* Spam Mode Toggle */}
            <div className="p-5 bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/30 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="spamMode"
                  checked={spamMode}
                  onChange={(e) => setSpamMode(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-destructive/30 text-destructive focus:ring-destructive"
                />
                <div className="space-y-1">
                  <Label htmlFor="spamMode" className="text-base font-bold text-foreground cursor-pointer">
                    😈 Revenge Mode: Auto-Spam His Phone
                  </Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Check this to AUTOMATICALLY send him a TEXT EVERY 10 SECONDS for 5 minutes. 30 messages total. 
                    Use when he <span className="italic font-bold">really</span> deserves it. 💣
                  </p>
                </div>
              </div>
            </div>

            {/* PIN Verification Dialog */}
            {showPinVerification && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-card border-2 border-primary rounded-2xl p-8 max-w-md w-full space-y-6 animate-in zoom-in shadow-2xl">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Enter Secret PIN</h3>
                    <p className="text-sm text-muted-foreground">
                      {spamMode ? "You're about to unleash CHAOS 😈" : "Confirm you want to send survival alerts 🎯"}
                    </p>
                  </div>
                  
                  <Input
                    type="password"
                    placeholder="Enter PIN (3 digits)"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.slice(0, 3))}
                    onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                    className="h-16 text-center text-2xl font-bold tracking-widest"
                    maxLength={3}
                    autoFocus
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPinVerification(false);
                        setPin("");
                      }}
                      className="flex-1 h-12 font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePinSubmit}
                      disabled={pin.length !== 3}
                      className="flex-1 h-12 font-bold bg-gradient-to-r from-primary to-accent"
                    >
                      {spamMode ? "💣 UNLEASH" : "📱 Send It"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-glow hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle className={`w-6 h-6 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Sending SMS..." : spamMode ? "😈 Auto-Spam Mode" : "💝 Thank TLC Later (Send to Your Boo)"}
            </Button>
          </form>

          {/* What He'll Get */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl border-2 border-accent/30">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-accent" />
              <h4 className="text-lg font-bold text-foreground">Real SMS Alerts He'll Receive:</h4>
            </div>
            <ul className="space-y-4">
              {funnyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-4 text-base text-foreground">
                  <span className="text-3xl flex-shrink-0">{tip.emoji}</span>
                  <span className="leading-relaxed pt-1 font-medium">{tip.text}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 mt-4 border-t-2 border-accent/20">
              <p className="text-sm text-center text-muted-foreground italic font-medium">
                📱 Messages sent automatically 3 days before, 1 day before, and on the day of expected start
              </p>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-5 bg-muted/50 rounded-xl border-2 border-border">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground">🔒 Privacy Note:</strong> Phone numbers are used only for SMS reminders. 
              We use Twilio for secure message delivery. Standard SMS rates may apply. Your data is never shared.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
