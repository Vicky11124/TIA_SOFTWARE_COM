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
    <div className="glass-card p-2.5 border border-border/80 bg-card/45 rounded-xl text-[10px] shadow-sm select-none mb-2">
      <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary uppercase mb-1.5">
        <ClipboardList size={11} />
        <span>Project Profile</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-center min-w-0">
            <span className="text-muted-foreground">{item.label}</span>
            <div className="flex items-center gap-0.5 truncate max-w-[70%] text-foreground font-semibold">
              <span className="truncate">{item.isFilled ? item.value : "Pending"}</span>
              {item.isFilled ? (
                <Check size={9} className="text-emerald-500 shrink-0" />
              ) : (
                <Hourglass size={9} className="text-amber-500 shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSummaryCard;
