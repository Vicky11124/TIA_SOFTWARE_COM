import { createClient } from '@supabase/supabase-js';

const OLD_URL = "https://dabsuflxmuafjfemxrtc.supabase.co";
const OLD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhYnN1Zmx4bXVhZmpmZW14cnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDExMTIsImV4cCI6MjA5MDUxNzExMn0.ayVDcsb_KOntc-BpCTcjwwF46p5Al0a4cuUZFzBQeOo";

const oldSupabase = createClient(OLD_URL, OLD_KEY);

async function dumpData() {
  const plans = await oldSupabase.from('plans').select('*');
  const seo = await oldSupabase.from('seo_settings').select('*');
  const site = await oldSupabase.from('site_settings').select('*');

  console.log("=== PLANS ===");
  console.log(JSON.stringify(plans.data, null, 2));

  console.log("\n=== SEO SETTINGS ===");
  console.log(JSON.stringify(seo.data, null, 2));

  console.log("\n=== SITE SETTINGS ===");
  console.log(JSON.stringify(site.data, null, 2));
}

dumpData();
