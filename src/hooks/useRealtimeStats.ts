import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PostStats {
  [postSlug: string]: {
    views: number;
    likes: number;
  };
}

export function useRealtimeStats(initialPosts: { slug: string; views: number; likes: number }[]) {
  // Memoize the initial stats computation
  const initialStats = useMemo(() => {
    const initial: PostStats = {};
    initialPosts.forEach((post) => {
      initial[post.slug] = { views: post.views || 0, likes: post.likes || 0 };
    });
    return initial;
  }, [JSON.stringify(initialPosts.map(p => ({ slug: p.slug, views: p.views, likes: p.likes })))]);

  const [stats, setStats] = useState<PostStats>(initialStats);

  // Update stats when initialStats changes (only when actual data changes)
  useEffect(() => {
    setStats(initialStats);
  }, [initialStats]);

  useEffect(() => {
    // Listen for real-time likes
    const likesChannel = supabase
      .channel('realtime-likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
        },
        async (payload) => {
          // Refetch like counts for affected posts
          if (payload.new && typeof payload.new === 'object' && 'post_slug' in payload.new) {
            const postSlug = payload.new.post_slug as string;
            // Use the secure RPC function to get like count
            const { data: count } = await supabase
              .rpc('get_post_like_count', { p_post_slug: postSlug });
            
            setStats((prev) => ({
              ...prev,
              [postSlug]: {
                ...prev[postSlug],
                likes: count || 0,
              },
            }));
          } else if (payload.old && typeof payload.old === 'object' && 'post_slug' in payload.old) {
            // Handle delete event
            const postSlug = payload.old.post_slug as string;
            const { data: count } = await supabase
              .rpc('get_post_like_count', { p_post_slug: postSlug });
            
            setStats((prev) => ({
              ...prev,
              [postSlug]: {
                ...prev[postSlug],
                likes: count || 0,
              },
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, []);

  const getStats = (slug: string) => stats[slug] || { views: 0, likes: 0 };

  return { stats, getStats };
}

// Hook to fetch real-time like count for a single post
export function useRealtimeLikeCount(postSlug: string) {
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postSlug) return;

    // Initial fetch
    const fetchCount = async () => {
      const { data: count } = await supabase
        .rpc('get_post_like_count', { p_post_slug: postSlug });
      setLikeCount(count || 0);
      setLoading(false);
    };

    fetchCount();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`likes-${postSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_slug=eq.${postSlug}`,
        },
        async () => {
          const { data: count } = await supabase
            .rpc('get_post_like_count', { p_post_slug: postSlug });
          setLikeCount(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postSlug]);

  return { likeCount, loading };
}
