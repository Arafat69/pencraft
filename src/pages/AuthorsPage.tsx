import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import AuthorCard from "@/components/blog/AuthorCard";
import { authors } from "@/lib/data";

export default function AuthorsPage() {
  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Authors
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Meet the talented writers and experts behind our articles. Each
              brings unique perspectives and expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {authors.map((author, index) => (
              <AuthorCard key={author.id} author={author} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
