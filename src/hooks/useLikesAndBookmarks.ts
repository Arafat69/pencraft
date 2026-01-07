import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useLikesAndBookmarks(postSlug: string) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [postSlug, user]);

  const fetchData = async () => {
    setLoading(true);
    
    // Get total like count
    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_slug", postSlug);
    
    setLikeCount(count || 0);

    // Check if current user liked/bookmarked
    if (user) {
      const [likeResult, bookmarkResult] = await Promise.all([
        supabase
          .from("post_likes")
          .select("id")
          .eq("post_slug", postSlug)
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("bookmarks")
          .select("id")
          .eq("post_slug", postSlug)
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      setLiked(!!likeResult.data);
      setBookmarked(!!bookmarkResult.data);
    }

    setLoading(false);
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      if (liked) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_slug", postSlug)
          .eq("user_id", user.id);
        setLikeCount((prev) => prev - 1);
        setLiked(false);
        toast.success("Removed from likes");
      } else {
        await supabase
          .from("post_likes")
          .insert({ post_slug: postSlug, user_id: user.id });
        setLikeCount((prev) => prev + 1);
        setLiked(true);
        toast.success("Added to likes!");
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      toast.error("Please sign in to bookmark posts");
      return;
    }

    try {
      if (bookmarked) {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("post_slug", postSlug)
          .eq("user_id", user.id);
        setBookmarked(false);
        toast.success("Removed from bookmarks");
      } else {
        await supabase
          .from("bookmarks")
          .insert({ post_slug: postSlug, user_id: user.id });
        setBookmarked(true);
        toast.success("Saved to bookmarks!");
      }
    } catch (error: any) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  return {
    liked,
    bookmarked,
    likeCount,
    loading,
    toggleLike,
    toggleBookmark,
  };
}
