import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container-blog">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
              <p className="text-lg text-muted-foreground">Have a question or want to collaborate? We'd love to hear from you.</p>
            </motion.div>
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl shadow-soft">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-accent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-accent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} className="w-full px-4 py-3 bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-accent resize-none" required />
              </div>
              <Button type="submit" className="w-full gap-2">Send Message <Send className="w-4 h-4" /></Button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
