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
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, index = 0, onQuickView }: ProductCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart.mutate({ productId: product.id });
  };

  const handleCardClick = () => {
    navigate(`/shop/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleCardClick}
      className="group bg-card rounded-xl overflow-hidden shadow-soft border border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image - Mini size */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="sm"
            variant="secondary"
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
          >
            <Eye className="w-4 h-4" />
            দেখুন
          </Button>
        </div>

        {/* Stock Badge */}
        {product.stock_quantity <= 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
            স্টক নেই
          </div>
        )}
        
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full">
            {product.stock_quantity}টি বাকি
          </div>
        )}
      </div>

      {/* Content - Compact */}
      <div className="p-3 space-y-2">
        {product.category && (
          <span className="text-xs font-medium text-accent">{product.category}</span>
        )}
        
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent">
            ৳{product.price.toLocaleString()}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0 || addToCart.isPending}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
