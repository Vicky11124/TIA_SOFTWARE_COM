import { LeadState } from "@/services/aiProvider";
import { Check, Hourglass, ClipboardList } from "lucide-react";

interface ProjectSummaryCardProps {
  leadState: LeadState;
}

const ProjectSummaryCard = ({ leadState }: ProjectSummaryCardProps) => {
  const items = [
    { label: "Service", value: leadState.service, isFilled: !!leadState.service },
    { label: "Business", value: leadState.businessType, isFilled: !!leadState.businessType },
    { label: "Features", value: leadState.features?.length > 0 ? leadState.features.join(", ") : null, isFilled: leadState.features?.length > 0 },
    { label: "Budget", value: leadState.budget, isFilled: !!leadState.budget },
    { label: "Timeline", value: leadState.timeline, isFilled: !!leadState.timeline },
  ];

  return (
    <div className="glass-card p-3.5 mb-4 border border-border/80 bg-card/65 backdrop-blur-sm rounded-xl text-xs shadow-md select-none animate-fade-in">
      <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-border/40 text-primary font-bold tracking-wide uppercase text-[10px]">
        <ClipboardList size={14} />
        <span>📋 Project Profile</span>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground font-medium">{item.label}</span>
            <div className="flex items-center gap-1 text-right max-w-[65%] min-w-0">
              <span className="truncate text-foreground font-semibold">
                {item.isFilled ? item.value : "Pending"}
              </span>
              {item.isFilled ? (
                <Check size={11} className="text-emerald-500 shrink-0" />
              ) : (
                <Hourglass size={11} className="text-amber-500 shrink-0 animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSummaryCard;
