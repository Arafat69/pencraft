import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useSiteSetting } from "@/hooks/useSiteSettings";

export default function About() {
  const { data: aboutContent, isLoading } = useSiteSetting("about_us");

  const defaultContent = `
## Our Mission
To democratize knowledge sharing and provide a platform where experts and enthusiasts can share their insights with the world.

## What We Cover
From technology and design to business strategy and personal growth, our diverse team of writers brings you thoughtful perspectives on the topics that matter most.
  `;

  const content = aboutContent || defaultContent;

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container-blog">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">About Me</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Hi, I'm Arafat Rahman Dihan — a writer, developer, and creator. This is my personal space where I share my thoughts, projects, and creative work with the world.
            </p>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent" />
            ) : (
              <div className="prose-blog text-left whitespace-pre-wrap">
                {content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="font-display text-2xl font-semibold text-foreground mt-8 mb-4">{line.replace('## ', '')}</h2>;
                  }
                  if (line.trim()) {
                    return <p key={i} className="text-muted-foreground mb-4">{line}</p>;
                  }
                  return null;
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
