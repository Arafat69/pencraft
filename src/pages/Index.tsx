import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import CategoryCard from "@/components/blog/CategoryCard";
import AuthorCard from "@/components/blog/AuthorCard";
import Newsletter from "@/components/blog/Newsletter";
import { usePosts, useFeaturedPosts, useTrendingPosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useAuthors } from "@/hooks/useAuthors";
import { mapDbPost, mapDbCategory, mapDbAuthor } from "@/lib/data";

export default function Index() {
  const { data: dbPosts, isLoading: postsLoading } = usePosts();
  const { data: dbFeaturedPosts, isLoading: featuredLoading } = useFeaturedPosts();
  const { data: dbTrendingPosts, isLoading: trendingLoading } = useTrendingPosts();
  const { data: dbCategories, isLoading: categoriesLoading } = useCategories();
  const { data: dbAuthors, isLoading: authorsLoading } = useAuthors();

  const posts = (dbPosts || []).map(mapDbPost);
  const featuredPosts = (dbFeaturedPosts || []).map(mapDbPost);
  const trendingPosts = (dbTrendingPosts || []).map(mapDbPost);
  const categories = (dbCategories || []).map(mapDbCategory);
  const authors = (dbAuthors || []).map(mapDbAuthor);

  const latestPosts = posts.slice(0, 6);
  const isLoading = postsLoading || featuredLoading || trendingLoading || categoriesLoading || authorsLoading;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="container-blog relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Welcome to Pencraft
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Stories that inspire, ideas that matter
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Discover thoughtfully crafted articles on design, technology, lifestyle, and more. Join our community of curious minds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Explore Articles
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Featured Posts */}
      {!isLoading && featuredPosts.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="container-blog">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                  Featured Stories
                </h2>
              </div>
              <Link
                to="/blog"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="featured"
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {!isLoading && categories.length > 0 && (
        <section className="py-12 lg:py-16 bg-secondary/30">
          <div className="container-blog">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                Browse by Category
              </h2>
              <Link
                to="/categories"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                All Categories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {!isLoading && (
        <section className="py-12 lg:py-16">
          <div className="container-blog">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                    Latest Articles
                  </h2>
                  <Link
                    to="/blog"
                    className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {latestPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestPosts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No articles yet. Check back soon!</p>
                  </div>
                )}

                <div className="mt-8 text-center lg:hidden">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    View All Posts
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:w-80 space-y-8">
                {/* Trending */}
                {trendingPosts.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-soft">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        Trending Now
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {trendingPosts.slice(0, 4).map((post, index) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          variant="horizontal"
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Authors */}
                {authors.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-soft">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                      Popular Authors
                    </h3>
                    <div className="space-y-1">
                      {authors.slice(0, 4).map((author) => (
                        <AuthorCard
                          key={author.id}
                          author={author}
                          variant="compact"
                        />
                      ))}
                    </div>
                    <Link
                      to="/authors"
                      className="flex items-center justify-center gap-1 mt-4 text-sm font-medium text-accent hover:underline"
                    >
                      All Authors
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <Newsletter />
        </div>
      </section>
    </Layout>
  );
}
