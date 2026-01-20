import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Filter, Search, Loader2, Grid3X3, LayoutGrid, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shop/ProductCard";
import ProductDetailModal from "@/components/shop/ProductDetailModal";
import { useProducts, Product } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gridSize, setGridSize] = useState<"compact" | "large">("large");

  // Get unique categories
  const categories = Array.from(
    new Set((products || []).map((p) => p.category).filter(Boolean))
  );

  // Filter and sort products
  let filteredProducts = (products || []).filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container-blog relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-accent text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              প্রিমিয়াম কালেকশন
            </motion.div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              আমাদের{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">
                এক্সক্লুসিভ
              </span>{" "}
              পণ্যসমূহ
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              সেরা মানের পণ্য সংগ্রহ করুন আমাদের কিউরেটেড কালেকশন থেকে
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{products?.length || 0}</p>
                <p className="text-sm text-muted-foreground">পণ্য</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{categories.length}</p>
                <p className="text-sm text-muted-foreground">ক্যাটাগরি</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">100%</p>
                <p className="text-sm text-muted-foreground">অথেনটিক</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 border-y border-border sticky top-16 bg-background/95 backdrop-blur-md z-40">
        <div className="container-blog">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="পণ্য খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-base bg-card border-border/50 focus:border-accent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 h-11 bg-card">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="ক্যাটাগরি" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 h-11 bg-card">
                  <SelectValue placeholder="সাজান" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">নতুন</SelectItem>
                  <SelectItem value="price-low">কম দাম</SelectItem>
                  <SelectItem value="price-high">বেশি দাম</SelectItem>
                  <SelectItem value="name">নাম</SelectItem>
                </SelectContent>
              </Select>

              {/* Grid Toggle - Desktop Only */}
              <div className="hidden lg:flex items-center gap-1 p-1 bg-card rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    gridSize === "large" && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setGridSize("large")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    gridSize === "compact" && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setGridSize("compact")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(categoryFilter !== "all" || search) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50"
            >
              <span className="text-sm text-muted-foreground">ফিল্টার:</span>
              {categoryFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => setCategoryFilter("all")}
                >
                  {categoryFilter} ✕
                </Badge>
              )}
              {search && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => setSearch("")}
                >
                  "{search}" ✕
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                }}
              >
                সব মুছুন
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-accent mb-4" />
              <p className="text-muted-foreground">পণ্য লোড হচ্ছে...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="text-muted-foreground mb-6">আপনার সার্চ বা ফিল্টার পরিবর্তন করে দেখুন</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                }}
              >
                ফিল্টার রিসেট করুন
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">{filteredProducts.length}</span> টি পণ্য পাওয়া গেছে
                </p>
              </div>

              {/* Products Grid */}
              <motion.div
                layout
                className={cn(
                  "grid gap-6",
                  gridSize === "large"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                    >
                      <ProductCard
                        product={product}
                        index={index}
                        onQuickView={handleQuickView}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}
