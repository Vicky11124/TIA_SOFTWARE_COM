import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const defaults: Record<string, string> = {
  whatsapp_number: "447418378044",
  email: "sales@tiasoftwaresolutions.com",
  phone: "+44 7520 641068",
  address: "London, United Kingdom",
  instagram_url: "https://www.instagram.com/tiasoftwaresolutions/",
  facebook_url: "https://www.facebook.com/profile.php?id=61578643118286",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_settings").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        const map = { ...defaults };
        data.forEach((d) => { if (d.value) map[d.key] = d.value; });
        setSettings(map);
      }
      setLoading(false);
    });
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp_number?.replace(/[^0-9]/g, "")}`;

  return { settings, loading, whatsappLink };
}
