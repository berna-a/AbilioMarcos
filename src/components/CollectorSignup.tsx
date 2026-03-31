import { useState } from "react";

interface CollectorSignupProps {
  variant?: "inline" | "footer";
}

const CollectorSignup = ({ variant = "inline" }: CollectorSignupProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={variant === "footer" ? "text-center max-w-md mx-auto" : "max-w-lg"}>
        <p className="font-serif text-xl md:text-2xl mb-3">Thank you</p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          You'll receive collector notes and early access to new works.
        </p>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className="text-center max-w-md mx-auto">
        <p className="font-serif text-xl md:text-2xl mb-3">Stay Connected</p>
        <p className="text-[13px] text-muted-foreground mb-8 leading-relaxed">
          Collector notes and early access to new works.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-0 border border-foreground/20">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3.5 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-foreground text-primary-foreground text-[10px] tracking-[0.2em] uppercase hover:bg-gallery-charcoal transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
        Collector List
      </p>
      <p className="font-serif text-2xl md:text-3xl mb-3 leading-tight">
        Stay Close to the Work
      </p>
      <p className="text-[13px] text-muted-foreground mb-8 leading-[1.8] max-w-sm">
        Collector notes, early access to new works, and studio insights — 
        delivered with the same care as the art.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-0 border border-foreground/20 max-w-md">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3.5 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-foreground text-primary-foreground text-[10px] tracking-[0.2em] uppercase hover:bg-gallery-charcoal transition-colors"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default CollectorSignup;
