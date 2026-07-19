import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, Calendar, MessageSquare, Gift, ShieldCheck, Ban, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { phaseIntel, getPhaseFromDay, type CyclePhase } from "@/data/cyclePhaseIntel";

interface CycleData {
  lastPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
  herName: string;
}

const DEFAULT: CycleData = {
  lastPeriodStart: null,
  cycleLength: 28,
  periodLength: 5,
  herName: "Her",
};

const STORAGE_KEY = "deeper_cycle_v1";

export default function HerCycle() {
  const navigate = useNavigate();
  const [data, setData] = useState<CycleData>(DEFAULT);
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setData({ ...DEFAULT, ...JSON.parse(saved) }); } catch {}
    } else {
      // migrate from old key
      const legacy = localStorage.getItem("period_tracker_data");
      if (legacy) {
        try { setData({ ...DEFAULT, ...JSON.parse(legacy) }); } catch {}
      }
    }
  }, []);

  const save = (next: CycleData) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const today = useMemo(() => {
    if (!data.lastPeriodStart) return null;
    const start = new Date(data.lastPeriodStart);
    const days = Math.floor((Date.now() - start.getTime()) / 86400000);
    return ((days % data.cycleLength) + data.cycleLength) % data.cycleLength;
  }, [data]);

  const phase: CyclePhase | null = today === null ? null : getPhaseFromDay(today, data.cycleLength, data.periodLength);
  const intel = phase ? phaseIntel[phase] : null;

  const nextPeriodDate = useMemo(() => {
    if (!data.lastPeriodStart || today === null) return null;
    const start = new Date(data.lastPeriodStart);
    const next = new Date(start.getTime() + data.cycleLength * 86400000);
    while (next.getTime() < Date.now()) next.setDate(next.getDate() + data.cycleLength);
    return next;
  }, [data, today]);

  const daysUntilNext = nextPeriodDate ? Math.ceil((nextPeriodDate.getTime() - Date.now()) / 86400000) : null;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // Build 28-day forecast
  const forecast = useMemo(() => {
    if (today === null) return [];
    const days: { offset: number; date: Date; phase: CyclePhase; intel: typeof phaseIntel[CyclePhase] }[] = [];
    for (let i = 0; i < 28; i++) {
      const dayInCycle = (today + i) % data.cycleLength;
      const p = getPhaseFromDay(dayInCycle, data.cycleLength, data.periodLength);
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({ offset: i, date, phase: p, intel: phaseIntel[p] });
    }
    return days;
  }, [today, data]);

  const logToday = () => {
    save({ ...data, lastPeriodStart: new Date().toISOString().split("T")[0] });
    toast.success("Day 1 saved — you're synced.");
  };

  const reset = () => {
    if (confirm("Reset all cycle data?")) {
      localStorage.removeItem(STORAGE_KEY);
      setData(DEFAULT);
      toast.success("Reset complete");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        {/* Header */}
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="icon-premium" style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--secondary)/0.15))" }}>
              <Droplets className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground">Cycle sync</p>
              <h1 className="text-display text-foreground leading-none">Sync</h1>
            </div>
          </div>
          <p className="text-body text-sm mt-3">
            Where she's at, what to say, and what actually lands — without guessing.
          </p>
        </header>

        {/* Setup */}
        {!data.lastPeriodStart ? (
          <section className="animate-in-delay-1">
            <div className="card-premium text-center py-8">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-headline text-foreground mb-2">Set Day 1</h3>
              <p className="text-body text-sm mb-6 max-w-xs mx-auto">
                Pick the day her period started. We handle the rest.
              </p>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => save({ ...data, lastPeriodStart: e.target.value })}
                className="block w-full max-w-xs mx-auto px-4 py-3 rounded-xl border border-border bg-input text-foreground mb-3"
              />
              <button onClick={logToday} className="btn-primary">
                <Droplets className="w-4 h-4" /> Use Today
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Today Intel */}
            {intel && (
              <section className="animate-in-delay-1">
                <div
                  className="rounded-2xl p-6 relative overflow-hidden border-2"
                  style={{
                    background: `linear-gradient(135deg, ${intel.hex}15, hsl(var(--card)))`,
                    borderColor: `${intel.hex}40`,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: intel.hex }}>
                        Today — Day {today! + 1} / {data.cycleLength}
                      </p>
                      <h2 className="text-3xl font-black tracking-tight text-foreground mt-1">
                        {intel.emoji} {intel.codename}
                      </h2>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">
                        {phaseIntel[phase!].key.charAt(0) + phaseIntel[phase!].key.slice(1).toLowerCase()} phase
                      </p>
                    </div>
                    {daysUntilNext !== null && (
                      <div className="text-right">
                        <p className="text-3xl font-black" style={{ color: intel.hex }}>{daysUntilNext}</p>
                        <p className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
                          days to next
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-base font-semibold text-foreground leading-snug">{intel.oneLiner}</p>
                  <p className="text-sm text-muted-foreground mt-2">{intel.vibe}</p>
                </div>
              </section>
            )}

            {/* DO / DON'T */}
            {intel && (
              <section className="animate-in-delay-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="card-premium">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">Do</h3>
                  </div>
                  <ul className="space-y-2">
                    {intel.do.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary font-bold mt-0.5">+</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-premium">
                  <div className="flex items-center gap-2 mb-3">
                    <Ban className="w-4 h-4 text-secondary" />
                    <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">Don't</h3>
                  </div>
                  <ul className="space-y-2">
                    {intel.dont.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-secondary font-bold mt-0.5">−</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* What's going on with her */}
            {intel && (
              <section className="animate-in-delay-2">
                <div className="card-premium">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">What's going on with her</h3>
                  </div>
                  <ul className="space-y-2">
                    {intel.her.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Date moves */}
            {intel && (
              <section className="animate-in-delay-2">
                <div className="section-header">
                  <h2 className="section-title">Date moves that fit tonight</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {intel.dateMoves.map((m, i) => (
                    <div key={i} className="card-premium p-4">
                      <p className="text-sm font-medium text-foreground leading-snug">{m}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Texts + Gifts */}
            {intel && (
              <section className="animate-in-delay-3 grid grid-cols-1 gap-3">
                <div className="card-premium">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">Texts that land</h3>
                  </div>
                  <div className="space-y-2">
                    {intel.texts.map((t, i) => (
                      <div key={i} className="px-3 py-2.5 rounded-xl bg-muted text-sm text-foreground italic">
                        "{t}"
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-premium">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-secondary" />
                    <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">Gift ideas</h3>
                  </div>
                  <ul className="space-y-2">
                    {intel.giftIdeas.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-secondary font-bold mt-0.5">→</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* 28-day forecast */}
            <section className="animate-in-delay-3">
              <div className="section-header">
                <h2 className="section-title">Next 28 days</h2>
                <span className="text-[10px] text-muted-foreground">Tap for details</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {forecast.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => toast(`${d.intel.emoji} ${d.intel.codename} — ${fmt(d.date)}`, { description: d.intel.oneLiner })}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: i === 0 ? d.intel.hex : `${d.intel.hex}25`,
                      color: i === 0 ? "white" : d.intel.hex,
                      border: i === 0 ? `2px solid ${d.intel.hex}` : "none",
                    }}
                  >
                    <span className="text-base leading-none">{d.intel.emoji}</span>
                    <span className="leading-none mt-0.5">{d.date.getDate()}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-muted-foreground">
                {(["MENSTRUAL", "FOLLICULAR", "OVULATION", "LUTEAL"] as CyclePhase[]).map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: phaseIntel[p].hex }} />
                    {phaseIntel[p].codename}
                  </span>
                ))}
              </div>
            </section>

            {/* Settings */}
            <section className="animate-in-delay-3">
              <div className="section-header">
                <h2 className="section-title">Settings</h2>
                <button onClick={reset} className="text-[10px] text-secondary font-bold tracking-widest uppercase">
                  Reset
                </button>
              </div>
              <div className="card-premium space-y-4">
                <Stepper label="Cycle length" sub="Avg days between periods" value={data.cycleLength} min={21} max={35} onChange={(v) => save({ ...data, cycleLength: v })} />
                <div className="border-t border-border" />
                <Stepper label="Period length" sub="Avg duration of period" value={data.periodLength} min={3} max={8} onChange={(v) => save({ ...data, periodLength: v })} />
                <div className="border-t border-border pt-4">
                  <button onClick={logToday} className="btn-secondary w-full">
                    <RotateCcw className="w-4 h-4" /> Log a new Day 1 (today)
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground text-center">
                  Stored on this device only. Nothing leaves your phone.
                </p>
              </div>
            </section>
          </>
        )}

        <PoweredByTLC />
      </div>
    </div>
  );
}

function Stepper({ label, sub, value, min, max, onChange }: { label: string; sub: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold">−</button>
        <span className="w-12 text-center font-bold text-foreground">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold">+</button>
      </div>
    </div>
  );
}
