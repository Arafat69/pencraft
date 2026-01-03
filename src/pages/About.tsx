import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function About() {
  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container-blog">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">About Pencraft</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Pencraft is a modern publishing platform for curious minds. We believe in the power of well-crafted stories to inspire, educate, and connect people across the globe.
            </p>
            <div className="prose-blog text-left">
              <h2>Our Mission</h2>
              <p>To democratize knowledge sharing and provide a platform where experts and enthusiasts can share their insights with the world.</p>
              <h2>What We Cover</h2>
              <p>From technology and design to business strategy and personal growth, our diverse team of writers brings you thoughtful perspectives on the topics that matter most.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
