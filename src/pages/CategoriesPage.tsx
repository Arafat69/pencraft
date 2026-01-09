import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CategoryCard from "@/components/blog/CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { mapDbCategory } from "@/lib/data";

export default function CategoriesPage() {
  const { data: dbCategories, isLoading } = useCategories();
  const categories = (dbCategories || []).map(mapDbCategory);

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
              Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our articles organized by topic. Find exactly what you're
              looking for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No categories yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
