import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useT } from "@/i18n";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const t = useT();

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <motion.div className="md:col-span-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{t.contact.getInTouch}</p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8">{t.contact.title}</h1>
              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.inquiriesLabel}</p>
                  <p>{t.contact.inquiriesText}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.studioLabel}</p>
                  <p>{t.contact.studioLocation}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.emailLabel}</p>
                  <p>studio@abiliomarcos.com</p>
                </div>
              </div>
            </motion.div>
            <motion.div className="md:col-span-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {submitted ? (
                <div className="pt-8">
                  <p className="font-serif text-2xl mb-3">{t.contact.thankYou}</p>
                  <p className="text-sm text-muted-foreground">{t.contact.thankYouMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">{t.contact.nameLabel}</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">{t.contact.emailFieldLabel}</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">{t.contact.subjectLabel}</label>
                    <select value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors appearance-none">
                      <option value="">{t.contact.selectSubject}</option>
                      <option value="acquisition">{t.contact.acquisition}</option>
                      <option value="inquiry">{t.contact.generalInquiry}</option>
                      <option value="commission">{t.contact.commissionRequest}</option>
                      <option value="exhibition">{t.contact.exhibition}</option>
                      <option value="press">{t.contact.pressMedia}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">{t.contact.messageLabel}</label>
                    <textarea required rows={5} value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none" />
                  </div>
                  <button type="submit" className="px-8 py-3 bg-foreground text-primary-foreground text-xs tracking-[0.15em] uppercase hover:bg-gallery-charcoal transition-colors">{t.contact.sendMessage}</button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
