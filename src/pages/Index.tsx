import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import CategoryCard from "@/components/blog/CategoryCard";
import AuthorCard from "@/components/blog/AuthorCard";
import Newsletter from "@/components/blog/Newsletter";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  posts,
  categories,
  authors,
  getFeaturedPosts,
  getTrendingPosts,
} from "@/lib/data";

export default function Index() {
  const { t } = useLanguage();
  const featuredPosts = getFeaturedPosts();
  const trendingPosts = getTrendingPosts();
  const latestPosts = posts.slice(0, 6);

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
              {t("hero.title")}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t("hero.explore")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              >
                {t("nav.about")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="container-blog">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                  {t("section.featured")}
                </h2>
              </div>
              <Link
                to="/blog"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                {t("section.view_all")}
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
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container-blog">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
              {t("section.categories")}
            </h2>
            <Link
              to="/categories"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              {t("section.all_categories")}
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

      {/* Latest Posts */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                  {t("section.latest")}
                </h2>
                <Link
                  to="/blog"
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  {t("section.view_all")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>

              <div className="mt-8 text-center lg:hidden">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  {t("section.view_all_posts")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 space-y-8">
              {/* Trending */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t("section.trending")}
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

              {/* Popular Authors */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  {t("section.popular_authors")}
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
                  {t("section.all_authors")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <Newsletter />
        </div>
      </section>
    </Layout>
  );
}
