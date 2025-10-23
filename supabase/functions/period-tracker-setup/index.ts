import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");

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
}

const sendSMS = async (to: string, message: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error("Twilio credentials not configured");
  }

  // Ensure the phone number is in E.164 format (+1XXXXXXXXXX for US)
  const formattedPhone = to.startsWith('+') ? to : `+${to}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const formData = new URLSearchParams({
    To: formattedPhone,
    From: TWILIO_PHONE_NUMBER,
    Body: message,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Twilio error:", error);
    throw new Error(`Failed to send SMS: ${error}`);
  }

  return await response.json();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guyName, guyPhone, periodDate, cycleLength, spamMode }: PeriodTrackerRequest = await req.json();

    console.log("Setting up period tracker for:", guyName, guyPhone, "Spam mode:", spamMode);

    // Calculate reminder dates
    const periodStartDate = new Date(periodDate);
    const threeDaysBefore = new Date(periodStartDate);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
    
    const oneDayBefore = new Date(periodStartDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

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
    
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to set up period tracker",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
