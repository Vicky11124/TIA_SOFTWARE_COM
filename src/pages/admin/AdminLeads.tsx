import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    supabase.from("leads").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setLeads(data);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success("Status updated");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Leads & Inquiries</h1>
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{lead.name}</h3>
                <p className="text-sm text-muted-foreground">{lead.email} {lead.phone && `• ${lead.phone}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            {lead.message && <p className="text-sm text-muted-foreground">{lead.message}</p>}
            <p className="text-xs text-muted-foreground mt-3">
              {new Date(lead.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
        {leads.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No leads yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
