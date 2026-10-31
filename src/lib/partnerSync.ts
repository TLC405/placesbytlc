import { supabase } from "@/integrations/supabase/client";
const DEVICE_KEY = "nt_sync_device_v1";
export type SharedItem = { text: string; author: "host" | "guest"; updated_at: string };
export type GuestPair = { status: "pending" | "paired"; slot: "host" | "guest"; code: string | null; expires_at: string; shared: Record<string, SharedItem>; updated_at: string };
function deviceToken() {
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing && /^[a-f0-9]{64}$/.test(existing)) return existing;
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("");
  localStorage.setItem(DEVICE_KEY, token);
  return token;
}
export async function partnerSync(action: "load" | "create" | "join" | "save" | "unlink", fields: { code?: string; key?: "mood" | "next_date" | "note"; text?: string } = {}): Promise<GuestPair | null> {
  const { data, error } = await supabase.functions.invoke("partner-sync", { body: { token: deviceToken(), action, ...fields } });
  if (error) {
    const context = error.context;
    if (context instanceof Response) {
      const body = await context.json().catch(() => null);
      if (typeof body?.error === "string") throw new Error(body.error);
    }
    throw new Error("Couldn’t connect. Please try again.");
  }
  if (data?.error) throw new Error(data.error);
  return (data?.pair as GuestPair | null) || null;
}