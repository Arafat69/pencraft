import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbCategory = Tables<"categories"> & {
  postCount?: number;
};

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;

      // Get post counts for each category
      const categoriesWithCounts = await Promise.all(
        (categories || []).map(async (category) => {
          const { count } = await supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id);

          return { ...category, postCount: count || 0 } as DbCategory;
        })
      );

      return categoriesWithCounts;
    },
  });
}

// Fetch single category by slug
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data: category, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // Get post count
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id);

      return { ...category, postCount: count || 0 } as DbCategory;
    },
    enabled: !!slug,
  });
}
