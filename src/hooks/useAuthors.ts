import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbAuthor = Tables<"authors"> & {
  postCount?: number;
};

// Fetch all authors
export function useAuthors() {
  return useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data: authors, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");

      if (error) throw error;

      // Get post counts for each author
      const authorsWithCounts = await Promise.all(
        (authors || []).map(async (author) => {
          const { count } = await supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("author_id", author.id);

          return { ...author, postCount: count || 0 } as DbAuthor;
        })
      );

      return authorsWithCounts;
    },
  });
}

// Fetch single author by ID
export function useAuthor(id: string) {
  return useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      const { data: author, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Get post count
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id", author.id);

      return { ...author, postCount: count || 0 } as DbAuthor;
    },
    enabled: !!id,
  });
}
