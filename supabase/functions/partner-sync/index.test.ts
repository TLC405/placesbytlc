import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
const url = Deno.env.get("VITE_SUPABASE_URL");
const key = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("VITE_SUPABASE_ANON_KEY");
function token() { return Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join(""); }
async function call(body: unknown) {
  if (!url || !key) throw new Error("Test configuration is unavailable");
  const response = await fetch(`${url}/functions/v1/partner-sync`, { method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json();
  return { status: response.status, data };
}
Deno.test("code-only Sync: two partners, isolated moods, single-use code and unlink revocation", async () => {
  const host = token(), guest = token(), third = token();
  const created = await call({ token: host, action: "create" });
  assertEquals(created.status, 200);
  const code = created.data.pair.code;
  assertEquals(code.length, 6);
  try {
    const joined = await call({ token: guest, action: "join", code });
    assertEquals(joined.status, 200);
    assertEquals(joined.data.pair.status, "paired");
    const rejected = await call({ token: third, action: "join", code });
    assertEquals(rejected.status, 400);
    assertEquals((await call({ token: third, action: "load" })).data.pair, null);
    await call({ token: host, action: "save", key: "mood", text: "Chill" });
    await call({ token: guest, action: "save", key: "mood", text: "Feeling close" });
    await call({ token: guest, action: "save", key: "next_date", text: "Friday tacos" });
    await call({ token: host, action: "save", key: "note", text: "Thinking of you" });
    const read = await call({ token: guest, action: "load" });
    assertEquals(read.data.pair.shared.mood_host.text, "Chill");
    assertEquals(read.data.pair.shared.mood_guest.text, "Feeling close");
    assertEquals(read.data.pair.shared.next_date.text, "Friday tacos");
    assertEquals(read.data.pair.shared.note.author, "host");
    assert(!JSON.stringify(read.data).includes(host));
    await call({ token: host, action: "unlink" });
    assertEquals((await call({ token: guest, action: "load" })).data.pair, null);
    assertEquals((await call({ token: guest, action: "save", key: "note", text: "No access" })).status, 400);
  } finally { await call({ token: host, action: "unlink" }); }
});
Deno.test("missing capability and forged authorship are refused", async () => {
  assertEquals((await call({ action: "load" })).status, 400);
  assertEquals((await call({ token: token(), action: "save", key: "note", text: "Hello", pair_id: "forged" })).status, 400);
});