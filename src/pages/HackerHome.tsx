import { useNavigate } from "react-router-dom";
import { Crosshair, Brain, Droplets, ChevronRight, Flame, Crown } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { AppLogo } from "@/components/AppLogo";

export default function HackerHome() {
  const navigate = useNavigate();

  const pillars = [
    { id: "psych", title: "Self Recon", sub: "Know yourself first", icon: Brain, path: "/quizzes" },
    { id: "recon", title: "Date Recon", sub: "Plan tonight's mission", icon: Crosshair, path: "/recon" },
    { id: "cycle", title: "Her Cycle", sub: "Decode her phase", icon: Droplets, path: "/her-cycle" },
  ];

  const quickQuizzes = [
    { id: "arch", title: "Masculine Archetype", icon: Crown, path: "/quiz/masculine-archetype" },
    { id: "conf", title: "Dating Confidence", icon: Flame, path: "/quiz/dating-confidence" },
  ];

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        <header className="animate-in">
          <AppLogo />
          <p className="text-center text-sm text-muted-foreground -mt-2 mb-2 italic">
            Understand yourself. Decode her. Date deeper.
          </p>
        </header>

        <section className="animate-in-delay-1 space-y-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.id} onClick={() => navigate(p.path)} className="card-premium w-full flex items-center gap-4 text-left">
                <div className="icon-premium">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </section>

        <section className="animate-in-delay-2">
          <div className="section-header">
            <h2 className="section-title">Start Here</h2>
            <button onClick={() => navigate("/quizzes")} className="section-action">All quizzes →</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickQuizzes.map((q) => {
              const Icon = q.icon;
              return (
                <button key={q.id} onClick={() => navigate(q.path)} className="card-premium p-4 text-left">
                  <div className="icon-premium w-12 h-12 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-tight">{q.title}</h3>
                </button>
              );
            })}
          </div>
        </section>

        <section className="animate-in-delay-3">
          <div className="card-premium text-center py-6">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-2">Tonight</p>
            <h3 className="text-headline text-foreground mb-2">Run the playbook</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
              Check her phase. Pick the move. Execute.
            </p>
            <button onClick={() => navigate("/her-cycle")} className="btn-primary">
              <Droplets className="w-4 h-4" /> Open Her Cycle
            </button>
          </div>
        </section>

        <PoweredByTLC />
      </div>
    </div>
  );
}
