import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const Body = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  action: z.enum(["load", "create", "join", "save", "unlink"]),
  code: z.string().regex(/^[A-Z2-9]{6}$/).optional(),
  key: z.enum(["mood", "next_date", "note"]).optional(),
  text: z.string().trim().min(1).max(500).optional(),
}).strict();
async function hash(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}
function code() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(6)), byte => alphabet[byte % alphabet.length]).join("");
}
function reply(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  try {
    if (Number(req.headers.get("content-length") || "0") > 4096) return reply({ error: "Request too large" }, 413);
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return reply({ error: "Check your code or message and try again." }, 400);
    const { token, action, key, text } = parsed.data;
    if (action === "join" && !parsed.data.code) return reply({ error: "Enter your partner’s code." }, 400);
    if (action === "save" && (!key || !text)) return reply({ error: "A message is required." }, 400);
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) return reply({ error: "Partner linking is temporarily unavailable." }, 503);
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const invite = action === "create" ? code() : parsed.data.code;
    // Gateway-supplied address only; never accept a device or pair ID from the caller.
    const address = req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || "unknown";
    const { data, error } = await admin.rpc("partner_sync_action", {
      _token_hash: await hash(token), _ip_hash: await hash(address), _action: action,
      _code: invite || null, _code_hash: invite ? await hash(invite) : null,
      _key: key || null, _text: text || null,
    });
    if (error) return reply({ error: "Couldn’t update your connection. Please try again." }, 500);
    if (data?.error) return reply(data, data.error.includes("wait") ? 429 : 400);
    return reply(data);
  } catch { return reply({ error: "Couldn’t read this request. Please try again." }, 400); }
});