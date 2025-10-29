import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

// Rate limiting configuration
const MAX_SENDS_PER_PHONE_PER_DAY = 3;
const MIN_COOLDOWN_MINUTES = 60;

// Validate phone number format (E.164)
const validatePhoneNumber = (phone: string): { valid: boolean; formatted: string; error?: string } => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  if (!cleaned.startsWith('+')) {
    return { valid: false, formatted: '', error: 'Phone number must include country code (e.g., +1)' };
  }
  
  if (cleaned.length < 11 || cleaned.length > 15) {
    return { valid: false, formatted: '', error: 'Invalid phone number length' };
  }
  
  const usPattern = /^\+1\d{10}$/;
  if (cleaned.startsWith('+1') && !usPattern.test(cleaned)) {
    return { valid: false, formatted: '', error: 'Invalid US phone number format' };
  }
  
  return { valid: true, formatted: cleaned };
};

// Validate message length
const validateMessage = (message: string): { valid: boolean; error?: string } => {
  if (message.length > 1600) {
    return { valid: false, error: 'Message exceeds maximum length' };
  }
  if (message.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  return { valid: true };
};

// Check rate limit for phone number
const checkRateLimit = async (supabase: any, phoneNumber: string): Promise<{ allowed: boolean; error?: string }> => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const oneHourAgo = new Date();
  oneHourAgo.setMinutes(oneHourAgo.getMinutes() - MIN_COOLDOWN_MINUTES);
  
  const { data: recentSends, error } = await supabase
    .from('phone_rate_limits')
    .select('*')
    .eq('phone_number', phoneNumber)
    .gte('last_send_at', oneDayAgo.toISOString())
    .order('last_send_at', { ascending: false });
  
  if (error) {
    console.error('Error checking rate limit:', error);
    return { allowed: true };
  }
  
  if (!recentSends || recentSends.length === 0) {
    return { allowed: true };
  }
  
  if (recentSends.length >= MAX_SENDS_PER_PHONE_PER_DAY) {
    return { 
      allowed: false, 
      error: `Rate limit: Max ${MAX_SENDS_PER_PHONE_PER_DAY} messages per phone per 24 hours` 
    };
  }
  
  const lastSend = new Date(recentSends[0].last_send_at);
  if (lastSend > oneHourAgo) {
    const minutesLeft = Math.ceil((lastSend.getTime() - oneHourAgo.getTime()) / 60000);
    return { 
      allowed: false, 
      error: `Cooldown active: Wait ${minutesLeft} minutes before sending again` 
    };
  }
  
  return { allowed: true };
};

// Record phone send for rate limiting
const recordPhoneSend = async (supabase: any, phoneNumber: string): Promise<void> => {
  await supabase
    .from('phone_rate_limits')
    .insert({
      phone_number: phoneNumber,
      last_send_at: new Date().toISOString(),
      send_count: 1
    });
};

const sendSMS = async (to: string, message: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || (!TWILIO_PHONE_NUMBER && !TWILIO_MESSAGING_SERVICE_SID)) {
    throw new Error("Twilio credentials not configured");
  }

  // Validate message
  const msgValidation = validateMessage(message);
  if (!msgValidation.valid) {
    throw new Error(msgValidation.error);
  }

  const toFormatted = to.startsWith('+') ? to : `+${to.replace(/[^\d]/g, '')}`;
  const fromFormatted = TWILIO_PHONE_NUMBER
    ? (TWILIO_PHONE_NUMBER.startsWith('+') ? TWILIO_PHONE_NUMBER : `+${TWILIO_PHONE_NUMBER.replace(/[^\d]/g, '')}`)
    : undefined;

  if (fromFormatted && toFormatted === fromFormatted) {
    const err = new Error("Cannot send to same number as sender");
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
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } },
    });

    const { guyName, guyPhone, periodDate, cycleLength, spamMode, dryRun }: PeriodTrackerRequest = await req.json();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(guyPhone);
    if (!phoneValidation.valid) {
      return new Response(
        JSON.stringify({ error: phoneValidation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    const formattedPhone = phoneValidation.formatted;

    // Check rate limit
    const rateLimitCheck = await checkRateLimit(supabase, formattedPhone);
    if (!rateLimitCheck.allowed && !dryRun) {
      return new Response(
        JSON.stringify({ error: rateLimitCheck.error }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check user role and SMS usage
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    
    const isTester = roles?.some(r => r.role === "tester");
    
    // Check SMS usage for testers
    if (isTester) {
      const { data: smsUsage } = await supabase
        .from("sms_usage")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_free_message", true);
      
      const hasUsedFreeSms = (smsUsage?.length || 0) > 0;
      
      if (hasUsedFreeSms && !dryRun) {
        return new Response(
          JSON.stringify({
            error: "Testers get 1 free SMS. You've used yours.",
            testerLimit: true,
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    console.log("Setting up period tracker for:", guyName, formattedPhone);

    // Calculate reminder dates
    const periodStartDate = new Date(periodDate);
    const threeDaysBefore = new Date(periodStartDate);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
    
    const oneDayBefore = new Date(periodStartDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    // Dry run - don't send SMS
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
      const spamMessages = [
        `${guyName}, heads up! 🚨`,
        `Stock up on chocolate NOW 🍫`,
        `Get a heating pad ready 🔥`,
      ];

      await sendSMS(formattedPhone, `${guyName}, REVENGE MODE! You'll get texts. Good luck! 💣`);
      
      for (let i = 0; i < Math.min(3, spamMessages.length); i++) {
        await sendSMS(formattedPhone, spamMessages[i]);
      }

      console.log(`SPAM MODE: Sent messages to ${guyName}`);
    } else {
      // Normal mode
      const confirmationMessage = `Hey ${guyName}! You're subscribed to Period Tracker alerts. You'll get reminders 3 days before, 1 day before, and on the day. 💪`;
      
      await sendSMS(formattedPhone, confirmationMessage);

      // Record phone send for rate limiting
      await recordPhoneSend(supabase, formattedPhone);

      // Log SMS usage
      await supabase.from("sms_usage").insert({
        user_id: user.id,
        phone_number: formattedPhone,
        message_type: "period_tracker_setup",
        is_free_message: isTester,
        status: "sent",
      });

      console.log(`Scheduled reminders for ${guyName}`);
    }

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