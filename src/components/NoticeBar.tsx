import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notice {
  id: string;
  content: string;
  bg_color: string | null;
  text_color: string | null;
}

export default function NoticeBar() {
  const [notices, setNotices] = useState<Notice[]>([]);

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

  if (notices.length === 0) return null;

  const combinedContent = notices.map(n => n.content).join("   •   ");
  const bgColor = notices[0].bg_color || "#f97316";
  const textColor = notices[0].text_color || "#ffffff";

  return (
    <div className="relative overflow-hidden h-9" style={{ backgroundColor: bgColor }}>
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3 bg-inherit">
        <Megaphone className="w-4 h-4" style={{ color: textColor }} />
      </div>
      
      <div className="absolute inset-0 pl-10 flex items-center overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: Math.max(15, combinedContent.length * 0.12),
              ease: "linear",
            },
          }}
        >
          <span className="text-sm font-medium font-bengali px-4" style={{ color: textColor }}>
            {combinedContent}
          </span>
          <span className="text-sm font-medium font-bengali px-4" style={{ color: textColor }}>
            {combinedContent}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
