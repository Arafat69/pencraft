import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Package, 
  Truck, 
  Shield, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Loader2,
  Check,
  ZoomIn
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct, useProductImages } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: productImages } = useProductImages(id || "");
  const addToCart = useAddToCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Combine main image with additional images
  const allImages = [
    product?.image_url,
    ...(productImages?.map(img => img.image_url) || [])
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart.mutate({ productId: product!.id, quantity });
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart.mutate({ productId: product!.id, quantity });
    navigate("/cart");
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-blog py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">পণ্য পাওয়া যায়নি</h1>
          <Button onClick={() => navigate("/shop")}>শপে ফিরে যান</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="container-blog">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">হোম</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-accent transition-colors">শপ</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-blog py-8 lg:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          পেছনে যান
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div 
              className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30 cursor-zoom-in group"
              onClick={() => setIsZoomed(true)}
            >
              <img
                src={allImages[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Zoom Indicator */}
              <div className="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Stock Badge */}
              {product.stock_quantity <= 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  স্টক শেষ
                </Badge>
              )}
              {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                <Badge className="absolute top-4 left-4 bg-orange-500">
                  মাত্র {product.stock_quantity}টি বাকি
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === index 
                        ? "border-accent ring-2 ring-accent/20" 
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category */}
            {product.category && (
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-accent">
                ৳{product.price.toLocaleString()}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose-blog">
                <h3 className="text-lg font-semibold text-foreground mb-2">বিবরণ</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-xl">
                <Package className="w-6 h-6 text-accent mb-2" />
                <span className="text-sm text-muted-foreground">প্রিমিয়াম কোয়ালিটি</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-xl">
                <Truck className="w-6 h-6 text-accent mb-2" />
                <span className="text-sm text-muted-foreground">দ্রুত ডেলিভারি</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-secondary/50 rounded-xl">
                <Shield className="w-6 h-6 text-accent mb-2" />
                <span className="text-sm text-muted-foreground">নিরাপদ পেমেন্ট</span>
              </div>
            </div>

            {/* Stock Info */}
            {product.stock_quantity > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">
                  স্টকে আছে: <span className="font-semibold text-foreground">{product.stock_quantity}</span> টি
                </span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">পরিমাণ:</span>
              <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2 h-14 text-base"
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0 || addToCart.isPending}
              >
                <ShoppingCart className="w-5 h-5" />
                কার্টে যোগ করুন
              </Button>
              <Button
                size="lg"
                className="flex-1 h-14 text-base font-semibold"
                onClick={handleBuyNow}
                disabled={product.stock_quantity <= 0}
              >
                এখনই কিনুন
              </Button>
            </div>

            {/* Share & Wishlist */}
            <div className="flex gap-4 pt-2">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Heart className="w-4 h-4" />
                উইশলিস্টে যোগ করুন
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Share2 className="w-4 h-4" />
                শেয়ার করুন
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-3 bg-secondary rounded-full hover:bg-muted transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={allImages[selectedImageIndex] || "/placeholder.svg"}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-secondary rounded-full hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-secondary rounded-full hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </Layout>
  );
}
