import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch a site setting by key
export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: ["site_settings", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .single();

      if (error) {
        // Return null if not found
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data?.value || null;
    },
  });
}

// Fetch all site settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      // Convert to key-value object
      const settings: Record<string, string> = {};
      (data || []).forEach((item) => {
        settings[item.key] = item.value || "";
      });

      return settings;
    },
  });
}
