import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useT } from "@/i18n";

const STORAGE_KEY = "am_cookie_consent_v1";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  ts: string;
};

const defaultConsent: Consent = { essential: true, analytics: false, marketing: false, ts: "" };

export function getCookieConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function saveConsent(c: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    window.dispatchEvent(new CustomEvent("am:cookie-consent", { detail: c }));
  } catch {
    /* noop */
  }
}

const CookieConsent = () => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, []);

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true, ts: new Date().toISOString() });
    setOpen(false);
  };
  const handleRejectOptional = () => {
    saveConsent({ ...defaultConsent, ts: new Date().toISOString() });
    setOpen(false);
  };
  const handleSavePrefs = () => {
    saveConsent({ essential: true, analytics, marketing, ts: new Date().toISOString() });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-6 md:max-w-md z-[60]"
          role="dialog"
          aria-modal="false"
          aria-label={t.cookies.title}
        >
          <div className="bg-background border border-border shadow-lg p-5 md:p-6">
            <p className="text-[12px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              {t.cookies.title}
            </p>
            <p className="text-[15px] leading-relaxed text-foreground/80 mb-4">
              {t.cookies.description}{" "}
              <Link
                to="/legal/cookies"
                className="underline underline-offset-2 text-foreground/70 hover:text-brand-red transition-colors"
              >
                {t.cookies.learnMore}
              </Link>
            </p>

            {showPrefs && (
              <div className="space-y-3 mb-4 border-t border-border pt-4">
                <PrefRow
                  title={t.cookies.essential}
                  desc={t.cookies.essentialDesc}
                  checked={true}
                  disabled
                />
                <PrefRow
                  title={t.cookies.analytics}
                  desc={t.cookies.analyticsDesc}
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <PrefRow
                  title={t.cookies.marketing}
                  desc={t.cookies.marketingDesc}
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-1">
              {!showPrefs && (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 min-w-[120px] py-2.5 text-[13px] tracking-[0.15em] uppercase bg-foreground text-background hover:bg-brand-red transition-colors duration-300"
                  >
                    {t.cookies.accept}
                  </button>
                  <button
                    onClick={handleRejectOptional}
                    className="flex-1 min-w-[120px] py-2.5 text-[13px] tracking-[0.15em] uppercase border border-border text-foreground/75 hover:text-foreground hover:border-foreground/40 transition-colors duration-300"
                  >
                    {t.cookies.reject}
                  </button>
                  <button
                    onClick={() => setShowPrefs(true)}
                    className="basis-full text-[13px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors py-1.5"
                  >
                    {t.cookies.manage}
                  </button>
                </>
              )}
              {showPrefs && (
                <button
                  onClick={handleSavePrefs}
                  className="w-full py-2.5 text-[13px] tracking-[0.15em] uppercase bg-foreground text-background hover:bg-brand-red transition-colors duration-300"
                >
                  {t.cookies.save}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PrefRow = ({
  title,
  desc,
  checked,
  onChange,
  disabled = false,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <label className={`flex items-start gap-3 ${disabled ? "opacity-70" : "cursor-pointer"}`}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.checked)}
      className="mt-1 h-3.5 w-3.5 accent-foreground"
    />
    <div className="flex-1">
      <p className="text-[14px] font-medium text-foreground/85">{title}</p>
      <p className="text-[13px] text-muted-foreground leading-snug mt-0.5">{desc}</p>
    </div>
  </label>
);

export default CookieConsent;
