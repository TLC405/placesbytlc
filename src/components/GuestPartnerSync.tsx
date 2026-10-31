import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Heart, Link2, RefreshCw, Unlink, CalendarHeart, MessageCircle, ShieldCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { partnerSync, type GuestPair } from "@/lib/partnerSync";
import { toast } from "sonner";
const MOODS = ["😍 Feeling close", "😌 Chill", "🥱 Tired", "😤 Stressed", "🤒 Off today", "🔥 Up for anything"];
export function GuestPartnerSync() {
  const [pair, setPair] = useState<GuestPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const alive = useRef(true);
  const pending = useRef(false);
  const refresh = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    try { const next = await partnerSync("load"); if (alive.current) { setPair(next); setError(""); } }
    catch (e) { if (alive.current) setError(e instanceof Error ? e.message : "Couldn’t connect."); }
    finally { pending.current = false; if (alive.current) setLoading(false); }
  }, []);
  useEffect(() => {
    alive.current = true; refresh();
    const interval = window.setInterval(() => { if (!document.hidden) refresh(); }, 5000);
    return () => { alive.current = false; clearInterval(interval); };
  }, [refresh]);
  const act = async (action: "create" | "join" | "save" | "unlink", fields = {}) => {
    if (busy) return false;
    setBusy(true); setError("");
    try { const next = await partnerSync(action, fields); setPair(next); if (action === "save") toast.success("Shared with your partner"); return true; }
    catch (e) { setError(e instanceof Error ? e.message : "Please try again."); return false; }
    finally { setBusy(false); }
  };
  const myMood = pair?.shared[`mood_${pair.slot}`]?.text;
  const theirMood = pair?.shared[`mood_${pair.slot === "host" ? "guest" : "host"}`]?.text;
  const who = (author?: string) => author === pair?.slot ? "You" : "Partner";
  if (loading) return <div className="flex justify-center gap-2 py-10 text-muted-foreground"><LoaderCircle className="h-5 w-5 animate-spin" />Connecting…</div>;
  return <div className="space-y-6">
    {error && <div role="alert" className="border border-destructive/40 rounded-lg p-4 text-sm text-destructive flex items-center gap-3"><span className="flex-1">{error}</span><Button variant="ghost" size="icon" aria-label="Retry connection" onClick={refresh}><RefreshCw /></Button></div>}
    {!pair ? <>
      <section className="border-b border-border pb-6"><div className="icon-premium mb-4"><Link2 className="text-primary" /></div><h2 className="text-xl mb-2">Just the two of you</h2><p className="text-sm text-muted-foreground mb-5">Send a private code to your partner. No accounts, no sign-in.</p><Button disabled={busy} className="w-full" onClick={() => act("create")}>{busy ? <LoaderCircle className="animate-spin" /> : <Link2 />}Create invite code</Button></section>
      <form onSubmit={e => { e.preventDefault(); act("join", { code: code.trim().toUpperCase() }); }} className="space-y-3"><Label htmlFor="partner-code">Already have a code?</Label><Input id="partner-code" value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ""))} maxLength={6} autoComplete="off" placeholder="ABC234" className="text-center text-xl font-semibold h-14" /><Button type="submit" variant="outline" disabled={busy || code.length !== 6} className="w-full">Join partner<Heart /></Button></form>
    </> : pair.status === "pending" ? <section className="text-center py-4 space-y-5"><div className="icon-premium mx-auto"><Link2 className="text-primary" /></div><h2 className="text-xl">One code. Your shared space.</h2><output aria-label="Your invite code" className="block text-4xl font-semibold text-primary break-all">{pair.code}</output><Button disabled={busy} onClick={async () => { try { await navigator.clipboard.writeText(pair.code || ""); toast.success("Code copied"); } catch { toast.error("Couldn’t copy. Select the code to share it."); } }}><Copy />Copy code</Button><p className="text-sm text-muted-foreground">Waiting for your partner…</p><p className="text-xs text-muted-foreground">Expires {new Date(pair.expires_at).toLocaleString()}. Keep the code between you two.</p><Button variant="ghost" disabled={busy} onClick={() => act("unlink")}>Cancel invite</Button></section> : <>
      <div className="flex items-center gap-3 border-b border-border pb-5"><Heart className="text-primary h-6 w-6" /><div className="flex-1"><h2 className="text-xl">You’re connected</h2><p className="text-xs text-muted-foreground">Your shared space, just between you.</p></div><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Unlink partner"><Unlink /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Unlink your partner?</AlertDialogTitle><AlertDialogDescription>This ends access for both devices and clears the shared mood, date plan and note. You can reconnect with a new code.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep connected</AlertDialogCancel><AlertDialogAction onClick={() => act("unlink")}>Unlink</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>
      <section><h3 className="text-lg mb-3">Today’s vibe</h3><div className="grid grid-cols-2 divide-x divide-border border-y border-border py-4 mb-4"><div className="pr-3"><p className="text-xs text-muted-foreground mb-1">You</p><p className="text-sm font-semibold" data-testid="my-mood">{myMood || "Not shared yet"}</p></div><div className="pl-3"><p className="text-xs text-muted-foreground mb-1">Partner</p><p className="text-sm font-semibold" data-testid="partner-mood">{theirMood || "Not shared yet"}</p></div></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{MOODS.map(mood => <Button variant={myMood === mood ? "default" : "outline"} size="sm" className="px-2" key={mood} aria-pressed={myMood === mood} disabled={busy} onClick={() => act("save", { key: "mood", text: mood })}>{mood}</Button>)}</div></section>
      <section className="border-t border-border pt-5"><h3 className="flex items-center gap-2 text-lg mb-3"><CalendarHeart className="h-5 w-5 text-primary" />Next date</h3>{pair.shared.next_date && <p className="text-sm leading-relaxed mb-3" data-testid="shared-date">{pair.shared.next_date.text}<span className="block text-xs text-muted-foreground mt-1">{who(pair.shared.next_date.author)}</span></p>}<form className="flex gap-2" onSubmit={async e => { e.preventDefault(); if (await act("save", { key: "next_date", text: date.trim() })) setDate(""); }}><Input aria-label="Next date plan" maxLength={500} value={date} onChange={e => setDate(e.target.value)} placeholder="Friday, tacos and a walk?" className="min-w-0" /><Button type="submit" disabled={busy || !date.trim()}>Set</Button></form></section>
      <section className="border-t border-border pt-5"><h3 className="flex items-center gap-2 text-lg mb-3"><MessageCircle className="h-5 w-5 text-primary" />A little love note</h3>{pair.shared.note && <p className="text-sm leading-relaxed mb-3 break-words" data-testid="shared-note">“{pair.shared.note.text}”<span className="block text-xs text-muted-foreground mt-1">{who(pair.shared.note.author)}</span></p>}<form className="flex gap-2" onSubmit={async e => { e.preventDefault(); if (await act("save", { key: "note", text: note.trim() })) setNote(""); }}><Input aria-label="Love note" maxLength={500} value={note} onChange={e => setNote(e.target.value)} placeholder="Thinking of you." className="min-w-0" /><Button type="submit" disabled={busy || !note.trim()}>Send</Button></form></section>
    </>}
    <p className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed"><ShieldCheck className="h-4 w-4 shrink-0" />This device remembers your connection. Clearing browser data loses access; unlink first when using a shared device. Profile and cycle details are never sent here.</p>
  </div>;
}