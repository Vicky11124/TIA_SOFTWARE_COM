import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadCaptureFormProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const BUDGET_OPTIONS = [
  { label: "Less than £500 ($500 / A$700)", value: "< £500 / $500 / A$700" },
  { label: "£500 - £2,000 ($500 - $2,000)", value: "£500 - £2,000" },
  { label: "£2,000 - £5,000 ($2,000 - $5,000)", value: "£2,000 - £5,000" },
  { label: "£5,000+ ($5,000+)", value: "£5,000+" },
];

const TIMELINE_OPTIONS = [
  { label: "Urgent (< 1 month)", value: "Urgent (< 1 month)" },
  { label: "Standard (1 - 3 months)", value: "Standard (1 - 3 months)" },
  { label: "Flexible (3+ months)", value: "Flexible (3+ months)" },
];

const LeadCaptureForm = ({ onSubmitSuccess, onCancel }: LeadCaptureFormProps) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
    budget: "",
    timeline: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => {
    if (step < 3) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const isStepValid = () => {
    if (step === 1) {
      return form.name.trim() !== "" && form.email.trim().includes("@");
    }
    if (step === 2) {
      return form.description.trim() !== "";
    }
    return form.budget !== "" && form.timeline !== "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;

    setSubmitting(true);

    try {
      const formattedMessage = `[AI CHATBOT LEAD]
Company: ${form.company.trim() || "N/A"}
Budget: ${form.budget}
Timeline: ${form.timeline}

Project Description:
${form.description.trim()}`;

      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: formattedMessage,
        status: "new",
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        onSubmitSuccess();
      }, 3000);
    } catch (err) {
      console.error("Error submitting lead:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-2xl border border-border/80 shadow-md animate-scale-up">
        <CheckCircle2 className="text-emerald-500 w-12 h-12 mb-4 animate-bounce" />
        <h4 className="font-bold text-foreground text-base mb-1">Lead Submitted!</h4>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
          Thank you! Our solutions experts will review your request and get in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-md p-5 flex flex-col gap-4 animate-fade-in">
      <div className="flex justify-between items-center pb-2 border-b border-border/60">
        <div>
          <h4 className="font-bold text-xs text-primary uppercase tracking-wider">
            Step {step} of 3
          </h4>
          <h3 className="font-semibold text-sm text-foreground">
            {step === 1 && "Basic Information"}
            {step === 2 && "Project Scope"}
            {step === 3 && "Budget & Timeline"}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                placeholder="+44 7451 ..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                Company Name
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                placeholder="Company/Startup Name"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                Project Description <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none"
                placeholder="Tell us what you'd like to build..."
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                Estimated Budget <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, budget: opt.value })}
                    className={`px-2 py-2 text-[10px] text-center font-medium border rounded-lg transition-colors ${
                      form.budget === opt.value
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                Timeline <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, timeline: opt.value })}
                    className={`flex-1 px-2 py-2 text-[10px] text-center font-medium border rounded-lg transition-colors ${
                      form.timeline === opt.value
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-border/60">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type="button"
              disabled={!isStepValid()}
              onClick={nextStep}
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              Next <ArrowRight size={12} />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isStepValid() || submitting}
              size="sm"
              className="text-xs flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground"
            >
              {submitting ? "Sending..." : "Submit Inquiry"}{" "}
              <Send size={12} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LeadCaptureForm;
