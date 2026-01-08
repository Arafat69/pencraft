import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  twitter: string | null;
  linkedin: string | null;
  website: string | null;
  created_at: string;
}

export default function AuthorsManager() {
  const { toast } = useToast();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAuthors = async () => {
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (import.meta.env.DEV) console.error("Error fetching authors:", error);
      toast({
        title: "Error loading authors",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      setAuthors(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    const { error } = await supabase.from("authors").delete().eq("id", deleteId);

    if (error) {
      if (import.meta.env.DEV) console.error("Error deleting author:", error);
      toast({
        title: "Error deleting author",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      toast({ title: "Author deleted successfully" });
      setAuthors(authors.filter((a) => a.id !== deleteId));
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
        <h1 className="text-2xl font-display font-bold">Authors</h1>
        <Button asChild>
          <Link to="/admin/authors/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Author
          </Link>
        </Button>
      </div>

      {authors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-card rounded-xl border border-border"
        >
          <p className="text-muted-foreground mb-4">No authors yet</p>
          <Button asChild>
            <Link to="/admin/authors/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Author
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Social</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={author.avatar_url || undefined} />
                        <AvatarFallback>
                          {author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{author.name}</p>
                        {author.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {author.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{author.email || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {author.twitter && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Twitter</span>
                      )}
                      {author.linkedin && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">LinkedIn</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/authors/${author.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(author.id)}
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
            <AlertDialogTitle>Delete Author</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this author? This action cannot be undone.
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
