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
      const val = settings[s.key] || "";
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
        {defaultSettings.map((s) => (
          <div key={s.key}>
            <label className="text-sm font-medium mb-2 block">{s.label}</label>
            <input
              value={settings[s.key] || ""}
              onChange={(e) => setSettings({ ...settings, [s.key]: e.target.value })}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        ))}
        <Button variant="hero" onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
