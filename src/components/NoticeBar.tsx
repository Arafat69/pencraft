import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notice {
  id: string;
  content: string;
  bg_color: string | null;
  text_color: string | null;
}

export default function NoticeBar() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, content, bg_color, text_color")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setNotices(data);
      }
    };

    fetchNotices();
  }, []);

  // Rotate through notices every 5 seconds if there are multiple
  useEffect(() => {
    if (notices.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [notices.length]);

  if (!isVisible || notices.length === 0) return null;

  const currentNotice = notices[currentIndex];
  const bgColor = currentNotice.bg_color || "#f97316";
  const textColor = currentNotice.text_color || "#ffffff";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div className="container-blog py-2 flex items-center justify-center gap-3">
          <Megaphone className="w-4 h-4 flex-shrink-0" style={{ color: textColor }} />
          
          <div className="overflow-hidden flex-1">
            <motion.div
              key={currentNotice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium text-center font-bengali"
              style={{ color: textColor }}
            >
              <div className="inline-block animate-marquee whitespace-nowrap">
                {currentNotice.content}
                {notices.length > 1 && (
                  <span className="mx-4 opacity-50">•</span>
                )}
              </div>
            </motion.div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
            style={{ color: textColor }}
            aria-label="Close notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar for multiple notices */}
        {notices.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
            <motion.div
              key={currentIndex}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-white/50"
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
