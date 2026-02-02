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
      if (dismissedId !== notice.id) {
        // Small delay for better UX
        const timer = setTimeout(() => setIsVisible(true), 500);
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-lg"
          >
            <div className="relative bg-card rounded-2xl shadow-elevated overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              {showImage && notice.image_url && (
                <div
                  className={`relative ${notice.link_url ? "cursor-pointer" : ""}`}
                  onClick={notice.link_url ? handleImageClick : undefined}
                >
                  <img
                    src={notice.image_url}
                    alt={notice.title || "Notice"}
                    className="w-full h-auto max-h-[50vh] object-cover"
                  />
                  {notice.link_url && !showText && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  )}
                </div>
              )}

              {/* Text Content */}
              {showText && (notice.title || notice.content) && (
                <div className="p-6">
                  {notice.title && (
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">
                      {notice.title}
                    </h2>
                  )}
                  {notice.content && (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {notice.content}
                    </p>
                  )}
                  {notice.link_url && (
                    <Button
                      onClick={handleImageClick}
                      className="w-full"
                    >
                      {notice.button_text || "Learn More"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
