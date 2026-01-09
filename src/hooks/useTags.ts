import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbTag = Tables<"tags"> & {
  postCount?: number;
};

// Fetch all tags
export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data: tags, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;

      // Get post counts for each tag
      const tagsWithCounts = await Promise.all(
        (tags || []).map(async (tag) => {
          const { count } = await supabase
            .from("post_tags")
            .select("*", { count: "exact", head: true })
            .eq("tag_id", tag.id);

          return { ...tag, postCount: count || 0 } as DbTag;
        })
      );

      return tagsWithCounts;
    },
  });
}

// Fetch single tag by slug
export function useTag(slug: string) {
  return useQuery({
    queryKey: ["tag", slug],
    queryFn: async () => {
      const { data: tag, error } = await supabase
        .from("tags")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // Get post count
      const { count } = await supabase
        .from("post_tags")
        .select("*", { count: "exact", head: true })
        .eq("tag_id", tag.id);

      return { ...tag, postCount: count || 0 } as DbTag;
    },
    enabled: !!slug,
  });
}
