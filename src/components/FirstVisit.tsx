import { useState } from "react";
import { ArrowRight, LockKeyhole, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/contexts/ProfileContext";
import { useTheme } from "@/contexts/ThemeContext";
import { validAge } from "@/lib/profile";
import { PumpkinIcon } from "./HalloweenIcon";
import halloweenArt from "@/assets/halloween-still-life.jpg";

export function FirstVisit() {
  const { profile, saveProfile, skipIntake, editing } = useProfile();
  const { isHalloween } = useTheme();
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  const field = (key: keyof typeof draft, value: string) => setDraft(prev => ({ ...prev, [key]: value }));
  return <main className="intake-shell">
    <section className="intake-intro">
      {isHalloween && <img src={halloweenArt} width={1536} height={768} className="intake-art" alt="A smiling ceramic pumpkin and tiny ghost" />}
      <div className="intake-intro-inner">
        <div className="flex items-center justify-between"><span className="brand-wordmark">DEEP<span className="text-primary">ER</span></span><span className="season-label">{isHalloween ? <PumpkinIcon className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}{isHalloween ? "A little spooky. A lot more you." : "A little more you."}</span></div>
        <p className="eyebrow mt-10">{editing ? "Your profile" : "Nice to meet you"}</p>
        <h1 className="intake-heading">{editing ? "People change.\nSo can this." : "First,\na little about you."}</h1>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">Your name, your stage, your next chapter. Share as much—or as little—as you like.</p>
      </div>
    </section>
    <form className="intake-form" onSubmit={e => { e.preventDefault(); if (!validAge(draft.age)) { setError("Enter a whole age from 18 to 120, or leave it blank."); return; } saveProfile(draft); }}>
      <div className="flex items-center justify-between mb-6"><p className="text-xs text-muted-foreground">All fields are optional</p>{editing && <Button variant="ghost" size="icon" aria-label="Close profile" onClick={skipIntake}><X /></Button>}</div>
      <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-4">
        <div className="space-y-2"><Label htmlFor="profile-name">What should we call you?</Label><Input id="profile-name" autoComplete="given-name" maxLength={40} placeholder="First name or nickname" value={draft.name} onChange={e => field("name", e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="profile-age">Age</Label><Input id="profile-age" type="number" min={18} max={120} placeholder="18+" value={draft.age} onChange={e => { field("age", e.target.value); setError(""); }} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <div className="space-y-2"><Label htmlFor="profile-gender">Gender</Label><select id="profile-gender" className="profile-select" value={draft.gender} onChange={e => field("gender", e.target.value)}><option value="">Prefer not to say</option><option>Man</option><option>Woman</option><option>Non-binary</option><option>Self-described</option></select></div>
        <div className="space-y-2"><Label htmlFor="profile-relationship">Where are you at?</Label><select id="profile-relationship" className="profile-select" value={draft.relationship} onChange={e => field("relationship", e.target.value)}><option value="">Prefer not to say</option><option>Single</option><option>Dating someone</option><option>In a relationship</option><option>It's complicated</option></select></div>
      </div>
      <fieldset className="mt-6"><legend className="text-sm font-medium mb-3">What brings you here?</legend><div className="grid sm:grid-cols-2 gap-2">{["Understand myself", "Feel more confident", "Connect with my partner", "Plan better dates"].map(goal => <label key={goal} className={`goal-option ${draft.goal === goal ? "selected" : ""}`}><input type="radio" name="goal" value={goal} checked={draft.goal === goal} onChange={() => field("goal", goal)} /><span>{goal}</span></label>)}</div></fieldset>
      {error && <p role="alert" className="text-destructive text-sm mt-3">{error}</p>}
      <div className="flex items-start gap-2 mt-6 text-xs text-muted-foreground leading-relaxed"><LockKeyhole className="h-4 w-4 shrink-0" /><p>Saved only on this device. Never shared with your partner. Quizzes are for reflection, not a diagnosis.</p></div>
      <Button className="w-full mt-6" type="submit">{editing ? "Save my profile" : "Let's go deeper"}<ArrowRight /></Button>
      <Button className="w-full mt-2" variant="ghost" onClick={skipIntake} type="button">{editing ? "Cancel" : "Skip for now"}</Button>
    </form>
  </main>;
}