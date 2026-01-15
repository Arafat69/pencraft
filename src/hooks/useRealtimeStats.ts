import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PostStats {
  [postSlug: string]: {
    views: number;
    likes: number;
  };
}

export function useRealtimeStats(initialPosts: { slug: string; views: number; likes: number }[]) {
  const [stats, setStats] = useState<PostStats>(() => {
    const initial: PostStats = {};
    initialPosts.forEach((post) => {
      initial[post.slug] = { views: post.views || 0, likes: post.likes || 0 };
    });
    return initial;
  });

  useEffect(() => {
    // Update stats when initialPosts changes
    const newStats: PostStats = {};
    initialPosts.forEach((post) => {
      newStats[post.slug] = { views: post.views || 0, likes: post.likes || 0 };
    });
    setStats(newStats);
  }, [initialPosts]);

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
            const { count } = await supabase
              .from('post_likes')
              .select('*', { count: 'exact', head: true })
              .eq('post_slug', postSlug);
            
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
