import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Image, CreditCard, BookOpen } from "lucide-react";

const LOCAL_STORAGE_KEY = "tia_fallback_blogs";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ leads: 0, banners: 0, plans: 0, blogs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      let blogsCount = 0;
      try {
        const { count, error } = await supabase
          .from("blogs")
          .select("id", { count: "exact", head: true });
        
        if (error) {
          if (error.code === "42P01") {
            const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
            blogsCount = localData ? JSON.parse(localData).length : 1;
          } else {
            throw error;
          }
        } else {
          blogsCount = count || 0;
        }
      } catch (err) {
        console.error("Error fetching blogs count:", err);
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        blogsCount = localData ? JSON.parse(localData).length : 1;
      }

      const [leads, banners, plans] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("banners").select("id", { count: "exact", head: true }),
        supabase.from("plans").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        leads: leads.count || 0,
        banners: banners.count || 0,
        plans: plans.count || 0,
        blogs: blogsCount,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Leads", value: stats.leads, icon: MessageSquare, color: "text-primary" },
    { label: "Active Banners", value: stats.banners, icon: Image, color: "text-primary" },
    { label: "Active Plans", value: stats.plans, icon: CreditCard, color: "text-primary" },
    { label: "Total Blogs", value: stats.blogs, icon: BookOpen, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon size={24} className={card.color} />
            </div>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-sm text-muted-foreground">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
