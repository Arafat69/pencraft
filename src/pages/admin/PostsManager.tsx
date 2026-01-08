import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_featured: boolean | null;
  is_trending: boolean | null;
  published_at: string | null;
  created_at: string;
  author: { name: string } | null;
  category: { name: string } | null;
}

export default function PostsManager() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:authors(name),
        category:categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      if (import.meta.env.DEV) console.error("Error fetching posts:", error);
      toast({
        title: "Error loading posts",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    const { error } = await supabase.from("posts").delete().eq("id", deleteId);

    if (error) {
      if (import.meta.env.DEV) console.error("Error deleting post:", error);
      toast({
        title: "Error deleting post",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      toast({ title: "Post deleted successfully" });
      setPosts(posts.filter((p) => p.id !== deleteId));
    }

    setDeleting(false);
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Posts</h1>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-card rounded-xl border border-border"
        >
          <p className="text-muted-foreground mb-4">No posts yet</p>
          <Button asChild>
            <Link to="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Post
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium line-clamp-1">{post.title}</p>
                      <div className="flex gap-1 mt-1">
                        {post.is_featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                        {post.is_trending && (
                          <Badge variant="outline" className="text-xs">Trending</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author?.name || "-"}</TableCell>
                  <TableCell>{post.category?.name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {post.published_at ? (
                        <>
                          <Eye className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Draft</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/posts/${post.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
