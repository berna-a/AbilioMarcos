import { useState } from "react";
import { useT } from "@/i18n";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";

interface CollectorSignupProps {
  variant?: "inline" | "footer";
}

const CollectorSignup = ({ variant = "inline" }: CollectorSignupProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const t = useT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await supabase.from('newsletter_subscribers').insert([{ email: email.trim().toLowerCase() }]);
    } catch {
      // still show success — don't expose internals
    }
    track('newsletter_signup', { email: email.trim().toLowerCase() });
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className={variant === "footer" ? "text-center max-w-md mx-auto" : "max-w-lg"}>
        <p className="font-serif text-xl md:text-2xl mb-3">{t.collector.thankYou}</p>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          {t.collector.thankYouMessage}
        </p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className="text-center max-w-md mx-auto">
        <p className="font-serif text-xl md:text-2xl mb-3">{t.collector.stayConnected}</p>
        <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed">
          {t.collector.footerDescription}
        </p>
        <form onSubmit={handleSubmit} className="flex gap-0 border border-foreground/20">
          <input type="email" placeholder={t.collector.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3.5 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" required />
          <button type="submit" disabled={submitting} className="px-6 py-3.5 bg-brand-red text-primary-foreground text-[12px] tracking-[0.22em] uppercase font-medium hover:bg-brand-red-soft transition-colors disabled:opacity-50">
            {t.collector.subscribe}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <p className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground mb-4">{t.collector.listLabel}</p>
      <p className="font-serif text-2xl md:text-3xl mb-3 leading-tight">{t.collector.title}</p>
      <p className="text-[15px] text-muted-foreground mb-8 leading-[1.8] max-w-sm">{t.collector.description}</p>
      <form onSubmit={handleSubmit} className="flex gap-0 border border-foreground/20 max-w-md">
        <input type="email" placeholder={t.collector.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3.5 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" required />
        <button type="submit" disabled={submitting} className="px-6 py-3.5 bg-brand-red text-primary-foreground text-[12px] tracking-[0.22em] uppercase font-medium hover:bg-brand-red-soft transition-colors disabled:opacity-50">
          {t.collector.join}
        </button>
      </form>
    </div>
  );
};

export default CollectorSignup;
