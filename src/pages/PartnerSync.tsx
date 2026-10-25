import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, Copy, Heart, CalendarHeart, MessageCircle, LogIn, Unlink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PoweredByTLC } from "@/components/PoweredByTLC";

type Couple = { id: string; partner_1_id: string; partner_2_id: string | null; pairing_code: string | null; status: string | null };
type Shared = Record<string, { data: any; created_by: string | null; updated_at: string }>;

const MOODS = ["😍 Feeling close", "😌 Chill", "🥱 Tired", "😤 Stressed", "🤒 Off today", "🔥 Up for anything"];

const genCode = () => Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

export default function PartnerSync() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [shared, setShared] = useState<Shared>({});
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [dateDraft, setDateDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  const loadCouple = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("couples").select("*").or(`partner_1_id.eq.${user.id},partner_2_id.eq.${user.id}`).order("created_at", { ascending: false }).limit(1).maybeSingle();
    setCouple(data as Couple | null);
    setLoading(false);
  }, [user]);

  const loadShared = useCallback(async (coupleId: string) => {
    const { data } = await supabase.from("shared_data").select("*").eq("couple_id", coupleId);
    const map: Shared = {};
    (data || []).forEach((r: any) => { map[r.data_type] = { data: r.data, created_by: r.created_by, updated_at: r.updated_at }; });
    setShared(map);
  }, []);

  useEffect(() => { loadCouple(); }, [loadCouple]);

  useEffect(() => {
    if (!couple?.partner_2_id) return;
    loadShared(couple.id);
    const ch = supabase
      .channel(`sync-${couple.id}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "shared_data", filter: `couple_id=eq.${couple.id}` }, () => loadShared(couple.id))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [couple?.id, couple?.partner_2_id, loadShared]);

  // Poll while waiting for partner to join
  useEffect(() => {
    if (!couple || couple.partner_2_id) return;
    const t = setInterval(loadCouple, 5000);
    return () => clearInterval(t);
  }, [couple, loadCouple]);

  const createInvite = async () => {
    if (!user) return;
    const pairing_code = genCode();
    const { data, error } = await supabase.from("couples").insert({ partner_1_id: user.id, pairing_code, status: "pending", code_expires_at: new Date(Date.now() + 86400000).toISOString() }).select().single();
    if (error) return toast.error("Couldn't create invite");
    setCouple(data as Couple);
  };

  const joinWithCode = async () => {
    const { error } = await supabase.rpc("join_couple" as any, { _code: code.trim().toUpperCase() });
    if (error) return toast.error(error.message.includes("Invalid") ? "That code didn't work" : "Couldn't join");
    toast.success("You're synced 💞");
    loadCouple();
  };

  const save = async (type: string, data: any) => {
    if (!couple || !user) return;
    const existing = await supabase.from("shared_data").select("id").eq("couple_id", couple.id).eq("data_type", type).maybeSingle();
    const res = existing.data
      ? await supabase.from("shared_data").update({ data, created_by: user.id }).eq("id", existing.data.id)
      : await supabase.from("shared_data").insert({ couple_id: couple.id, data_type: type, data, created_by: user.id });
    if (res.error) return toast.error("Couldn't save");
    toast.success("Shared with your partner");
    loadShared(couple.id);
  };

  const unpair = async () => {
    if (!couple) return;
    await supabase.from("couples").update({ status: "ended" }).eq("id", couple.id);
    setCouple(null);
  };

  const who = (id: string | null) => (id === user?.id ? "You" : "Partner");
  const myMood = shared[`mood_${user?.id}`]?.data?.mood;
  const partnerId = couple ? (couple.partner_1_id === user?.id ? couple.partner_2_id : couple.partner_1_id) : null;
  const partnerMood = partnerId ? shared[`mood_${partnerId}`]?.data?.mood : null;
  const active = couple && couple.status !== "ended" ? couple : null;

  return (
    <div className="page-shell">
      <div className="page-content space-y-6">
        <header className="animate-in">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary">Partner Sync</p>
          <h1 className="text-3xl font-black text-foreground">Stay on the same page</h1>
          <p className="text-sm text-muted-foreground mt-1">Link up with your partner — share moods, date plans and notes in real time.</p>
        </header>

        {loading ? (
          <div className="card-premium text-center text-sm text-muted-foreground">Loading…</div>
        ) : !user ? (
          <div className="card-premium text-center space-y-4">
            <Link2 className="w-10 h-10 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Sign in so we can connect you with your partner.</p>
            <button onClick={() => navigate("/auth")} className="btn-main w-full inline-flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Sign in to sync</button>
          </div>
        ) : !active ? (
          <div className="space-y-4">
            <div className="card-premium space-y-3">
              <h3 className="font-bold text-foreground">Invite your partner</h3>
              <p className="text-xs text-muted-foreground">Get a 6-letter code to send them. It lasts 24 hours.</p>
              <button onClick={createInvite} className="btn-main w-full">Create invite code</button>
            </div>
            <div className="card-premium space-y-3">
              <h3 className="font-bold text-foreground">Got a code?</h3>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} placeholder="ABC123" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-xl font-black tracking-[0.4em] text-foreground" />
              <button onClick={joinWithCode} disabled={code.length !== 6} className="btn-main w-full disabled:opacity-50">Join partner</button>
            </div>
          </div>
        ) : !active.partner_2_id ? (
          <div className="card-premium text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Your invite code</p>
            <p className="text-4xl font-black tracking-[0.3em] text-primary">{active.pairing_code}</p>
            <button onClick={() => { navigator.clipboard.writeText(active.pairing_code || ""); toast.success("Copied"); }} className="btn-main w-full inline-flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Copy code</button>
            <p className="text-xs text-muted-foreground">Waiting for your partner to enter it…</p>
            <button onClick={unpair} className="text-xs text-muted-foreground underline">Cancel invite</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="card-premium flex items-center gap-3">
              <div className="icon-premium"><Heart className="w-5 h-5 text-primary" /></div>
              <div className="flex-1"><p className="font-bold text-foreground">You're synced</p><p className="text-xs text-muted-foreground">Updates show up live for both of you</p></div>
              <button onClick={unpair} aria-label="Unlink" className="text-muted-foreground"><Unlink className="w-4 h-4" /></button>
            </div>

            <div className="card-premium space-y-3">
              <h3 className="font-bold text-foreground">Today's vibe</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">You</p><p className="font-semibold text-foreground">{myMood || "—"}</p></div>
                <div className="rounded-xl border border-border p-3"><p className="text-muted-foreground">Partner</p><p className="font-semibold text-foreground">{partnerMood || "—"}</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button key={m} onClick={() => save(`mood_${user.id}`, { mood: m })} className={myMood === m ? "chip-primary" : "chip-primary opacity-60"}>{m}</button>
                ))}
              </div>
            </div>

            <div className="card-premium space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2"><CalendarHeart className="w-4 h-4 text-primary" /> Next date</h3>
              {shared.next_date && <p className="text-sm text-foreground">{shared.next_date.data.text} <span className="text-xs text-muted-foreground">— {who(shared.next_date.created_by)}</span></p>}
              <div className="flex gap-2">
                <input value={dateDraft} onChange={(e) => setDateDraft(e.target.value)} placeholder="Fri 8pm — tacos then Plaza walk" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground" />
                <button onClick={() => { if (dateDraft.trim()) { save("next_date", { text: dateDraft.trim() }); setDateDraft(""); } }} className="btn-main px-4">Set</button>
              </div>
            </div>

            <div className="card-premium space-y-3">
              <h3 className="font-bold text-foreground flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> Love note</h3>
              {shared.note && <p className="text-sm text-foreground italic">"{shared.note.data.text}" <span className="not-italic text-xs text-muted-foreground">— {who(shared.note.created_by)}</span></p>}
              <div className="flex gap-2">
                <input value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Leave them something sweet" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground" />
                <button onClick={() => { if (noteDraft.trim()) { save("note", { text: noteDraft.trim() }); setNoteDraft(""); } }} className="btn-main px-4">Send</button>
              </div>
            </div>
          </div>
        )}
        <PoweredByTLC />
      </div>
    </div>
  );
}
