import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Star, StarOff } from "lucide-react";
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
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  slug: string;
  is_featured: boolean | null;
  published_at: string | null;
  author: { name: string } | null;
}

export default function FeaturedManager() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id, title, slug, is_featured, published_at,
        author:authors(name)
      `)
      .order("is_featured", { ascending: false })
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

  const toggleFeatured = async (postId: string, currentStatus: boolean | null) => {
    setUpdating(postId);

    const { error } = await supabase
      .from("posts")
      .update({ is_featured: !currentStatus })
      .eq("id", postId);

    if (error) {
      toast({
        title: "Error updating post",
        variant: "destructive",
      });
    } else {
      toast({
        title: currentStatus ? "Removed from featured" : "Added to featured",
      });
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, is_featured: !currentStatus } : p
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

  const featuredPosts = posts.filter((p) => p.is_featured);
  const otherPosts = posts.filter((p) => !p.is_featured);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Featured Posts</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Currently Featured ({featuredPosts.length})
          </h2>
          {featuredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 bg-card rounded-xl border border-border"
            >
              <p className="text-muted-foreground">No featured posts</p>
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
                  {featuredPosts.map((post) => (
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
                          onClick={() => toggleFeatured(post.id, post.is_featured)}
                          disabled={updating === post.id}
                        >
                          {updating === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <StarOff className="h-4 w-4 mr-2" />
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
                          onClick={() => toggleFeatured(post.id, post.is_featured)}
                          disabled={updating === post.id}
                        >
                          {updating === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Feature
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
