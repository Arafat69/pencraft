import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  twitter: z.string().max(100).optional(),
  linkedin: z.string().max(200).optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export default function AuthorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id && id !== "new";

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    twitter: "",
    linkedin: "",
    website: "",
    avatar_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing) {
      const fetchAuthor = async () => {
        const { data, error } = await supabase
          .from("authors")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          toast({
            title: "Author not found",
            variant: "destructive",
          });
          navigate("/admin/authors");
        } else {
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            email: data.email || "",
            twitter: data.twitter || "",
            linkedin: data.linkedin || "",
            website: data.website || "",
            avatar_url: data.avatar_url || "",
          });
        }
        setLoading(false);
      };
      fetchAuthor();
    }
  }, [id, isEditing, navigate, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(`authors/${fileName}`, file);

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
        .getPublicUrl(`authors/${fileName}`);
      setFormData((prev) => ({ ...prev, avatar_url: urlData.publicUrl }));
      toast({ title: "Image uploaded successfully" });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = authorSchema.safeParse(formData);
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

    const authorData = {
      name: formData.name,
      bio: formData.bio || null,
      email: formData.email || null,
      twitter: formData.twitter || null,
      linkedin: formData.linkedin || null,
      website: formData.website || null,
      avatar_url: formData.avatar_url || null,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("authors")
        .update(authorData)
        .eq("id", id);

      if (error) {
        if (import.meta.env.DEV) console.error("Update error:", error);
        toast({
          title: "Error updating author",
          description: "Please try again",
          variant: "destructive",
        });
      } else {
        toast({ title: "Author updated successfully" });
        navigate("/admin/authors");
      }
    } else {
      const { error } = await supabase.from("authors").insert([authorData]);

      if (error) {
        if (import.meta.env.DEV) console.error("Insert error:", error);
        toast({
          title: "Error creating author",
          description: "Please try again",
          variant: "destructive",
        });
      } else {
        toast({ title: "Author created successfully" });
        navigate("/admin/authors");
      }
    }

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
        onClick={() => navigate("/admin/authors")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Authors
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h1 className="text-2xl font-display font-bold mb-6">
          {isEditing ? "Edit Author" : "Add New Author"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="mt-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <Button type="button" variant="outline" asChild disabled={uploading}>
                    <span>
                      {uploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Image
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Author name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="author@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short bio about the author"
              rows={4}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website}</p>
              )}
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
                "Update Author"
              ) : (
                "Create Author"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/authors")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
