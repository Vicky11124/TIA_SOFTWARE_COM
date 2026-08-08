import { useEffect, useState } from "react";

const defaults: Record<string, string> = {
  whatsapp_number: "447451255217",
  email: "sales@tiasoftwaresolutions.com",
  phone: "+44 7451 255217",
  address: "London, United Kingdom",
  instagram_url: "https://www.instagram.com/tiasoftwaresolutions/",
  facebook_url: "https://www.facebook.com/profile.php?id=61578643118286",
  linkedin_url: "https://www.linkedin.com/company/tia-softwares-solutions/",
};

// Singleton cache to deduplicate parallel component mounts and avoid redundant database hits
let cachedSettingsPromise: Promise<Record<string, string>> | null = null;
let cachedSettings: Record<string, string> | null = null;

function fetchSettings(): Promise<Record<string, string>> {
  if (cachedSettings) return Promise.resolve(cachedSettings);
  if (!cachedSettingsPromise) {
    cachedSettingsPromise = import("@/integrations/supabase/client").then(({ supabase }) =>
      supabase
        .from("site_settings")
        .select("*")
        .then(({ data }) => {
          const map = { ...defaults };
          if (data && data.length > 0) {
            data.forEach((d) => {
              if (d.value) map[d.key] = d.value;
            });
          }
          cachedSettings = map;
          return map;
        })
    );
  }
  return cachedSettingsPromise;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(cachedSettings || defaults);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    let active = true;
    fetchSettings().then((map) => {
      if (active) {
        setSettings(map);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp_number?.replace(/[^0-9]/g, "")}`;

  return { settings, loading, whatsappLink };
}
