import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, LayoutGrid, List, X, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { mapDbPost, mapDbCategory, mapDbTag } from "@/lib/data";

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { data: dbPosts, isLoading: postsLoading } = usePosts();
  const { data: dbCategories, isLoading: categoriesLoading } = useCategories();
  const { data: dbTags, isLoading: tagsLoading } = useTags();

  const posts = useMemo(() => (dbPosts || []).map(mapDbPost), [dbPosts]);
  const categories = useMemo(() => (dbCategories || []).map(mapDbCategory), [dbCategories]);
  const tags = useMemo(() => (dbTags || []).map(mapDbTag), [dbTags]);

  const isLoading = postsLoading || categoriesLoading || tagsLoading;

  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedTag = searchParams.get("tag") || "";
  const sortBy = searchParams.get("sort") || "latest";

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Search filter - includes tag matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (post) => post.category.slug === selectedCategory
      );
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => tag.slug === selectedTag)
      );
    }

    // Sorting
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTag, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || selectedTag || sortBy !== "latest";

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
              All Articles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our collection of articles covering technology, design,
              business, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8 lg:py-12">
        <div className="container-blog">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => updateFilter("q", e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-lg border-none outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Category Select */}
              <select
                value={selectedCategory}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="px-4 py-2 bg-secondary rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Tag Select */}
              <select
                value={selectedTag}
                onChange={(e) => updateFilter("tag", e.target.value)}
                className="px-4 py-2 bg-secondary rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.slug}>
                    {tag.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="px-4 py-2 bg-secondary rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Viewed</option>
                <option value="liked">Most Liked</option>
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mb-6 p-4 bg-card rounded-xl space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full px-4 py-2 bg-secondary rounded-lg text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tag
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => updateFilter("tag", e.target.value)}
                  className="w-full px-4 py-2 bg-secondary rounded-lg text-sm"
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.slug}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  className="w-full px-4 py-2 bg-secondary rounded-lg text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Most Viewed</option>
                  <option value="liked">Most Liked</option>
                </select>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </motion.div>
          )}

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {isLoading ? "Loading..." : `Showing ${filteredPosts.length} article${filteredPosts.length !== 1 ? "s" : ""}`}
          </p>

          {/* Posts Grid/List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant={viewMode === "list" ? "horizontal" : "default"}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-4">
                {posts.length === 0 
                  ? "No articles yet. Check back soon!"
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
