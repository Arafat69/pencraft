import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, User, BookOpen, LogOut, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { posts, Post } from "@/lib/data";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBookmarks();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching profile:", error);
      }
    } else if (data) {
      setProfile(data);
      setUsername(data.username || "");
    }
    setLoading(false);
  };

  const fetchBookmarks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("post_slug")
      .eq("user_id", user.id);

    if (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching bookmarks:", error);
      }
      return;
    }

    const slugs = data?.map((b) => b.post_slug) || [];
    const savedPosts = posts.filter((p) => slugs.includes(p.slug));
    setBookmarkedPosts(savedPosts);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile((prev) =>
        prev ? { ...prev, avatar_url: publicUrl.publicUrl } : prev
      );
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Error uploading avatar:", error);
      }
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, username } : prev));
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Error updating profile:", error);
      }
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container-blog py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Profile Header */}
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <label
                    className={`absolute bottom-0 right-0 p-2 bg-accent rounded-full cursor-pointer hover:bg-accent/90 transition-colors ${
                      uploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-accent-foreground animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-accent-foreground" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {profile?.username || "Anonymous User"}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                {/* Sign Out Button */}
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>

              {/* Edit Profile Form */}
              <form
                onSubmit={handleUpdateProfile}
                className="mt-8 pt-6 border-t border-border"
              >
                <div className="grid gap-4 max-w-md">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={saving} className="w-fit">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Saved Posts */}
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-5 h-5 text-accent" />
                <h2 className="font-display text-xl lg:text-2xl font-semibold text-foreground">
                  Saved Articles
                </h2>
              </div>

              {bookmarkedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarkedPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-medium text-foreground mb-2">
                    No saved articles yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring and bookmark articles you want to read later
                  </p>
                  <Link to="/blog">
                    <Button>Explore Articles</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
