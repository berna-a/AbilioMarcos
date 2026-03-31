import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to inquiries table
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 md:pb-30 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            {/* Left — info */}
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Get in Touch</p>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8">Contact</h1>

              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">Inquiries</p>
                  <p>For artwork inquiries, acquisitions, and commissions, please use the form or reach out directly.</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">Studio</p>
                  <p>Lisbon, Portugal</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase mb-2 text-foreground">Email</p>
                  <p>studio@abiliomarcos.com</p>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {submitted ? (
                <div className="pt-8">
                  <p className="font-serif text-2xl mb-3">Thank you</p>
                  <p className="text-sm text-muted-foreground">
                    Your message has been received. We will respond within 2–3 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors appearance-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="acquisition">Artwork Acquisition</option>
                      <option value="inquiry">General Inquiry</option>
                      <option value="commission">Commission Request</option>
                      <option value="exhibition">Exhibition / Gallery</option>
                      <option value="press">Press / Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full border-b border-gallery-border bg-transparent py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-foreground text-primary-foreground text-xs tracking-[0.15em] uppercase hover:bg-gallery-charcoal transition-colors"
                  >
                    Send Message
                  </button>
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