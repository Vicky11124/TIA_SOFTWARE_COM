import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadState } from "@/services/aiTypes";

import { validateFormSecurity, recordFormSubmission } from "@/utils/formSecurity";
import { toast } from "sonner";

interface ContactFormInlineProps {
  leadState: LeadState;
  onSubmitSuccess: (name: string, email: string, phone: string) => void;
}

const ContactFormInline = ({ leadState, onSubmitSuccess }: ContactFormInlineProps) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [websiteHp, setWebsiteHp] = useState("");
  const [formLoadTime] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const secCheck = validateFormSecurity({
      honeypotValue: websiteHp,
      formLoadTime,
      email: form.email,
    });

    if (secCheck.isBot) {
      setSubmitted(true);
      return;
    }

    if (!secCheck.isValid) {
      toast.error(secCheck.error || "Invalid submission.");
      return;
    }

    setSubmitting(true);
    try {
      const formattedMessage = `[TIA AI CONVERSATIONAL ASSISTANT]
Service: ${leadState.service || "N/A"}
Business Type: ${leadState.businessType || "N/A"}
Pages/Size: ${leadState.pages || "N/A"}
Features: ${leadState.features?.length > 0 ? leadState.features.join(", ") : "N/A"}
Budget: ${leadState.budget || "N/A"}
Timeline: ${leadState.timeline || "N/A"}`;

      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: formattedMessage,
        status: "new",
      });

      if (error) throw error;

      recordFormSubmission();
      setSubmitted(true);
      setTimeout(() => {
        onSubmitSuccess(form.name.trim(), form.email.trim(), form.phone.trim());
      }, 2000);
    } catch (err) {
      console.error("Error saving lead:", err);
      toast.error("Error saving lead. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-card rounded-2xl border border-border/80 shadow-md animate-scale-up select-none">
        <CheckCircle2 className="text-emerald-500 w-10 h-10 mb-3 animate-bounce" />
        <h4 className="font-bold text-foreground text-sm mb-1">Inquiry Submitted!</h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px]">
          We have successfully sent your request to our team. Expect our proposal soon!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-md p-4 flex flex-col gap-3 animate-fade-in">
      <div className="pb-1.5 border-b border-border/60">
        <h3 className="font-bold text-xs text-foreground">
          Let's finalize your project quotation
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Enter your contact details below to receive our proposal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Honeypot field for bot protection — hidden from human users */}
        <div style={{ display: "none", position: "absolute", left: "-9999px" }} aria-hidden="true">
          <input
            type="text"
            name="website_hp"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHp}
            onChange={(e) => setWebsiteHp(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground mb-0.5 block">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground mb-0.5 block">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground mb-0.5 block">
            Phone Number
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
            placeholder="+44 7451 ..."
          />
        </div>

        <Button
          type="submit"
          disabled={!form.name.trim() || !form.email.trim() || submitting}
          size="sm"
          className="w-full text-xs flex items-center justify-center gap-1.5 mt-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-sm"
        >
          {submitting ? "Sending..." : "Submit Inquiry"}{" "}
          <Send size={11} />
        </Button>
      </form>
    </div>
  );
};

export default ContactFormInline;
