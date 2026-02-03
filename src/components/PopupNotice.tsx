import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActivePopupNotice } from "@/hooks/usePopupNotices";
import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "popup_notice_dismissed";

export default function PopupNotice() {
  const { data: notice, isLoading } = useActivePopupNotice();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notice) {
      const dismissedId = localStorage.getItem(DISMISSED_KEY);
      // Only show if this notice hasn't been dismissed before
      if (dismissedId !== notice.id) {
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [notice]);

  const handleDismiss = () => {
    if (notice) {
      localStorage.setItem(DISMISSED_KEY, notice.id);
    }
    setIsVisible(false);
  };

  const handleImageClick = () => {
    if (notice?.link_url) {
      window.open(notice.link_url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading || !notice || !isVisible) return null;

  const showImage = notice.display_type === "image" || notice.display_type === "both";
  const showText = notice.display_type === "text" || notice.display_type === "both";

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg z-10"
          >
            <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
              {/* Close Button - Always visible */}
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Section */}
              {showImage && notice.image_url && (
                <div
                  className={`relative ${notice.link_url ? "cursor-pointer" : ""}`}
                  onClick={notice.link_url ? handleImageClick : undefined}
                >
                  <img
                    src={notice.image_url}
                    alt={notice.title || "Notice"}
                    className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] object-contain bg-muted"
                  />
                  {notice.link_url && !showText && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  )}
                </div>
              )}

              {/* Text Content Section */}
              {showText && (notice.title || notice.content) && (
                <div className="p-4 sm:p-6">
                  {notice.title && (
                    <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2 pr-6">
                      {notice.title}
                    </h2>
                  )}
                  {notice.content && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      {notice.content}
                    </p>
                  )}
                  {notice.link_url && (
                    <Button
                      onClick={handleImageClick}
                      className="w-full"
                      size="lg"
                    >
                      {notice.button_text || "Learn More"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}