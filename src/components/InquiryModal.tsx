import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createInquiry } from '@/lib/inquiries';
import { useT } from '@/i18n';
import { track, trackMetaLead } from '@/lib/analytics';

interface Props {
  open: boolean;
  onClose: () => void;
  artworkId?: string;
  artworkTitle?: string;
  artworkImage?: string | null;
  artworkDetails?: string;
}

const InquiryModal = ({ open, onClose, artworkId, artworkTitle, artworkImage, artworkDetails }: Props) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', budget_range: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const t = useT();

  useEffect(() => {
    if (open) {
      track('inquiry_opened', { artwork_id: artworkId, title: artworkTitle || undefined });
    }
  }, [open, artworkId, artworkTitle]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t.inquiry.required);
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
    }, artworkId ? 'inquiry_obra' : 'inquiry');
    if (success) {
      setSubmitted(true);
      track('inquiry_submitted', { artwork_id: artworkId, title: artworkTitle || undefined, email: form.email.trim() });
      trackMetaLead(form.email.trim());
    } else { setError(t.inquiry.error); }
    setSubmitting(false);
  };

  const handleClose = () => {
    setForm({ name: '', email: '', phone: '', message: '', budget_range: '' });
    setSubmitted(false);
    setError('');
    onClose();
  };

  const inputCls = "w-full px-3 py-2.5 text-sm bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors";
  const labelCls = "block text-[12px] tracking-[0.2em] uppercase text-foreground mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={handleClose} />
      <div className={`relative w-full ${artworkImage ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto bg-background border border-border`}>
        <button onClick={handleClose} className="absolute top-4 right-4 z-10 text-foreground/70 hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 px-8 text-center">
            <h2 className="font-serif text-2xl text-foreground mb-3">{t.inquiry.thankYou}</h2>
            <p className="text-[15px] text-foreground leading-relaxed">{t.inquiry.received}</p>
            <button onClick={handleClose} className="mt-8 text-[13px] tracking-[0.2em] uppercase text-foreground hover:text-brand-red transition-colors">{t.inquiry.close}</button>
          </div>
        ) : (
          <div className={`grid ${artworkImage ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            {artworkImage && (
              <div className="hidden md:flex flex-col border-r border-border bg-muted/20">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img src={artworkImage} alt={artworkTitle || ''} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  {artworkTitle && <p className="font-serif text-xl text-foreground leading-snug">{artworkTitle}</p>}
                  {artworkDetails && <p className="text-[13px] text-muted-foreground mt-1.5">{artworkDetails}</p>}
                </div>
              </div>
            )}

            <div className="p-7 md:p-8">
              <h2 className="font-serif text-2xl text-foreground mb-1">{t.inquiry.title}</h2>
              {artworkTitle
                ? <p className="text-[14px] text-muted-foreground mb-6">{t.inquiry.regarding} <span className="italic text-foreground">{artworkTitle}</span></p>
                : <div className="mb-6" />}
              {error && <p className="text-[14px] text-destructive mb-4">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>{t.inquiry.name} *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder={t.inquiry.namePlaceholder} />
                </div>
                <div>
                  <label className={labelCls}>{t.inquiry.email} *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder={t.inquiry.emailPlaceholder} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t.inquiry.phone}</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} placeholder={t.inquiry.phonePlaceholder} />
                  </div>
                  <div>
                    <label className={labelCls}>{t.inquiry.budgetRange}</label>
                    <input type="text" value={form.budget_range} onChange={(e) => setForm(p => ({ ...p, budget_range: e.target.value }))} className={inputCls} placeholder="€ 1.000 – 5.000" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t.inquiry.message} *</label>
                  <textarea value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} rows={4} className={`${inputCls} resize-none`} placeholder={t.inquiry.messagePlaceholder} />
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3.5 text-[13px] tracking-[0.22em] uppercase font-medium bg-brand-red text-white hover:bg-brand-red-soft transition-colors disabled:opacity-50">
                  {submitting ? t.inquiry.sending : t.inquiry.send}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
