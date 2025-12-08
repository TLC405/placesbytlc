import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Heart, Bell, TrendingUp, Droplets, Moon, Sun, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

interface CycleData {
  lastPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
  notifications: boolean;
}

const DEFAULT_DATA: CycleData = {
  lastPeriodStart: null,
  cycleLength: 28,
  periodLength: 5,
  notifications: true,
};

export default function PeriodTracker() {
  const navigate = useNavigate();
  const [data, setData] = useState<CycleData>(DEFAULT_DATA);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("period_tracker_data");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const saveData = (newData: CycleData) => {
    setData(newData);
    localStorage.setItem("period_tracker_data", JSON.stringify(newData));
    toast.success("Saved!");
  };

  const getDaysSince = () => {
    if (!data.lastPeriodStart) return null;
    const start = new Date(data.lastPeriodStart);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getNextPeriod = () => {
    if (!data.lastPeriodStart) return null;
    const start = new Date(data.lastPeriodStart);
    const next = new Date(start.getTime() + data.cycleLength * 24 * 60 * 60 * 1000);
    return next;
  };

  const getFertileWindow = () => {
    if (!data.lastPeriodStart) return null;
    const start = new Date(data.lastPeriodStart);
    // Ovulation typically occurs 14 days before next period
    const ovulation = new Date(start.getTime() + (data.cycleLength - 14) * 24 * 60 * 60 * 1000);
    const fertileStart = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000);
    const fertileEnd = new Date(ovulation.getTime() + 1 * 24 * 60 * 60 * 1000);
    return { start: fertileStart, end: fertileEnd, ovulation };
  };

  const getCurrentPhase = () => {
    const daysSince = getDaysSince();
    if (daysSince === null) return null;

    if (daysSince < data.periodLength) {
      return { name: "Menstrual", emoji: "🌙", color: "text-rose-500", desc: "Period days - rest and self-care" };
    } else if (daysSince < data.cycleLength - 14 - 5) {
      return { name: "Follicular", emoji: "🌱", color: "text-emerald-500", desc: "Energy rising - great for new activities" };
    } else if (daysSince < data.cycleLength - 14 + 1) {
      return { name: "Ovulation", emoji: "✨", color: "text-amber-500", desc: "Peak energy - social and creative time" };
    } else {
      return { name: "Luteal", emoji: "🍂", color: "text-orange-500", desc: "Winding down - cozy dates preferred" };
    }
  };

  const daysSince = getDaysSince();
  const nextPeriod = getNextPeriod();
  const fertileWindow = getFertileWindow();
  const currentPhase = getCurrentPhase();
  const daysUntilNext = nextPeriod ? Math.max(0, Math.ceil((nextPeriod.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const logPeriod = () => {
    const today = new Date().toISOString().split("T")[0];
    saveData({ ...data, lastPeriodStart: today });
    setShowDatePicker(false);
  };

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        {/* Header */}
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <Droplets className="w-7 h-7 text-rose-500" />
            </div>
            <div>
              <h1 className="text-headline text-foreground">Cycle Tracker</h1>
              <p className="text-sm text-muted-foreground">Understand her rhythm</p>
            </div>
          </div>
        </header>

        {/* Current Phase Card */}
        {currentPhase && (
          <section className="animate-in-delay-1">
            <div className="card-highlight">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentPhase.emoji}</span>
                  <div>
                    <h3 className={`font-semibold ${currentPhase.color}`}>{currentPhase.name} Phase</h3>
                    <p className="text-xs text-muted-foreground">Day {daysSince! + 1} of cycle</p>
                  </div>
                </div>
                {daysUntilNext !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{daysUntilNext}</p>
                    <p className="text-caption">days left</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-foreground">{currentPhase.desc}</p>
            </div>
          </section>
        )}

        {/* Quick Log Button */}
        {!data.lastPeriodStart && (
          <section className="animate-in-delay-1">
            <div className="card-luxury text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-headline text-foreground mb-2">Start Tracking</h3>
              <p className="text-body text-sm mb-5">Log the first day of her last period to begin</p>
              <button onClick={logPeriod} className="btn-primary">
                <Droplets className="w-4 h-4" />
                Log Period Start
              </button>
            </div>
          </section>
        )}

        {/* Stats Grid */}
        {data.lastPeriodStart && (
          <section className="animate-in-delay-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="card-luxury text-center py-4">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">
                  {nextPeriod ? formatDate(nextPeriod) : "—"}
                </p>
                <p className="text-caption">Next Period</p>
              </div>
              <div className="card-luxury text-center py-4">
                <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">{data.cycleLength} days</p>
                <p className="text-caption">Cycle Length</p>
              </div>
            </div>
          </section>
        )}

        {/* Fertile Window */}
        {fertileWindow && (
          <section className="animate-in-delay-2">
            <div className="section-header">
              <h2 className="section-title">Fertile Window</h2>
            </div>
            <div className="card-luxury">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {formatDate(fertileWindow.start)} – {formatDate(fertileWindow.end)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ovulation around {formatDate(fertileWindow.ovulation)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Date Ideas by Phase */}
        {currentPhase && (
          <section className="animate-in-delay-2">
            <div className="section-header">
              <h2 className="section-title">Date Ideas for This Phase</h2>
            </div>
            <div className="space-y-2">
              {getDateIdeas(currentPhase.name).map((idea, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon bg-muted">
                    <span className="text-lg">{idea.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{idea.title}</h3>
                    <p className="text-xs text-muted-foreground">{idea.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Settings */}
        <section className="animate-in-delay-3">
          <div className="section-header">
            <h2 className="section-title">Settings</h2>
          </div>
          <div className="card-luxury space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Cycle Length</p>
                <p className="text-xs text-muted-foreground">Average days between periods</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => saveData({ ...data, cycleLength: Math.max(21, data.cycleLength - 1) })}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground"
                >
                  −
                </button>
                <span className="w-10 text-center font-semibold text-foreground">{data.cycleLength}</span>
                <button
                  onClick={() => saveData({ ...data, cycleLength: Math.min(35, data.cycleLength + 1) })}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Period Length</p>
                <p className="text-xs text-muted-foreground">Average period duration</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => saveData({ ...data, periodLength: Math.max(3, data.periodLength - 1) })}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground"
                >
                  −
                </button>
                <span className="w-10 text-center font-semibold text-foreground">{data.periodLength}</span>
                <button
                  onClick={() => saveData({ ...data, periodLength: Math.min(8, data.periodLength + 1) })}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground"
                >
                  +
                </button>
              </div>
            </div>

            {data.lastPeriodStart && (
              <div className="border-t border-border pt-4">
                <button
                  onClick={logPeriod}
                  className="btn-secondary w-full"
                >
                  <Droplets className="w-4 h-4" />
                  Log New Period Start (Today)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Info Card */}
        <section className="animate-in-delay-3">
          <div className="card-highlight text-center py-5">
            <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Why Track?</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Understanding her cycle helps you plan better dates and be more supportive during different phases.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function getDateIdeas(phase: string) {
  switch (phase) {
    case "Menstrual":
      return [
        { emoji: "🎬", title: "Movie Night In", desc: "Cozy blankets and comfort films" },
        { emoji: "🍫", title: "Comfort Food Date", desc: "Her favorite treats and snacks" },
        { emoji: "💆", title: "Spa Night", desc: "Relaxing baths and massages" },
      ];
    case "Follicular":
      return [
        { emoji: "🚴", title: "Active Adventure", desc: "Hiking, biking, or exploring" },
        { emoji: "🎨", title: "Creative Class", desc: "Pottery, painting, or cooking" },
        { emoji: "🌮", title: "Try Something New", desc: "New restaurant or cuisine" },
      ];
    case "Ovulation":
      return [
        { emoji: "💃", title: "Dancing", desc: "Hit the dance floor together" },
        { emoji: "🍷", title: "Romantic Dinner", desc: "Dress up for a fancy night" },
        { emoji: "🎉", title: "Social Event", desc: "Party or group activity" },
      ];
    case "Luteal":
      return [
        { emoji: "☕", title: "Café Hangout", desc: "Cozy coffee and conversation" },
        { emoji: "📚", title: "Bookstore Date", desc: "Browse and read together" },
        { emoji: "🌅", title: "Sunset Walk", desc: "Peaceful outdoor stroll" },
      ];
    default:
      return [];
  }
}