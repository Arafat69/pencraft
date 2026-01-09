import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbPost = Tables<"posts"> & {
  author: Tables<"authors"> | null;
  category: Tables<"categories"> | null;
  tags: Tables<"tags">[];
};

// Fetch all posts with author and category
export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .order("published_at", { ascending: false });

      if (error) throw error;

      // Fetch tags for each post
      const postsWithTags = await Promise.all(
        (posts || []).map(async (post) => {
          const { data: postTags } = await supabase
            .from("post_tags")
            .select("tag_id")
            .eq("post_id", post.id);

          let tags: Tables<"tags">[] = [];
          if (postTags && postTags.length > 0) {
            const tagIds = postTags.map((pt) => pt.tag_id);
            const { data: tagsData } = await supabase
              .from("tags")
              .select("*")
              .in("id", tagIds);
            tags = tagsData || [];
          }

          return { ...post, tags } as DbPost;
        })
      );

      return postsWithTags;
    },
  });
}

// Fetch featured posts
export function useFeaturedPosts() {
  return useQuery({
    queryKey: ["posts", "featured"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq("is_featured", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (posts || []).map((post) => ({ ...post, tags: [] })) as DbPost[];
    },
  });
}

// Fetch trending posts
export function useTrendingPosts() {
  return useQuery({
    queryKey: ["posts", "trending"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq("is_trending", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (posts || []).map((post) => ({ ...post, tags: [] })) as DbPost[];
    },
  });
}

// Fetch single post by slug
export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // Fetch tags
      const { data: postTags } = await supabase
        .from("post_tags")
        .select("tag_id")
        .eq("post_id", post.id);

      let tags: Tables<"tags">[] = [];
      if (postTags && postTags.length > 0) {
        const tagIds = postTags.map((pt) => pt.tag_id);
        const { data: tagsData } = await supabase
          .from("tags")
          .select("*")
          .in("id", tagIds);
        tags = tagsData || [];
      }

      return { ...post, tags } as DbPost;
    },
    enabled: !!slug,
  });
}

// Fetch posts by category
export function usePostsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ["posts", "category", categorySlug],
    queryFn: async () => {
      // First get the category
      const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .single();

      if (!category) return [];

      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq("category_id", category.id)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (posts || []).map((post) => ({ ...post, tags: [] })) as DbPost[];
    },
    enabled: !!categorySlug,
  });
}

// Fetch posts by author
export function usePostsByAuthor(authorId: string) {
  return useQuery({
    queryKey: ["posts", "author", authorId],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq("author_id", authorId)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (posts || []).map((post) => ({ ...post, tags: [] })) as DbPost[];
    },
    enabled: !!authorId,
  });
}

// Fetch posts by tag
export function usePostsByTag(tagSlug: string) {
  return useQuery({
    queryKey: ["posts", "tag", tagSlug],
    queryFn: async () => {
      // First get the tag
      const { data: tag } = await supabase
        .from("tags")
        .select("*")
        .eq("slug", tagSlug)
        .single();

      if (!tag) return [];

      // Get post IDs with this tag
      const { data: postTags } = await supabase
        .from("post_tags")
        .select("post_id")
        .eq("tag_id", tag.id);

      if (!postTags || postTags.length === 0) return [];

      const postIds = postTags.map((pt) => pt.post_id);

      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .in("id", postIds)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (posts || []).map((post) => ({ ...post, tags: [] })) as DbPost[];
    },
    enabled: !!tagSlug,
  });
}
