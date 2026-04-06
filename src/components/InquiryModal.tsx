import { useState } from 'react';
import { X } from 'lucide-react';
import { createInquiry } from '@/lib/inquiries';

interface Props {
  open: boolean;
  onClose: () => void;
  artworkId?: string;
  artworkTitle?: string;
}

const InquiryModal = ({ open, onClose, artworkId, artworkTitle }: Props) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    budget_range: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    const success = await createInquiry({
      artwork_id: artworkId || null,
      artwork_title: artworkTitle || null,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
      budget_range: form.budget_range.trim() || null,
    });

    if (success) {
      setSubmitted(true);
    } else {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    setForm({ name: '', email: '', phone: '', message: '', budget_range: '' });
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={handleClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 bg-background border border-border p-8 md:p-10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <h2 className="font-serif text-2xl text-foreground mb-3">Thank You</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Your inquiry has been received. We will be in touch shortly.
            </p>
            <button
              onClick={handleClose}
              className="mt-8 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl text-foreground mb-1">Inquire</h2>
            {artworkTitle && (
              <p className="text-[13px] text-muted-foreground mb-6">
                Regarding <span className="italic">{artworkTitle}</span>
              </p>
            )}
            {!artworkTitle && <div className="mb-6" />}

            {error && (
              <p className="text-[12px] text-destructive mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Budget Range</label>
                  <input
                    type="text"
                    value={form.budget_range}
                    onChange={(e) => setForm(p => ({ ...p, budget_range: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors resize-none"
                  placeholder="Your message…"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 text-[11px] tracking-[0.2em] uppercase bg-foreground text-background hover:bg-foreground/85 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
