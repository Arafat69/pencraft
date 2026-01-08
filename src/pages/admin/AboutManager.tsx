import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AboutManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    about_title: "",
    about_content: "",
    about_mission: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["about_title", "about_content", "about_mission"]);

      if (error) {
        if (import.meta.env.DEV) console.error("Error fetching settings:", error);
      } else if (data) {
        const settings: Record<string, string> = {};
        data.forEach((item) => {
          settings[item.key] = item.value || "";
        });
        setFormData({
          about_title: settings.about_title || "",
          about_content: settings.about_content || "",
          about_mission: settings.about_mission || "",
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updates = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(update, { onConflict: "key" });

      if (error) {
        if (import.meta.env.DEV) console.error("Error saving:", error);
        toast({
          title: "Error saving settings",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    toast({ title: "About Us content saved" });
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
      <h1 className="text-2xl font-display font-bold mb-6">About Us</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="about_title">Page Title</Label>
            <Input
              id="about_title"
              name="about_title"
              value={formData.about_title}
              onChange={handleChange}
              placeholder="About Our Blog"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_content">Main Content</Label>
            <Textarea
              id="about_content"
              name="about_content"
              value={formData.about_content}
              onChange={handleChange}
              placeholder="Tell visitors about your blog..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_mission">Our Mission</Label>
            <Textarea
              id="about_mission"
              name="about_mission"
              value={formData.about_mission}
              onChange={handleChange}
              placeholder="Describe your blog's mission..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
