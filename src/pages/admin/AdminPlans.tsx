import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price: string;
  price_usd: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
};

const AdminPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPlans = async () => {
    const { data } = await supabase.from("plans").select("*").order("sort_order");
    if (data) setPlans(data);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = async (plan: Omit<Plan, "id"> & { id?: string }) => {
    if (plan.id) {
      const { error } = await supabase.from("plans").update(plan).eq("id", plan.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Plan updated");
    } else {
      const { error } = await supabase.from("plans").insert(plan);
      if (error) { toast.error(error.message); return; }
      toast.success("Plan created");
    }
    setShowForm(false);
    setEditing(null);
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await supabase.from("plans").delete().eq("id", id);
    toast.success("Plan deleted");
    fetchPlans();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Plans Manager</h1>
        <Button variant="hero" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={18} className="mr-2" /> Add Plan
        </Button>
      </div>

      {showForm && (
        <PlanForm
          initial={editing || { name: "", price: "", price_usd: "", features: [], is_popular: false, is_active: true, sort_order: plans.length }}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="space-y-4">
        {plans.map((p) => (
          <div key={p.id} className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-medium flex items-center gap-2">
                {p.name} — 🇬🇧 £{p.price} / 🇺🇸 ${p.price_usd || "—"}
                {p.is_popular && <Star size={14} className="text-primary fill-primary" />}
              </div>
              <div className="text-sm text-muted-foreground">{p.features.length} features</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {p.is_active ? "Active" : "Inactive"}
            </span>
            <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-muted-foreground hover:text-foreground">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlanForm = ({ initial, onSave, onCancel }: {
  initial: Omit<Plan, "id"> & { id?: string };
  onSave: (p: Omit<Plan, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(initial);
  const [newFeature, setNewFeature] = useState("");

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm({ ...form, features: [...form.features, newFeature.trim()] });
    setNewFeature("");
  };

  const removeFeature = (i: number) => {
    setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="glass-card p-6 mb-8 space-y-4">
      <h2 className="text-lg font-bold">{initial.id ? "Edit" : "New"} Plan</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">🇬🇧 Price (£)</label>
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">🇺🇸 Price ($)</label>
          <input value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: e.target.value })}
            className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Features</label>
        <div className="space-y-2 mb-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="flex-1 bg-muted/30 px-3 py-1.5 rounded">{f}</span>
              <button onClick={() => removeFeature(i)} className="text-destructive text-xs">Remove</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add feature..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <Button variant="hero-outline" onClick={addFeature} type="button">Add</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} />
          Most Popular
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active
        </label>
      </div>
      <div className="flex gap-3">
        <Button variant="hero" onClick={() => onSave(form)}>Save</Button>
        <Button variant="hero-outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default AdminPlans;
