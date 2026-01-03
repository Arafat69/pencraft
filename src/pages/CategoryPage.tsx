import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || "");
  const posts = getPostsByCategory(slug || "");

  if (!category) {
    return (
      <Layout>
        <div className="container-blog py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Category Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/categories">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Categories
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Category Header */}
      <section
        className="py-16 lg:py-24"
        style={{
          background: `linear-gradient(135deg, ${category.color}15 0%, transparent 50%)`,
        }}
      >
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </Link>

            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <span
                  className="text-3xl font-display font-bold"
                  style={{ color: category.color }}
                >
                  {category.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {category.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {category.description}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  {posts.length} article{posts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
