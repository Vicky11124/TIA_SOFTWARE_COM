import { createClient } from '@supabase/supabase-js';

const OLD_URL = "https://dabsuflxmuafjfemxrtc.supabase.co";
const OLD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhYnN1Zmx4bXVhZmpmZW14cnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDExMTIsImV4cCI6MjA5MDUxNzExMn0.ayVDcsb_KOntc-BpCTcjwwF46p5Al0a4cuUZFzBQeOo";

const NEW_URL = "https://tuixjvdojimkhtfilxce.supabase.co";
const NEW_KEY = "sb_publishable_Vd_j-5Sv89WukkAzSZkRUw_uu99NXhz";

const oldSupabase = createClient(OLD_URL, OLD_KEY);
const newSupabase = createClient(NEW_URL, NEW_KEY);

const tables = [
  'banners',
  'leads',
  'plans',
  'seo_settings',
  'site_settings',
  'blogs'
];

async function migrate() {
  console.log("Starting data migration from old Supabase to new Supabase...\n");

  for (const table of tables) {
    console.log(`Fetching table '${table}' from old Supabase...`);
    const { data, error } = await oldSupabase.from(table).select('*');
    
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      continue;
    }

    console.log(`Found ${data ? data.length : 0} rows in '${table}'.`);

    if (data && data.length > 0) {
      console.log(`Inserting ${data.length} rows into new Supabase '${table}'...`);
      const { data: insertedData, error: insertError } = await newSupabase.from(table).upsert(data);
      if (insertError) {
        console.error(`Error inserting into new ${table}:`, insertError.message);
      } else {
        console.log(`Successfully migrated '${table}'.`);
      }
    }
    console.log("-----------------------------------");
  }

  console.log("Migration script finished.");
}

migrate();
