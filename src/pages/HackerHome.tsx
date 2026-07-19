import { useNavigate } from "react-router-dom";
import { Crosshair, Brain, Droplets, ChevronRight, Flame, Crown, Sparkles, TrendingUp } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { AppLogo } from "@/components/AppLogo";

export default function HackerHome() {
  const navigate = useNavigate();

  const pillars = [
    { id: "psych", title: "Know Yourself", sub: "The work starts inside", icon: Brain, path: "/quizzes", tag: "Mindset" },
    { id: "recon", title: "Plan the Date", sub: "AI-built plans, real venues", icon: Crosshair, path: "/recon", tag: "Tonight" },
    { id: "cycle", title: "Read the Room", sub: "Sync with her cycle, not against it", icon: Droplets, path: "/her-cycle", tag: "Cycle IQ" },
  ];

  const quickQuizzes = [
    { id: "arch", title: "Masculine Archetype", sub: "King · Warrior · Magician · Lover", icon: Crown, path: "/quiz/masculine-archetype" },
    { id: "conf", title: "Confidence Index", sub: "Your real number — no fluff", icon: Flame, path: "/quiz/dating-confidence" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-8">
        <header className="animate-in">
          <AppLogo />
        </header>

        {/* Stat strip */}
        <section className="animate-in-delay-1 grid grid-cols-3 gap-2">
          {[
            { n: "5", l: "Quizzes" },
            { n: "4", l: "Phases" },
            { n: "∞", l: "Date ideas" },
          ].map((s) => (
            <div key={s.l} className="card-premium p-3 text-center">
              <p className="text-2xl font-black text-foreground leading-none">{s.n}</p>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </section>

        {/* Pillars */}
        <section className="animate-in-delay-1 space-y-3">
          <div className="section-header">
            <h2 className="section-title">The three pillars</h2>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Start here</span>
          </div>
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.id} onClick={() => navigate(p.path)} className="card-premium w-full flex items-center gap-4 text-left group">
                <div className="icon-premium">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                    <span className="chip-primary text-[9px] py-0.5 px-1.5">{p.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            );
          })}
        </section>

        {/* Quick quizzes */}
        <section className="animate-in-delay-2">
          <div className="section-header">
            <h2 className="section-title">Take a quiz</h2>
            <button onClick={() => navigate("/quizzes")} className="section-action">See all →</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickQuizzes.map((q) => {
              const Icon = q.icon;
              return (
                <button key={q.id} onClick={() => navigate(q.path)} className="card-premium p-4 text-left">
                  <div className="icon-premium w-11 h-11 mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-tight">{q.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{q.sub}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="animate-in-delay-3">
          <div className="card-premium relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Tonight's play</p>
              </div>
              <h3 className="text-headline text-foreground mb-2">Check her phase before you plan.</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                One tap tells you the vibe, the do's, the don'ts, and three date moves that actually fit tonight.
              </p>
              <button onClick={() => navigate("/her-cycle")} className="btn-primary">
                <Sparkles className="w-4 h-4" /> Open Cycle Sync
              </button>
            </div>
          </div>
        </section>

        <PoweredByTLC />
      </div>
    </div>
  );
}
