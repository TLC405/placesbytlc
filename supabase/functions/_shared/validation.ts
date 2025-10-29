// Shared validation schemas and helpers
export { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const validateCity = (city: string): string => {
  if (!city || city.trim().length === 0) {
    throw new Error("City is required");
  }
  if (city.length > 100) {
    throw new Error("City name too long");
  }
  // Only allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(city)) {
    throw new Error("Invalid city name format");
  }
  return city.trim();
};

export const validateQuery = (query?: string): string => {
  if (!query) return "";
  if (query.length > 200) {
    throw new Error("Query too long");
  }
  // Remove special characters that could be used for injection
  return query.replace(/[<>\"'`]/g, "").trim();
};

export const sanitizeForSQL = (input: string): string => {
  // Remove SQL wildcards
  return input.replace(/[%_]/g, "");
};
