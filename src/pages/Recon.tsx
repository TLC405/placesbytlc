import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crosshair, Sparkles, ChevronRight, Wand2, MapPin } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";

export default function Recon() {
  const navigate = useNavigate();

  const primary = [
    {
      title: "Plan tonight in 30s",
      sub: "AI builds the full date — spots, order, vibe",
      icon: Wand2,
      cta: "Ask Cupid",
      onClick: () => navigate("/ai-recommender"),
      accent: true,
    },
    {
      title: "Browse real venues",
      sub: "Live OKC feed — restaurants, events, hidden gems",
      icon: MapPin,
      cta: "Open feed",
      onClick: () => navigate("/places"),
      accent: false,
    },
  ];

  const playbooks = [
    { emoji: "🔥", title: "Peak Window", sub: "She's dialed in — go bold" },
    { emoji: "🌙", title: "Low-Key Night", sub: "Cozy, steady, zero pressure" },
    { emoji: "🌱", title: "Fresh Adventure", sub: "Try something neither of you has" },
    { emoji: "🩸", title: "At-Home Reset", sub: "Comfort mode, done right" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        <header className="animate-in">
          <button onClick={() => navigate("/")} className="btn-ghost -ml-3 mb-3">
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="icon-premium">
              <Crosshair className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground">Date planner</p>
              <h1 className="text-display text-foreground leading-none">Dates</h1>
            </div>
          </div>
          <p className="text-body text-sm mt-3">
            AI-built plans and real venues — pick a vibe and stop overthinking it.
          </p>
        </header>

        {/* Primary actions */}
        <section className="animate-in-delay-1 space-y-3">
          {primary.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.title}
                onClick={m.onClick}
                className={`card-premium w-full flex items-center gap-4 text-left ${m.accent ? "border-primary/40" : ""}`}
              >
                <div className="icon-premium">
                  <Icon className={`w-6 h-6 ${m.accent ? "text-primary" : "text-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground">{m.title}</h3>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                  <span className={`text-[11px] font-bold tracking-wider uppercase mt-1.5 inline-flex items-center gap-1 ${m.accent ? "text-primary" : "text-foreground"}`}>
                    {m.cta} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* Playbooks */}
        <section className="animate-in-delay-2">
          <div className="section-header">
            <h2 className="section-title">Match her energy</h2>
            <button onClick={() => navigate("/her-cycle")} className="section-action">Cycle Sync →</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {playbooks.map((p) => (
              <button
                key={p.title}
                onClick={() => navigate("/her-cycle")}
                className="card-premium p-4 text-left"
              >
                <span className="text-2xl mb-2 block">{p.emoji}</span>
                <h3 className="text-sm font-bold text-foreground leading-tight">{p.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{p.sub}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Level up */}
        <section className="animate-in-delay-3">
          <div className="card-premium">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold tracking-wide uppercase text-foreground">Level up your game</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Two quick quizzes and Cupid gets 10× smarter about what fits your style.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate("/quiz/date-night-iq")} className="btn-secondary text-xs">Date Night IQ</button>
              <button onClick={() => navigate("/quiz/compatibility")} className="btn-secondary text-xs">Compatibility</button>
            </div>
          </div>
        </section>

        <PoweredByTLC />
      </div>
    </div>
  );
}
