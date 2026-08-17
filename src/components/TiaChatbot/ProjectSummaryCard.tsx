import { LeadState } from "@/services/aiTypes";
import { Check, Hourglass, ClipboardList, ShieldCheck, Sparkles, Zap } from "lucide-react";

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

  // Calculate filled key fields (excluding features)
  const keyFields = [leadState.service, leadState.businessType, leadState.pages, leadState.budget, leadState.timeline];
  const filledCount = keyFields.filter(Boolean).length;
  
  // Calculate recommendation confidence percentage
  const confidence = filledCount === 0 ? 0 
    : filledCount === 1 ? 35 
    : filledCount === 2 ? 55 
    : filledCount === 3 ? 75 
    : filledCount === 4 ? 90 
    : 98;

  // Build the ascii confidence bar: █████████░
  const totalBlocks = 10;
  const filledBlocks = Math.round((confidence / 100) * totalBlocks);
  const confidenceBar = "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);

  const isProposalReady = filledCount === 5;

  // Dynamic details based on selected service
  const getProposalDetails = () => {
    const s = leadState.service || "Website";
    if (s.includes("App")) {
      return {
        solution: "Custom Mobile Application",
        standardInclusions: [
          "Native iOS & Android Layouts",
          "Secure User Auth & Database Connection",
          "Push Notification System Setup",
          "App Store & Google Play Store Submission Assistance",
          "TIA Premium Performance Tuning",
        ]
      };
    }
    if (s.includes("Marketing")) {
      return {
        solution: "Professional Digital Growth Campaign",
        standardInclusions: [
          "Meta & Google Ads Pixel Tracking Setup",
          "Monthly Analytics Performance Reports",
          "SEO Audit & Keyword Integration Plan",
          "High-Converting Landing Page Setup",
          "Direct WhatsApp Retargeting Leads Funnel",
        ]
      };
    }
    if (s.includes("Branding")) {
      return {
        solution: "Corporate Identity & Branding Package",
        standardInclusions: [
          "Premium High-Resolution Vector Logos",
          "Complete Brand Guide & Color Palettes",
          "Social Media Kit & Banner Graphic Templates",
          "Business Card & Stationery Design Templates",
          "Typography & Asset Guidelines Documentation",
        ]
      };
    }
    if (s.includes("Design")) {
      return {
        solution: "High-Fidelity UI/UX Design Project",
        standardInclusions: [
          "Interactive Figma Prototype Link",
          "Complete Component & Design System Styles",
          "Detailed User Journey & Wireframes",
          "Desktop, Tablet, and Mobile Responsive Artboards",
          "Developer-Ready Asset Handover Pack",
        ]
      };
    }
    if (s.includes("Automation")) {
      return {
        solution: "Smart AI Automation & Workflow",
        standardInclusions: [
          "Customer Service Chatbot Integration",
          "Dynamic CRM & Lead Routing Automation",
          "Multi-Channel API & Webhook Automations",
          "Automated Email & WhatsApp Notifications Setup",
          "AI Model Fine-Tuning & Knowledge Base Training",
        ]
      };
    }
    // Default to Website
    return {
      solution: "High-Performance Business Website",
      standardInclusions: [
        "Premium Responsive UI Layout (Mobile + Desktop)",
        "Core Search Engine Optimization (SEO) Core Setup",
        "TIA Ultra-Fast Performance Tuning",
        "Secure SSL & Domain Integration",
        "Analytics Dashboard Setup",
      ]
    };
  };

  const proposal = getProposalDetails();

  return (
    <div className="glass-card p-3 border border-border/80 bg-card/45 rounded-xl text-[10px] shadow-sm select-none mb-3 space-y-2.5 transition-all duration-300">
      <div className="flex items-center justify-between text-[9px] font-bold uppercase text-primary">
        <div className="flex items-center gap-1.5">
          <ClipboardList size={11} />
          <span>Project Profile</span>
        </div>
        {leadState.service && (
          <div className="flex items-center gap-1 text-emerald-500 font-mono tracking-tight normal-case">
            <Sparkles size={9} />
            <span>Confidence: {confidence}%</span>
          </div>
        )}
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-center min-w-0 border-b border-border/20 pb-0.5">
            <span className="text-muted-foreground">{item.label}</span>
            <div 
              className="flex items-center gap-0.5 truncate max-w-[70%] text-foreground font-semibold"
              title={item.isFilled && item.value ? String(item.value) : "Pending"}
            >
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

      {/* Recommendation Confidence bar */}
      {leadState.service && (
        <div className="pt-1.5 flex flex-col gap-1 border-t border-border/30">
          <div className="flex justify-between items-center text-[8px] text-muted-foreground font-mono">
            <span>Recommendation Confidence</span>
            <span>{confidenceBar}</span>
          </div>
        </div>
      )}

      {/* Interactive Proposal Summary (only when complete) */}
      {isProposalReady && (
        <div className="mt-2.5 p-2.5 bg-primary/5 border border-primary/20 rounded-lg space-y-2 animate-fade-in">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary uppercase">
            <ShieldCheck size={12} className="text-primary animate-pulse" />
            <span>Tia Custom Proposal Offered</span>
          </div>

          <div className="space-y-1 text-[9px] border-b border-border/35 pb-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Solution:</span>
              <span className="font-bold text-foreground text-right">{proposal.solution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scale:</span>
              <span className="font-bold text-foreground">{leadState.pages || "Standard scale"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timeline:</span>
              <span className="font-bold text-foreground">{leadState.timeline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Investment:</span>
              <span className="font-bold text-emerald-500 text-right">{leadState.budget}</span>
            </div>
          </div>

          {/* Inclusions checklist */}
          <div className="space-y-1 pt-0.5">
            <span className="text-[8px] font-bold text-muted-foreground uppercase flex items-center gap-0.5">
              <Zap size={9} />
              <span>Standard Premium Inclusions:</span>
            </span>
            <ul className="space-y-0.5">
              {proposal.standardInclusions.map((inc, i) => (
                <li key={i} className="flex items-start gap-1 text-[8.5px] text-foreground/80 leading-normal">
                  <Check size={8} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{inc}</span>
                </li>
              ))}
              {leadState.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-1 text-[8.5px] text-primary leading-normal font-medium">
                  <Check size={8} className="text-primary mt-0.5 shrink-0" />
                  <span>Custom Feature: {feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSummaryCard;
