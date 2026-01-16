import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart.mutate({ productId: product.id });
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart.mutate({ productId: product.id });
    navigate("/cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-card rounded-xl overflow-hidden shadow-soft border border-border hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1"
            onClick={() => navigate(`/shop/${product.id}`)}
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
        </div>

        {/* Stock Badge */}
        {product.stock_quantity <= 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
            Out of Stock
          </div>
        )}
        
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            Only {product.stock_quantity} left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {product.category && (
          <span className="text-xs font-medium text-accent">{product.category}</span>
        )}
        
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-accent">
            ৳{product.price.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0 || addToCart.isPending}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleBuyNow}
            disabled={product.stock_quantity <= 0}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
