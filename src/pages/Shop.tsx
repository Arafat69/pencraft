import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Filter, Search, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shop/ProductCard";
import ProductDetailModal from "@/components/shop/ProductDetailModal";
import { useProducts, Product } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-8 lg:py-12 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <ShoppingBag className="w-4 h-4" />
              আমাদের শপ
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              আমাদের পণ্যসমূহ
            </h1>
            <p className="text-muted-foreground">
              সেরা মানের পণ্য সংগ্রহ করুন
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container-blog">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="পণ্য খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-36 h-9">
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
                <SelectTrigger className="w-full sm:w-36 h-9">
                  <SelectValue placeholder="সাজান" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">নতুন</SelectItem>
                  <SelectItem value="price-low">কম দাম</SelectItem>
                  <SelectItem value="price-high">বেশি দাম</SelectItem>
                  <SelectItem value="name">নাম</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container-blog">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">কোনো পণ্য পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
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
