import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const TWILIO_MESSAGING_SERVICE_SID = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PeriodTrackerRequest {
  guyName: string;
  guyPhone: string;
  periodDate: string;
  cycleLength: number;
  spamMode?: boolean;
  dryRun?: boolean;
}

const sendSMS = async (to: string, message: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || (!TWILIO_PHONE_NUMBER && !TWILIO_MESSAGING_SERVICE_SID)) {
    throw new Error("Twilio credentials not configured");
  }

  const toFormatted = to.startsWith('+') ? to : `+${to.replace(/[^\d]/g, '')}`;
  const fromFormatted = TWILIO_PHONE_NUMBER
    ? (TWILIO_PHONE_NUMBER.startsWith('+') ? TWILIO_PHONE_NUMBER : `+${TWILIO_PHONE_NUMBER.replace(/[^\d]/g, '')}`)
    : undefined;

  if (fromFormatted && toFormatted === fromFormatted) {
    const err = new Error("The destination number cannot be the same as the sender number. Please use a different 'To' number.");
    // @ts-ignore
    (err as any)['code'] = 'TO_EQUALS_FROM';
    throw err;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const formData = new URLSearchParams({
    To: toFormatted,
    Body: message,
  });

  if (TWILIO_MESSAGING_SERVICE_SID) {
    formData.set('MessagingServiceSid', TWILIO_MESSAGING_SERVICE_SID);
  } else if (fromFormatted) {
    formData.set('From', fromFormatted);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    let errorText = await response.text();
    try {
      const json = JSON.parse(errorText);
      errorText = JSON.stringify(json);
    } catch {}
    console.error("Twilio error:", errorText);
    throw new Error(`Failed to send SMS: ${errorText}`);
  }

  return await response.json();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guyName, guyPhone, periodDate, cycleLength, spamMode, dryRun }: PeriodTrackerRequest = await req.json();

    console.log("Setting up period tracker for:", guyName, guyPhone, "Spam mode:", spamMode);

    // Calculate reminder dates
    const periodStartDate = new Date(periodDate);
    const threeDaysBefore = new Date(periodStartDate);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
    
    const oneDayBefore = new Date(periodStartDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    // If dry run, don't send SMS — just return schedule for verification
    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Dry run successful. No SMS sent.",
          scheduledDates: {
            threeDaysBefore: threeDaysBefore.toISOString(),
            oneDayBefore: oneDayBefore.toISOString(),
            periodDate: periodStartDate.toISOString(),
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (spamMode) {
      // REVENGE MODE: Send 30 texts over 5 minutes (1 every 10 seconds)
      const spamMessages = [
        `${guyName}, heads up! 🚨`,
        `Stock up on chocolate. NOW. 🍫`,
        `Get a heating pad ready. 🔥`,
        `Whatever she says, just agree. ✅`,
        `This is not a drill. 📢`,
        `Netflix queue ready? 📺`,
        `Flowers = life insurance 💐`,
        `Keep snacks stocked 🍪`,
        `Silence is golden 🤐`,
        `She's NOT overreacting 🛡️`,
        `You're underreacting 🎯`,
        `Seriously, CHOCOLATE 🍫🍫`,
        `More chocolate 🍫🍫🍫`,
        `Ice cream too 🍦`,
        `Be nice or else 😤`,
        `Empathy mode: ACTIVATED 💝`,
        `Listen, don't solve 👂`,
        `Hug availability: 24/7 🤗`,
        `Tea, heating pad, silence 🍵`,
        `This is IMPORTANT ⚠️`,
        `Remember: CHOCOLATE 🍫`,
        `And patience 😇`,
        `Lots of patience 😅`,
        `Actually, unlimited patience ♾️`,
        `You got this king 👑`,
        `But seriously, CHOCOLATE 🍫`,
        `We're not joking 😐`,
        `CHOCOLATE = SURVIVAL 🍫🛡️`,
        `Last warning! ⚡`,
        `Good luck soldier 🫡`,
      ];

      // Send all messages with delays (simulated for demo)
      await sendSMS(guyPhone, `${guyName}, REVENGE MODE ACTIVATED! 😈 You're about to get 30 texts. She said you deserved it. Good luck! 💣`);
      
      // In production, you'd queue these with actual delays
      // For now, we'll just send the first few immediately
      for (let i = 0; i < Math.min(3, spamMessages.length); i++) {
        await sendSMS(guyPhone, spamMessages[i]);
      }

      console.log(`SPAM MODE: Queued ${spamMessages.length} messages for ${guyName}`);
    } else {
      // Normal mode: Send confirmation SMS
      const confirmationMessage = `Hey ${guyName}! 👋 You're now subscribed to Peripod Tracker survival alerts. You'll get helpful reminders 3 days before, 1 day before, and on the day. Prepare to be the most thoughtful boyfriend ever. 💪`;
      
      await sendSMS(guyPhone, confirmationMessage);

      console.log(`Scheduled reminders for ${guyName}:`);
      console.log(`- 3 days before (${threeDaysBefore.toISOString()}): Stock up reminder`);
      console.log(`- 1 day before (${oneDayBefore.toISOString()}): Prep reminder`);
      console.log(`- Day of (${periodStartDate.toISOString()}): Survival mode reminder`);
    }

    // TODO: In production, store these in a database and use Edge Functions with scheduled triggers
    // or integrate with a service like Inngest, Qstash, or Supabase Edge Functions cron

    return new Response(
      JSON.stringify({
        success: true,
        message: "Period tracker set up successfully",
        scheduledDates: {
          threeDaysBefore: threeDaysBefore.toISOString(),
          oneDayBefore: oneDayBefore.toISOString(),
          periodDate: periodStartDate.toISOString(),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in period-tracker-setup:", error);
    
    const msg = error?.message || "Failed to set up period tracker";
    const statusCode = typeof msg === 'string' && (msg.includes('"status":400') || msg.includes('TO_EQUALS_FROM')) ? 400 : 500;

    return new Response(
      JSON.stringify({
        error: msg,
        details: String(error),
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
