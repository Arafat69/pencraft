import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Package, Truck, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth");
      onClose();
      return;
    }
    addToCart.mutate({ productId: product.id, quantity });
    onClose();
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/auth");
      onClose();
      return;
    }
    addToCart.mutate({ productId: product.id, quantity });
    navigate("/cart");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-full md:max-h-[90vh] bg-card rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row overflow-y-auto">
              {/* Image Section */}
              <div className="md:w-1/2 relative">
                <div className="aspect-square md:h-full">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Stock Badge */}
                {product.stock_quantity <= 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-destructive text-destructive-foreground text-sm font-medium rounded-full">
                    Out of Stock
                  </div>
                )}
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-full">
                    Only {product.stock_quantity} left!
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                {/* Category */}
                {product.category && (
                  <span className="text-sm font-medium text-accent mb-2">
                    {product.category}
                  </span>
                )}

                {/* Title */}
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-accent">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2">বিবরণ</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="flex flex-col items-center text-center p-3 bg-secondary/50 rounded-lg">
                    <Package className="w-5 h-5 text-accent mb-1" />
                    <span className="text-xs text-muted-foreground">Quality Product</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-secondary/50 rounded-lg">
                    <Truck className="w-5 h-5 text-accent mb-1" />
                    <span className="text-xs text-muted-foreground">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-secondary/50 rounded-lg">
                    <Shield className="w-5 h-5 text-accent mb-1" />
                    <span className="text-xs text-muted-foreground">Secure Payment</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-foreground">পরিমাণ:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stock Info */}
                {product.stock_quantity > 0 && (
                  <p className="text-sm text-muted-foreground mb-6">
                    স্টকে আছে: <span className="font-medium text-foreground">{product.stock_quantity}</span> টি
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 h-12"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity <= 0 || addToCart.isPending}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    কার্টে যোগ করুন
                  </Button>
                  <Button
                    className="flex-1 h-12 text-base font-semibold"
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity <= 0}
                  >
                    এখনই কিনুন
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
