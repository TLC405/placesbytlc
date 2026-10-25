import { useNavigate } from "react-router-dom";
import { Brain, CalendarHeart, Droplets, ArrowUpRight, Flame, Crown, Link2, UserRound, ArrowRight } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import { PumpkinIcon } from "@/components/HalloweenIcon";
import halloweenArt from "@/assets/halloween-still-life.jpg";

export default function HackerHome() {
  const navigate = useNavigate();
  const { profile, editProfile } = useProfile();
  const { isHalloween } = useTheme();
  const pillars = [
    { title: "Know yourself", sub: "Less second-guessing. More self-awareness.", icon: Brain, path: "/quizzes", tag: "Mind" },
    { title: "Make a night of it", sub: "Good company deserves a good plan.", icon: CalendarHeart, path: "/recon", tag: "Dates" },
    { title: "A little more care", sub: "Her cycle. A thoughtful check-in.", icon: Droplets, path: "/her-cycle", tag: "Cycle" },
    { title: "Your shared space", sub: "Moods, plans, and the little love notes.", icon: Link2, path: "/sync", tag: "Sync" },
  ];
  const recommended = profile.goal === "Plan better dates" ? "/quiz/date-night-iq" : profile.goal === "Connect with my partner" ? "/quiz/compatibility" : profile.goal === "Feel more confident" ? "/quiz/dating-confidence" : "/quiz/masculine-archetype";
  return <main className="page-shell">
    <div className="page-content space-y-7">
      <header className="home-masthead"><span className="brand-wordmark">DEEP<span className="text-primary">ER</span></span><div className="flex items-center gap-3">{isHalloween && <span className="season-label"><PumpkinIcon className="h-5 w-5" />October edition</span>}<Button variant="ghost" size="icon" onClick={editProfile} aria-label="Edit your profile" title="Edit your profile"><UserRound /></Button></div></header>
      <section className="home-hero animate-in">
        {isHalloween && <img src={halloweenArt} width={1536} height={768} className="home-hero-art" alt="A smiling pumpkin with a little ghost and velvet ribbons" />}
        <div className="home-hero-copy"><p className="text-xs">{profile.name ? `Hey, ${profile.name}.` : "Good to have you here."}</p><h1>{isHalloween ? <>Less ghosting.<br />More connection.</> : <>Know yourself.<br />Date deeper.</>}</h1><p className="text-sm leading-relaxed mb-5">{isHalloween ? "The only thing we're haunting? Old habits." : "A little reflection. A little effort. Better connections."}</p><Button size="sm" onClick={() => navigate(recommended)}>Start with you<ArrowRight /></Button></div>
      </section>
      <section className="animate-in"><div className="section-header"><h2 className="section-title">Your next good move</h2><span className="text-xs text-muted-foreground">Your pace. Your choice.</span></div><div className="grid grid-cols-2 gap-3">{pillars.map(p => { const Icon = p.icon; return <Button key={p.tag} variant="outline" onClick={() => navigate(p.path)} className="dashboard-card group text-left gap-0"><div className="flex w-full items-center justify-between mb-4"><Icon className="h-6 w-6 text-primary" /><ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div><span className="text-[10px] text-primary mb-1">{p.tag}</span><h3 className="text-foreground font-semibold leading-snug">{p.title}</h3><p className="text-xs text-muted-foreground leading-relaxed mt-1">{p.sub}</p></Button>; })}</div></section>
      <section className="border-t border-border pt-6"><div className="section-header"><h2 className="section-title">A quick check-in with yourself</h2><Button variant="link" size="sm" onClick={() => navigate("/quizzes")} className="px-0">All quizzes<ArrowRight /></Button></div><div className="grid sm:grid-cols-2 gap-3">{[{ title: "Masculine Archetype", sub: "Meet the different sides of you", icon: Crown, path: "/quiz/masculine-archetype" }, { title: "Confidence Index", sub: "An honest look at how you show up", icon: Flame, path: "/quiz/dating-confidence" }].map(q => <Button key={q.title} variant="ghost" className="h-auto justify-start whitespace-normal border-b border-border rounded-none px-0 py-4 text-left" onClick={() => navigate(q.path)}><q.icon className="text-secondary" /><span><span className="block font-semibold text-sm">{q.title}</span><span className="block font-normal text-xs text-muted-foreground mt-1">{q.sub}</span></span><ArrowUpRight className="ml-auto" /></Button>)}</div></section>
      <PoweredByTLC />
    </div>
  </main>;
}
