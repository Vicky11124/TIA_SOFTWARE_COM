import { ReportData, ReportExplanations, getFallbackExplanations } from "@/services/aiTypes";

interface ProjectConsultationReportProps {
  data: ReportData;
  explanations: ReportExplanations | null;
  onSubmittedSuccess?: (name: string, email: string) => void;
}

const ProjectConsultationReport: React.FC<ProjectConsultationReportProps> = ({
  data,
  explanations,
  onSubmittedSuccess
}) => {
  const { whatsappLink } = useSiteSettings();

  // Contact Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setSubmitting(true);
    try {
      const fullMessage = `[TIA PROJECT CONSULTATION REPORT]
Service: ${data.service}
Business Type: ${data.businessType}
Scope: ${data.scope}
Budget / Investment: ${data.budget}
Recommended Package: ${data.recommendedPackage.name} (${data.recommendedPackage.price})
Timeline: ${data.timeline}
Company: ${form.company || "N/A"}
Features: ${data.features.join(", ") || "Standard"}
Notes: ${form.notes || "None"}`;

      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: fullMessage,
        status: "new",
      });

      if (error) throw error;

      setSubmitted(true);
      if (onSubmittedSuccess) {
        onSubmittedSuccess(form.name.trim(), form.email.trim());
      }
    } catch (err) {
      console.error("Error submitting report inquiry:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyReport = () => {
    const activeExp = explanations || getFallbackExplanations(data);
    const reportText = `====================================================
PROJECT CONSULTATION REPORT — TIA SOFTWARE SOLUTIONS
====================================================
Status: ${data.status} (${data.readinessPercentage}% ${data.confidenceLevel})
Business: ${data.businessType}
Service: ${data.service}
Scope: ${data.scope}
Timeline: ${data.timeline}
Estimated Investment: ${data.budget}
Recommended Package: ${data.recommendedPackage.name} (${data.recommendedPackage.price})

EXECUTIVE SUMMARY
----------------
${activeExp.executiveSummary}

WHY THIS PACKAGE
----------------
${activeExp.whyThisPackage}

IMMEDIATE BENEFITS
------------------
${activeExp.immediateBenefits.map((b) => `• ${b}`).join("\n")}

LONG-TERM BENEFITS
------------------
${activeExp.longTermBenefits.map((b) => `• ${b}`).join("\n")}

NEXT STEPS
----------
${activeExp.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

CONTACT DETAILS
---------------
Phone: +44 7451 255217
Email: sales@tiasoftwaresolutions.com
`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const scrollToContactForm = () => {
    const el = document.getElementById("report-contact-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Build blocks for progress bar
  const totalBlocks = 10;
  const filledBlocks = Math.round((data.readinessPercentage / 100) * totalBlocks);
  const progressBarAscii = "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);

  return (
    <div className="w-full max-w-full bg-card/95 border border-primary/30 rounded-2xl shadow-xl overflow-hidden animate-fade-in my-3 text-xs">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center text-white shrink-0 border border-white/20">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="font-bold text-xs leading-tight tracking-wide uppercase flex items-center gap-1.5">
              Project Consultation Report
            </h3>
            <p className="text-[10px] text-white/80 font-medium">
              Prepared by TIA AI Digital Studio
            </p>
          </div>
        </div>
        <span className="text-[9px] bg-white/25 px-2 py-0.5 rounded font-mono font-bold tracking-tight">
          TIA-AI-REPORT
        </span>
      </div>

      <div className="p-3.5 space-y-4">
        
        {/* 2. Status & Readiness Bar */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>🟢 {data.status}</span>
            </div>
            <span className="text-primary font-mono text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">
              {data.confidenceLevel}
            </span>
          </div>

          <div className="space-y-1 pt-1 border-t border-border/40">
            <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
              <span>Project Readiness Score</span>
              <span className="font-bold text-foreground">{data.readinessPercentage}% ({progressBarAscii})</span>
            </div>
            <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${data.readinessPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Executive Summary */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/40 pb-1">
            <Sparkles size={13} className="text-primary" />
            <span>Executive Summary</span>
          </div>
          {explanations ? (
            <div className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/30 p-2.5 rounded-lg border border-border/30 animate-fade-in">
              {explanations.executiveSummary}
            </div>
          ) : (
            <div className="p-3 bg-muted/30 rounded-lg border border-border/30 space-y-2 animate-pulse">
              <div className="h-2.5 bg-primary/20 rounded w-3/4" />
              <div className="h-2.5 bg-muted-foreground/20 rounded w-full" />
              <div className="h-2.5 bg-muted-foreground/20 rounded w-5/6" />
            </div>
          )}
        </div>

        {/* 4. Project Specifications Table */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/40 pb-1">
            <Layers size={13} className="text-primary" />
            <span>Project Scope & Specifications</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-background p-2 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[9px]">Business Type</span>
              <span className="font-bold text-foreground truncate block">{data.businessType}</span>
            </div>
            <div className="bg-background p-2 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[9px]">Required Service</span>
              <span className="font-bold text-foreground truncate block">{data.service}</span>
            </div>
            <div className="bg-background p-2 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[9px]">Project Scope / Pages</span>
              <span className="font-bold text-foreground truncate block">{data.scope}</span>
            </div>
            <div className="bg-background p-2 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[9px]">Target Timeline</span>
              <span className="font-bold text-foreground truncate block">{data.timeline}</span>
            </div>
            <div className="bg-background p-2 rounded-lg border border-border/50 col-span-2 flex justify-between items-center">
              <div>
                <span className="text-muted-foreground block text-[9px]">Estimated Investment</span>
                <span className="font-bold text-emerald-500 text-xs">{data.budget}</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block text-[9px]">Recommended Tier</span>
                <span className="font-bold text-primary text-xs">{data.recommendedPackage.name}</span>
              </div>
            </div>
          </div>
          {data.features && data.features.length > 0 && (
            <div className="pt-1">
              <span className="text-[9.5px] font-semibold text-muted-foreground block mb-1">Custom Features Included:</span>
              <div className="flex flex-wrap gap-1">
                {data.features.map((f, i) => (
                  <span key={i} className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded-md font-medium">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Why This Package */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <ShieldCheck size={14} />
            <span>Why {data.recommendedPackage.name} ({data.recommendedPackage.price})</span>
          </div>
          {explanations ? (
            <p className="text-[10.5px] text-foreground/90 leading-relaxed animate-fade-in">
              {explanations.whyThisPackage}
            </p>
          ) : (
            <div className="space-y-1.5 animate-pulse pt-1">
              <div className="h-2.5 bg-primary/20 rounded w-5/6" />
              <div className="h-2.5 bg-muted-foreground/20 rounded w-3/4" />
            </div>
          )}
        </div>

        {/* 6. Immediate Business Benefits */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/40 pb-1">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>Immediate Business Benefits</span>
          </div>
          {explanations ? (
            <ul className="space-y-1 text-[10.5px] animate-fade-in">
              {explanations.immediateBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-foreground/80 leading-snug">
                  <Check size={11} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-1.5 animate-pulse">
              <div className="h-2.5 bg-emerald-500/20 rounded w-5/6" />
              <div className="h-2.5 bg-emerald-500/20 rounded w-4/5" />
              <div className="h-2.5 bg-emerald-500/20 rounded w-3/4" />
            </div>
          )}
        </div>

        {/* 7. Long-Term Business Benefits */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/40 pb-1">
            <TrendingUp size={13} className="text-primary" />
            <span>Long-Term Business Benefits</span>
          </div>
          {explanations ? (
            <ul className="space-y-1 text-[10.5px] animate-fade-in">
              {explanations.longTermBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-foreground/80 leading-snug">
                  <Sparkles size={11} className="text-primary mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-1.5 animate-pulse">
              <div className="h-2.5 bg-primary/20 rounded w-5/6" />
              <div className="h-2.5 bg-primary/20 rounded w-4/5" />
              <div className="h-2.5 bg-primary/20 rounded w-3/4" />
            </div>
          )}
        </div>

        {/* 8. Potential Considerations */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/40 pb-1">
            <Lightbulb size={13} className="text-amber-500" />
            <span>Strategic Industry Considerations</span>
          </div>
          {explanations ? (
            <ul className="space-y-1 text-[10.5px] animate-fade-in">
              {explanations.potentialConsiderations.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-foreground/80 leading-snug">
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-1.5 animate-pulse">
              <div className="h-2.5 bg-amber-500/20 rounded w-4/5" />
              <div className="h-2.5 bg-amber-500/20 rounded w-3/4" />
            </div>
          )}
        </div>

        {/* 9. Future Growth Opportunities */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/40 pb-1">
            <Compass size={13} className="text-indigo-500" />
            <span>Future Growth Opportunities</span>
          </div>
          {explanations ? (
            <div className="flex flex-wrap gap-1.5 animate-fade-in">
              {explanations.futureGrowth.map((g, i) => (
                <span key={i} className="bg-muted text-foreground/90 border border-border px-2 py-1 rounded-md text-[9.5px] font-medium">
                  🚀 {g}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex gap-1.5 animate-pulse">
              <div className="h-5 bg-muted rounded-md w-24" />
              <div className="h-5 bg-muted rounded-md w-28" />
            </div>
          )}
        </div>

        {/* 10. Next Steps Roadmap */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border/40 pb-1">
            <Clock size={13} className="text-primary" />
            <span>Recommended Next Steps</span>
          </div>
          {explanations ? (
            <ol className="space-y-1 text-[10.5px] animate-fade-in">
              {explanations.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground/90 leading-snug">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="space-y-1.5 animate-pulse">
              <div className="h-2.5 bg-primary/20 rounded w-full" />
              <div className="h-2.5 bg-primary/20 rounded w-5/6" />
              <div className="h-2.5 bg-primary/20 rounded w-4/5" />
            </div>
          )}
        </div>

        {/* 11. Contact Details Banner */}
        <div className="bg-muted/50 rounded-xl p-2.5 border border-border/60 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px]">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone size={12} className="text-primary" />
            <span>+44 7451 255217</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Mail size={12} className="text-primary" />
            <span>sales@tiasoftwaresolutions.com</span>
          </div>
        </div>

        {/* 12. Embedded Contact Form */}
        <div id="report-contact-form" className="bg-background rounded-xl p-3 border border-primary/30 space-y-2.5">
          <div className="border-b border-border/60 pb-1.5">
            <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
              <Calendar size={13} className="text-primary" />
              <span>Request Detailed Quotation & Meeting</span>
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Submit your details to lock in this consultation report and receive an itemized proposal.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-1 animate-scale-up">
              <CheckCircle2 size={24} className="text-emerald-500 mx-auto" />
              <h5 className="font-bold text-xs text-foreground">Consultation Request Received!</h5>
              <p className="text-[10.5px] text-muted-foreground">
                Thank you {form.name}! Our lead solutions consultant will prepare your proposal and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-semibold text-muted-foreground block mb-0.5">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-muted-foreground block mb-0.5">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-semibold text-muted-foreground block mb-0.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+44 7451 ..."
                    className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-muted-foreground block mb-0.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Company Ltd."
                    className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9.5px] font-semibold text-muted-foreground block mb-0.5">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any specific design guidelines or launch deadlines..."
                  className="w-full bg-card border border-border rounded-lg px-2.5 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || !form.name.trim() || !form.email.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-md"
              >
                {submitting ? "Sending Report..." : "Request Detailed Quotation"}
                <Send size={12} />
              </Button>
            </form>
          )}
        </div>

        {/* 13. Bottom Action Buttons */}
        <div className="pt-2 border-t border-border/40 space-y-2 select-none">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={scrollToContactForm}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10.5px] py-1.5 h-auto rounded-lg flex items-center justify-center gap-1 shadow-sm"
            >
              <Calendar size={12} />
              <span>Schedule Consultation</span>
            </Button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_40%)] text-white font-bold text-[10.5px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-colors"
            >
              <MessageCircle size={12} />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyReport}
              className="flex-1 text-[10px] h-7 border-border hover:bg-muted font-medium flex items-center justify-center gap-1"
            >
              {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              <span>{copied ? "Copied!" : "Copy Report"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-[9.5px] h-7 border-border/50 text-muted-foreground/60 cursor-not-allowed flex items-center gap-1"
            >
              <Download size={10} />
              <span>PDF (Soon)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-[9.5px] h-7 border-border/50 text-muted-foreground/60 cursor-not-allowed flex items-center gap-1"
            >
              <Mail size={10} />
              <span>Email (Soon)</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectConsultationReport;
