import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

export default function ProductsSection() {
  const { data: products, isLoading } = useProducts();

  if (isLoading || !products || products.length === 0) {
    return null;
  }

  // Show only first 4 products on homepage
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container-blog">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
              আমাদের পণ্যসমূহ
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="mt-8 text-center lg:hidden">
          <Link to="/shop">
            <Button variant="outline" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
