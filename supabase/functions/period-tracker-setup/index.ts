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
const MIN_COOLDOWN_MINUTES = 60; // 1 hour between sends to same number

// Validate phone number format (E.164)
const validatePhoneNumber = (phone: string): { valid: boolean; formatted: string; error?: string } => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  if (!cleaned.startsWith('+')) {
    return { valid: false,