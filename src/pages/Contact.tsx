import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useT } from "@/i18n";
import { Instagram, Facebook, MessageCircle, MapPin, Mail, Phone } from "lucide-react";

const SOCIALS = {
  instagram: "https://www.instagram.com/abilio.marcos.arte/",
  facebook: "https://www.facebook.com/abilio.marcos.9",
  whatsapp: "https://wa.me/351968181117",
  maps: "https://maps.app.goo.gl/bMXvMocvADjPa3Zc7",
  email: "marcos4011@gmail.com",
  phone: "+351 968 181 117",
  phoneTel: "+351968181117",
  address: "Atelier de Artes Plásticas, R. do Pinhal da Serra 1, Monfirre, 2665-409 Santo Estêvão das Galés",
};

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
            {/* Left column — info */}
            <motion.div className="md:col-span-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{t.contact.getInTouch}</p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8">{t.contact.title}</h1>
              <div className="space-y-7 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.inquiriesLabel}</p>
                  <p>{t.contact.inquiriesText}</p>
                </div>

                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.studioLabel}</p>
                  <p className="whitespace-pre-line">{SOCIALS.address}</p>
                  <a
                    href={SOCIALS.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-[13px] tracking-[0.1em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300 underline-offset-4 hover:underline"
                  >
                    <MapPin className="w-3 h-3" />
                    {t.contact.openInMaps}
                  </a>
                </div>

                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.emailLabel}</p>
                  <a href={`mailto:${SOCIALS.email}`} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {SOCIALS.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.phoneLabel}</p>
                  <a href={`tel:${SOCIALS.phoneTel}`} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {SOCIALS.phone}
                  </a>
                </div>

                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">{t.contact.whatsappLabel}</p>
                  <a
                    href={SOCIALS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> {t.contact.whatsappCta}
                  </a>
                </div>

                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-3 text-foreground">{t.contact.socialsLabel}</p>
                  <div className="flex items-center gap-5">
                    <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground/70 hover:text-social-instagram transition-colors duration-300">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground/70 hover:text-social-facebook transition-colors duration-300">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href={SOCIALS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted-foreground/70 hover:text-social-whatsapp transition-colors duration-300">
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column — form + map */}
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
                  <button type="submit" className="px-8 py-3.5 bg-brand-red text-primary-foreground text-xs tracking-[0.18em] uppercase font-medium hover:bg-brand-red-soft transition-colors">{t.contact.sendMessage}</button>
                </form>
              )}

              {/* Google Maps embed */}
              <div className="mt-12">
                <p className="text-xs tracking-[0.15em] uppercase mb-3 text-foreground">{t.contact.mapsLabel}</p>
                <div className="aspect-[16/10] w-full overflow-hidden border border-gallery-border bg-muted/30">
                  <iframe
                    title="Atelier de Artes Plásticas — Abílio Marcos"
                    src="https://www.google.com/maps?q=R.+do+Pinhal+da+Serra+1,+Monfirre,+2665-409+Santo+Est%C3%AAv%C3%A3o+das+Gal%C3%A9s&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
