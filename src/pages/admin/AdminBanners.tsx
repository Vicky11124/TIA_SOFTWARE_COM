import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
};

const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order");
    if (data) setBanners(data);
  };

  useEffect(() => { fetchBanners(); }, []);

  const emptyBanner: Omit<Banner, "id"> = {
    title: "", subtitle: "", highlight: "", description: "",
    image_url: "", cta_text: "Book Now", cta_link: "https://wa.me/447418378044",
    sort_order: banners.length, is_active: true,
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("banners").upload(path, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return null;
    }
    const { data } = supabase.storage.from("banners").getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSave = async (banner: Omit<Banner, "id"> & { id?: string }) => {
    if (banner.id) {
      const { error } = await supabase.from("banners").update(banner).eq("id", banner.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Banner updated");
    } else {
      const { error } = await supabase.from("banners").insert(banner);
      if (error) { toast.error(error.message); return; }
      toast.success("Banner created");
    }
    setShowForm(false);
    setEditing(null);
    fetchBanners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    toast.success("Banner deleted");
    fetchBanners();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Banner Manager</h1>
        <Button variant="hero" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={18} className="mr-2" /> Add Banner
        </Button>
      </div>

      {showForm && (
        <BannerForm
          initial={editing || emptyBanner}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onUpload={handleImageUpload}
          uploading={uploading}
        />
      )}

      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id} className="glass-card p-4 flex items-center gap-4">
            <GripVertical size={18} className="text-muted-foreground shrink-0" />
            {b.image_url && (
              <img src={b.image_url} alt="" className="w-24 h-14 object-cover rounded-lg shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{b.title} {b.highlight}</div>
              <div className="text-sm text-muted-foreground truncate">{b.subtitle}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${b.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {b.is_active ? "Active" : "Inactive"}
            </span>
            <button onClick={() => { setEditing(b); setShowForm(true); }} className="text-muted-foreground hover:text-foreground">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No banners yet. Click "Add Banner" to create one.</p>
        )}
      </div>
    </div>
  );
};

const BannerForm = ({
  initial,
  onSave,
  onCancel,
  onUpload,
  uploading,
}: {
  initial: Omit<Banner, "id"> & { id?: string };
  onSave: (b: Omit<Banner, "id"> & { id?: string }) => void;
  onCancel: () => void;
  onUpload: (f: File) => Promise<string | null>;
  uploading: boolean;
}) => {
  const [form, setForm] = useState(initial);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUpload(file);
    if (url) setForm({ ...form, image_url: url });
  };

  return (
    <div className="glass-card p-6 mb-8 space-y-4">
      <h2 className="text-lg font-bold">{initial.id ? "Edit" : "New"} Banner</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Highlight Text" value={form.highlight} onChange={(v) => setForm({ ...form, highlight: v })} />
        <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <Input label="CTA Text" value={form.cta_text} onChange={(v) => setForm({ ...form, cta_text: v })} />
        <Input label="CTA Link" value={form.cta_link} onChange={(v) => setForm({ ...form, cta_link: v })} />
        <Input label="Sort Order" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} type="number" />
        <div>
          <label className="text-sm font-medium mb-2 block">Banner Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-muted-foreground" />
          {uploading && <span className="text-xs text-primary">Uploading...</span>}
          {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        Active
      </label>
      <div className="flex gap-3">
        <Button variant="hero" onClick={() => onSave(form)}>Save</Button>
        <Button variant="hero-outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <label className="text-sm font-medium mb-2 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
    />
  </div>
);

export default AdminBanners;
