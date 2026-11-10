import { useNavigate } from "react-router-dom";
import { Brain, CalendarHeart, Droplets, ArrowUpRight, Link2, UserRound, ArrowRight } from "lucide-react";
import { PoweredByTLC } from "@/components/PoweredByTLC";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import { AppLogo } from "@/components/AppLogo";
import { ThemeSelector } from "@/components/ThemeSelector";
import { CupidPortrait } from "@/components/CupidPortrait";

export default function HackerHome() {
  const navigate = useNavigate();
  const { profile, editProfile } = useProfile();
  const { currentTheme, themes } = useTheme();
  const theme = themes[currentTheme];
  const pillars = [
    { title: "Know yourself", sub: "Quick quizzes about how you tick.", icon: Brain, path: "/quizzes", tag: "Mind" },
    { title: "Plan a date night", sub: "Ideas and real places, no endless scrolling.", icon: CalendarHeart, path: "/recon", tag: "Dates" },
    { title: "Her cycle", sub: "Know what kind of week she’s having.", icon: Droplets, path: "/her-cycle", tag: "Cycle" },
    { title: "Share with your partner", sub: "Moods, plans, and notes between you two.", icon: Link2, path: "/sync", tag: "Sync" },
  ];
  const recommended = profile.goal === "Plan better dates" ? "/quiz/date-night-iq" : profile.goal === "Connect with my partner" ? "/quiz/compatibility" : profile.goal === "Feel more confident" ? "/quiz/dating-confidence" : "/quiz/masculine-archetype";
  return <main className="page-shell">
    <div className="page-content space-y-7">
      <header className="home-masthead"><AppLogo /><div className="flex items-center gap-2"><ThemeSelector /><Button variant="ghost" size="icon" onClick={editProfile} aria-label="Edit your profile" title="Edit your profile"><UserRound /></Button></div></header>
      <section className="home-hero animate-in">
        <img src={theme.image} width={1536} height={768} className="home-hero-art" alt={theme.alt} />
        <div className="home-hero-copy"><p className="text-xs">{profile.name ? `Hey, ${profile.name}.` : "Good to have you here."}</p><h1 className="whitespace-pre-line">{theme.headline}</h1><p className="text-sm leading-relaxed mb-5">{theme.supporting}</p><Button size="sm" onClick={() => navigate(recommended)}>Start with you<ArrowRight /></Button></div>
      </section>
      <section className="cupid-welcome" aria-labelledby="cupid-welcome-title">
        <div className="cupid-welcome-portrait"><CupidPortrait /></div>
        <div><span className="eyebrow">Your date-planning helper</span><h2 id="cupid-welcome-title">Meet Cupid</h2><p>Tell it your mood and budget. Get a full date plan.</p></div>
        <Button className="cupid-start" size="sm" onClick={() => navigate("/ai-recommender")}>Ask Cupid<ArrowRight /></Button>
      </section>
      <section className="animate-in"><div className="section-header"><h2 className="section-title">Where to start</h2></div><div className="grid grid-cols-2 gap-3">{pillars.map(p => { const Icon = p.icon; return <Button key={p.tag} variant="outline" onClick={() => navigate(p.path)} className="dashboard-card group text-left gap-0"><div className="flex w-full items-center justify-between mb-4"><Icon className="h-6 w-6 text-primary" /><ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div><span className="text-[10px] text-primary mb-1">{p.tag}</span><h3 className="text-foreground font-semibold leading-snug">{p.title}</h3><p className="text-xs text-muted-foreground leading-relaxed mt-1">{p.sub}</p></Button>; })}</div></section>
      <PoweredByTLC />
    </div>
  </main>;
}
