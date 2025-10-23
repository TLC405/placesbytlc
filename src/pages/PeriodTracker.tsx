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

    // Validate phone number
    const phoneRegex = /^\+?1?\d{10,15}$/;
    const cleanPhone = guyPhone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to set up SMS notifications
      const { data, error } = await supabase.functions.invoke('period-tracker-setup', {
        body: {
          guyName,
          guyPhone: cleanPhone,
          periodDate,
          cycleLength: parseInt(cycleLength)
        }
      });

      if (error) throw error;

      // Store locally as well
      const setupData = {
        guy_name: guyName,
        guy_phone: cleanPhone,
        period_date: periodDate,
        cycle_length: parseInt(cycleLength),
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('periodTrackerSetup', JSON.stringify(setupData));
      setExistingSetup(setupData);

      toast.success(`🎯 ${guyName} will get survival reminders via SMS!`, {
        duration: 5000,
      });
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
      <div className="text-center space-y-3 py-8">
        <div className="flex items-center justify-center gap-3">
          <Calendar className="w-10 h-10 text-rose" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose to-mauve bg-clip-text text-transparent">
            Period Tracker for Guys
          </h1>
          <Laugh className="w-10 h-10 text-mauve" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Because he <span className="italic font-semibold">will</span> forget. Save him. Save yourself. Get real SMS reminders.
        </p>
        <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30 text-sm px-4 py-1">
          BETA • Real SMS Notifications
        </Badge>
      </div>

      {/* Main Card */}
      <Card className="shadow-soft border-2 border-rose/20 overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-rose via-mauve to-rose animate-gradient" />
        
        <CardHeader className="space-y-4">
          {/* Warning Alert */}
          <div className="flex items-start gap-3 p-4 bg-rose/5 border border-rose/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-rose mt-0.5 flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Ladies: Set it and forget it
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your man will get automated SMS reminders sent directly to his phone at strategic times. 
                He'll be prepared with chocolate, empathy, and zero dumb questions. Revolutionary, we know.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Existing Setup Display */}
          {existingSetup && (
            <div className="p-5 bg-gradient-to-br from-mint/10 to-mint/5 border-2 border-mint/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-mint" />
                  <span className="font-semibold text-foreground">Active Tracker</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-rose hover:text-rose hover:bg-rose/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">His Name</p>
                  <p className="font-semibold">{existingSetup.guy_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-semibold">{existingSetup.guy_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Period</p>
                  <p className="font-semibold">{new Date(existingSetup.period_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cycle Length</p>
                  <p className="font-semibold">{existingSetup.cycle_length} days</p>
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
                  placeholder="+1 (555) 123-4567"
                  value={guyPhone}
                  onChange={(e) => setGuyPhone(e.target.value)}
                  className="h-12 text-base"
                  maxLength={20}
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-rose to-mauve hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Setting Up SMS..." : existingSetup ? "Update Tracker" : "Activate Survival Mode"}
            </Button>
          </form>

          {/* What He'll Get */}
          <div className="space-y-4 p-5 bg-gradient-to-br from-mauve/5 to-rose/5 rounded-xl border-2 border-mauve/20">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-mauve" />
              <h4 className="text-base font-bold text-foreground">Real SMS Alerts He'll Receive:</h4>
            </div>
            <ul className="space-y-3">
              {funnyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                  <span className="leading-relaxed pt-1">{tip.text}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3 mt-3 border-t border-mauve/10">
              <p className="text-xs text-center text-muted-foreground italic">
                Messages sent automatically 3 days before, 1 day before, and on the day of expected period start
              </p>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-4 bg-background/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong>Privacy Note:</strong> Phone numbers are used only for SMS reminders. 
              We use Twilio for secure message delivery. Standard SMS rates may apply.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
