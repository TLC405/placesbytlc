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
}

const sendSMS = async (to: string, message: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error("Twilio credentials not configured");
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const formData = new URLSearchParams({
    To: to.startsWith('+') ? to : `+1${to}`,
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
    const { guyName, guyPhone, periodDate, cycleLength }: PeriodTrackerRequest = await req.json();

    console.log("Setting up period tracker for:", guyName, guyPhone);

    // Calculate reminder dates
    const periodStartDate = new Date(periodDate);
    const threeDaysBefore = new Date(periodStartDate);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
    
    const oneDayBefore = new Date(periodStartDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    // Send confirmation SMS immediately
    const confirmationMessage = `Hey ${guyName}! 👋 You're now subscribed to Period Tracker survival alerts. You'll get helpful reminders 3 days before, 1 day before, and on the day. Prepare to be the most thoughtful boyfriend ever. 💪`;
    
    await sendSMS(guyPhone, confirmationMessage);

    // In a production app, you would schedule these messages using a job queue or cron
    // For now, we'll just send the confirmation and log the scheduled dates
    console.log(`Scheduled reminders for ${guyName}:`);
    console.log(`- 3 days before (${threeDaysBefore.toISOString()}): Stock up reminder`);
    console.log(`- 1 day before (${oneDayBefore.toISOString()}): Prep reminder`);
    console.log(`- Day of (${periodStartDate.toISOString()}): Survival mode reminder`);

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
