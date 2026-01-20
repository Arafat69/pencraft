import { motion } from "framer-motion";
import { Mail, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useSendContactMessage } from "@/hooks/useContactMessages";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const sendMessage = useSendContactMessage();
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    sendMessage.mutate(formData, {
      onSuccess: () => {
        toast.success("মেসেজ পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।");
        setFormData({ name: "", email: "", message: "" });
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      },
      onError: () => {
        toast.error("মেসেজ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      },
    });
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container-blog">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Mail className="w-4 h-4" />
                যোগাযোগ
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
                আমাদের সাথে যোগাযোগ করুন
              </h1>
              <p className="text-lg text-muted-foreground">
                কোনো প্রশ্ন বা পরামর্শ থাকলে আমাদের লিখুন। আমরা সাহায্য করতে সর্বদা প্রস্তুত।
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-soft"
            >
              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>আপনার মেসেজ সফলভাবে পাঠানো হয়েছে!</span>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="নাম লিখুন"
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ইমেইল ঠিকানা
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  আপনার মেসেজ
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  placeholder="আপনার মেসেজ লিখুন..."
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={sendMessage.isPending}
                className="w-full h-12 text-base gap-2 rounded-xl"
              >
                {sendMessage.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    মেসেজ পাঠান
                  </>
                )}
              </Button>
            </motion.form>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid sm:grid-cols-2 gap-6"
            >
              <div className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border">
                <div className="p-3 rounded-full bg-accent/10">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ইমেইল</p>
                  <a href="mailto:contact@pencraft.com" className="font-medium hover:text-accent transition-colors">
                    contact@pencraft.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border">
                <div className="p-3 rounded-full bg-accent/10">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ঠিকানা</p>
                  <p className="font-medium">ঢাকা, বাংলাদেশ</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
