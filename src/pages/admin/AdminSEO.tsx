import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const pages = ["home", "about", "services", "plans", "contact"];

type SEO = {
  id?: string;
  page_slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
};

const AdminSEO = () => {
  const [seoData, setSeoData] = useState<Record<string, SEO>>({});
  const [active, setActive] = useState("home");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("seo_settings").select("*");
      if (data) {
        const map: Record<string, SEO> = {};
        data.forEach((d) => {
          map[d.page_slug] = {
            id: d.id,
            page_slug: d.page_slug,
            meta_title: d.meta_title || "",
            meta_description: d.meta_description || "",
            meta_keywords: d.meta_keywords || "",
            og_title: d.og_title || "",
            og_description: d.og_description || "",
            og_image: d.og_image || "",
          };
        });
        setSeoData(map);
      }
    };
    fetch();
  }, []);

  const current = seoData[active] || {
    page_slug: active, meta_title: "", meta_description: "",
    meta_keywords: "", og_title: "", og_description: "", og_image: "",
  };

  const handleSave = async () => {
    if (current.id) {
      const { error } = await supabase.from("seo_settings").update(current).eq("id", current.id);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from("seo_settings").insert(current);
      if (error) { toast.error(error.message); return; }
    }
    toast.success("SEO settings saved");
  };

  const update = (key: keyof SEO, val: string) => {
    setSeoData({ ...seoData, [active]: { ...current, [key]: val } });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">SEO Manager</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              active === p ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="glass-card p-6 space-y-4">
        {(["meta_title", "meta_description", "meta_keywords", "og_title", "og_description", "og_image"] as const).map((field) => (
          <div key={field}>
            <label className="text-sm font-medium mb-2 block capitalize">{field.replace(/_/g, " ")}</label>
            {field === "meta_description" || field === "og_description" ? (
              <textarea
                value={current[field]}
                onChange={(e) => update(field, e.target.value)}
                rows={3}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            ) : (
              <input
                value={current[field]}
                onChange={(e) => update(field, e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}
          </div>
        ))}
        <Button variant="hero" onClick={handleSave}>Save SEO Settings</Button>
      </div>
    </div>
  );
};

export default AdminSEO;
