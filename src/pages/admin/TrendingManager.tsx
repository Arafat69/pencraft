import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  is_trending: boolean | null;
  published_at: string | null;
  author: { name: string } | null;
}

export default function TrendingManager() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id, title, slug, is_trending, published_at,
        author:authors(name)
      `)
      .order("is_trending", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      if (import.meta.env.DEV) console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleTrending = async (postId: string, currentStatus: boolean | null) => {
    setUpdating(postId);

    const { error } = await supabase
      .from("posts")
      .update({ is_trending: !currentStatus })
      .eq("id", postId);

    if (error) {
      toast({
        title: "Error updating post",
        variant: "destructive",
      });
    } else {
      toast({
        title: currentStatus ? "Removed from trending" : "Added to trending",
      });
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, is_trending: !currentStatus } : p
        )
      );
    }

    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const trendingPosts = posts.filter((p) => p.is_trending);
  const otherPosts = posts.filter((p) => !p.is_trending);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Trending Posts</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Currently Trending ({trendingPosts.length})
          </h2>
          {trendingPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 bg-card rounded-xl border border-border"
            >
              <p className="text-muted-foreground">No trending posts</p>
            </motion.div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author?.name || "-"}</TableCell>
                      <TableCell>
                        {post.published_at ? (
                          <Badge variant="secondary">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTrending(post.id, post.is_trending)}
                          disabled={updating === post.id}
                        >
                          {updating === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 mr-2" />
                              Remove
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Other Posts</h2>
          {otherPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No other posts</p>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author?.name || "-"}</TableCell>
                      <TableCell>
                        {post.published_at ? (
                          <Badge variant="secondary">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTrending(post.id, post.is_trending)}
                          disabled={updating === post.id}
                        >
                          {updating === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Add Trending
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
