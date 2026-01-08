import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2, Trash2, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  post_slug: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  username?: string;
}

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCooldown, setSubmitCooldown] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    setIsLoading(true);
    
    // First get comments
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: true });

    if (commentsError) {
      if (import.meta.env.DEV) {
        console.error("Error fetching comments:", commentsError);
      }
      toast.error("Unable to load comments");
      setIsLoading(false);
      return;
    }

    if (!commentsData || commentsData.length === 0) {
      setComments([]);
      setIsLoading(false);
      return;
    }

    // Get unique user IDs
    const userIds = [...new Set(commentsData.map((c) => c.user_id))];
    
    // Fetch profiles for those users
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);

    // Map profiles to comments
    const profileMap = new Map(profilesData?.map((p) => [p.id, p.username]) || []);
    
    const commentsWithUsernames = commentsData.map((comment) => ({
      ...comment,
      username: profileMap.get(comment.user_id) || "Anonymous",
    }));

    setComments(commentsWithUsernames);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    
    const content = parentId ? replyContent : newComment;
    if (!content.trim() || !user || submitCooldown) return;

    // Validate content length (max 5000 characters)
    if (content.length > 5000) {
      toast.error("Comment is too long (max 5000 characters)");
      return;
    }

    setIsSubmitting(true);
    setSubmitCooldown(true);
    
    const { error } = await supabase.from("comments").insert({
      post_slug: postSlug,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId,
    });

    if (error) {
      if (import.meta.env.DEV) {
        console.error("Error posting comment:", error);
      }
      toast.error("Failed to post comment");
    } else {
      toast.success(parentId ? "Reply posted!" : "Comment posted!");
      if (parentId) {
        setReplyContent("");
        setReplyTo(null);
      } else {
        setNewComment("");
      }
      fetchComments();
    }
    setIsSubmitting(false);
    
    // 3 second cooldown between submissions
    setTimeout(() => setSubmitCooldown(false), 3000);
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast.error("Failed to delete comment");
    } else {
      toast.success("Comment deleted");
      fetchComments();
    }
  };

  const topLevelComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? "ml-8 border-l-2 border-border pl-4" : ""}`}
    >
      <div className="flex gap-3 py-4">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold shrink-0">
          {comment.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">
              {comment.username || "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-foreground/85 text-sm leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {user && !isReply && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}
            {user?.id === comment.user_id && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {replyTo === comment.id && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={(e) => handleSubmit(e, comment.id)}
                className="mt-3"
              >
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Reply
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Render Replies */}
      {getReplies(comment.id).map((reply) => renderComment(reply, true))}
    </motion.div>
  );

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-accent" />
        <h3 className="font-display text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end mt-3">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-card rounded-xl text-center mb-8">
          <p className="text-muted-foreground mb-4">
            Join the conversation! Sign in to leave a comment.
          </p>
          <Link to="/auth">
            <Button>Sign In to Comment</Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : topLevelComments.length > 0 ? (
        <div className="divide-y divide-border">
          {topLevelComments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
}
