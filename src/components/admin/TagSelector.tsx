import { useState, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  postId?: string;
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

export default function TagSelector({ postId, selectedTags, onChange }: TagSelectorProps) {
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching tags:", error);
    } else {
      setTags(data || []);
    }
    setLoading(false);
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const createAndAddTag = async () => {
    if (!newTagName.trim()) return;

    setCreating(true);
    const slug = newTagName
      .toLowerCase()
      .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data, error } = await supabase
      .from("tags")
      .insert([{ name: newTagName.trim(), slug }])
      .select()
      .single();

    if (error) {
      if (error.message.includes("unique")) {
        toast({ title: "Tag already exists", variant: "destructive" });
      } else {
        toast({ title: "Error creating tag", variant: "destructive" });
      }
    } else if (data) {
      setTags([...tags, data]);
      onChange([...selectedTags, data.id]);
      setNewTagName("");
      toast({ title: "Tag created and added" });
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading tags...</span>
      </div>
    );
  }

  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id));
  const availableTags = tags.filter((tag) => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Tags</label>

      {/* Selected Tags */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagObjects.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-destructive/20"
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
              onClick={() => toggleTag(tag.id)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Create New Tag */}
      <div className="flex gap-2">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Create new tag..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              createAndAddTag();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={createAndAddTag}
          disabled={!newTagName.trim() || creating}
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
