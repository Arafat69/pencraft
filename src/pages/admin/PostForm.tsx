import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import TagSelector from "@/components/admin/TagSelector";
import RichContentEditor, { ContentBlock } from "@/components/admin/RichContentEditor";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  excerpt: z.string().max(500).optional(),
  read_time: z.string().max(50).optional(),
});

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id && id !== "new";

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    cover_image: "",
    author_id: "",
    category_id: "",
    is_featured: false,
    is_trending: false,
    read_time: "5 min read",
    published: false,
    secret_keywords: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [authorsRes, categoriesRes] = await Promise.all([
        supabase.from("authors").select("id, name").order("name"),
        supabase.from("categories").select("id, name").order("name"),
      ]);

      setAuthors(authorsRes.data || []);
      setCategories(categoriesRes.data || []);

      if (isEditing) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          toast({ title: "Post not found", variant: "destructive" });
          navigate("/admin/posts");
        } else {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            cover_image: data.cover_image || "",
            author_id: data.author_id || "",
            category_id: data.category_id || "",
            is_featured: data.is_featured || false,
            is_trending: data.is_trending || false,
            read_time: data.read_time || "5 min read",
            published: !!data.published_at,
            secret_keywords: (data.secret_keywords || []).join(", "),
          });

          // Parse content blocks from JSON
          try {
            if (data.content) {
              const parsed = JSON.parse(data.content);
              if (Array.isArray(parsed)) {
                setContentBlocks(parsed);
              } else {
                // Convert old text content to a paragraph block
                setContentBlocks([
                  { id: crypto.randomUUID(), type: "paragraph", content: data.content }
                ]);
              }
            }
          } catch {
            // Old plain text content
            if (data.content) {
              setContentBlocks([
                { id: crypto.randomUUID(), type: "paragraph", content: data.content }
              ]);
            }
          }

          // Fetch existing tags
          const { data: postTags } = await supabase
            .from("post_tags")
            .select("tag_id")
            .eq("post_id", id);

          if (postTags) {
            setSelectedTags(postTags.map((pt) => pt.tag_id));
          }
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id, isEditing, navigate, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Auto-generate slug from title
    if (name === "title" && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(`posts/${fileName}`, file);

    if (uploadError) {
      if (import.meta.env.DEV) console.error("Upload error:", uploadError);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(`posts/${fileName}`);
      setFormData((prev) => ({ ...prev, cover_image: urlData.publicUrl }));
      toast({ title: "Image uploaded successfully" });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = postSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    // Serialize content blocks to JSON
    const contentJson = JSON.stringify(contentBlocks);

    // Parse secret keywords from comma-separated string
    const secretKeywords = formData.secret_keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: contentJson,
      cover_image: formData.cover_image || null,
      author_id: formData.author_id || null,
      category_id: formData.category_id || null,
      is_featured: formData.is_featured,
      is_trending: formData.is_trending,
      read_time: formData.read_time || "5 min read",
      published_at: formData.published ? new Date().toISOString() : null,
      secret_keywords: secretKeywords,
    };

    let postId = id;

    if (isEditing) {
      const { error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", id);

      if (error) {
        if (import.meta.env.DEV) console.error("Update error:", error);
        toast({
          title: "Error updating post",
          description: error.message.includes("unique") ? "Slug already exists" : "Please try again",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert([postData])
        .select("id")
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error("Insert error:", error);
        toast({
          title: "Error creating post",
          description: error.message.includes("unique") ? "Slug already exists" : "Please try again",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
      postId = data.id;
    }

    // Update tags
    if (postId) {
      // Remove existing tags
      await supabase.from("post_tags").delete().eq("post_id", postId);

      // Add new tags
      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map((tagId) => ({
          post_id: postId,
          tag_id: tagId,
        }));
        await supabase.from("post_tags").insert(tagInserts);
      }
    }

    toast({ title: isEditing ? "Post updated successfully" : "Post created successfully" });
    navigate("/admin/posts");
    setSaving(false);
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
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin/posts")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Posts
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h1 className="text-2xl font-display font-bold mb-6">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image (Main Image)</Label>
            {formData.cover_image ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={formData.cover_image}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <Button type="button" variant="secondary" asChild>
                      <span>
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Change Image"
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <div className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 bg-muted/50">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload cover image
                      </span>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title / পোস্টের শিরোনাম"
                className="font-bengali"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="post-url-slug"
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt / সংক্ষিপ্ত বিবরণ</Label>
            <Input
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Short description of the post"
              className="font-bengali"
            />
          </div>

          {/* Rich Content Editor */}
          <RichContentEditor blocks={contentBlocks} onChange={setContentBlocks} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Author</Label>
              <Select
                value={formData.author_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, author_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="read_time">Read Time</Label>
              <Input
                id="read_time"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                placeholder="5 min read"
              />
            </div>
          </div>

          {/* Tag Selector */}
          <TagSelector
            postId={isEditing ? id : undefined}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />

          {/* Secret Keywords */}
          <div className="space-y-2">
            <Label htmlFor="secret_keywords">
              Secret Keywords (Hidden from users, used for search)
            </Label>
            <Input
              id="secret_keywords"
              name="secret_keywords"
              value={formData.secret_keywords}
              onChange={handleChange}
              placeholder="keyword1, keyword2, keyword3 (comma-separated)"
            />
            <p className="text-xs text-muted-foreground">
              These keywords won't be visible to users but will help them find this post via search.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_featured: checked }))
                }
              />
              <Label htmlFor="is_featured">Featured Post</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="is_trending"
                checked={formData.is_trending}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_trending: checked }))
                }
              />
              <Label htmlFor="is_trending">Trending Post</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, published: checked }))
                }
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/posts")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
