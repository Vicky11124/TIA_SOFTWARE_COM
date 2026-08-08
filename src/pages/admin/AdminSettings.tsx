import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const defaultSettings = [
  { key: "whatsapp_number", label: "WhatsApp Number" },
  { key: "email", label: "Contact Email" },
  { key: "phone", label: "Phone Number" },
  { key: "address", label: "Address" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "facebook_url", label: "Facebook URL" },
];

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("*").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((d) => { map[d.key] = d.value; });
        setSettings(map);
      }
    });
  }, []);

  const handleSave = async () => {
    for (const s of defaultSettings) {
      let val = settings[s.key] || "";
      if (s.key === "phone") val = "+44 7451 255217";
      if (s.key === "whatsapp_number") val = "447451255217";
      const existing = await supabase.from("site_settings").select("id").eq("key", s.key).maybeSingle();
      if (existing.data) {
        await supabase.from("site_settings").update({ value: val }).eq("key", s.key);
      } else {
        await supabase.from("site_settings").insert({ key: s.key, value: val });
      }
    }
    toast.success("Settings saved");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Site Settings</h1>
      <div className="glass-card p-6 space-y-4 max-w-2xl">
        {defaultSettings.map((s) => {
          const isLocked = s.key === "phone" || s.key === "whatsapp_number";
          const lockedValue = s.key === "phone" ? "+44 7451 255217" : "447451255217";
          return (
            <div key={s.key}>
              <label className="text-sm font-medium mb-2 block">{s.label}</label>
              <input
                value={isLocked ? lockedValue : (settings[s.key] || "")}
                disabled={isLocked}
                onChange={(e) => setSettings({ ...settings, [s.key]: e.target.value })}
                className={`w-full border border-border rounded-lg px-4 py-2.5 text-sm transition-all ${
                  isLocked 
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-80" 
                    : "bg-muted/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                }`}
              />
              {isLocked && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  This is the official locked contact number. No overrides allowed.
                </p>
              )}
            </div>
          );
        })}
        <Button variant="hero" onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
