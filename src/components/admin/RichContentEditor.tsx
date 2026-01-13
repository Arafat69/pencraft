import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Plus, Trash2, Type, Image as ImageIcon, Heading1, Heading2, Quote, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ContentBlock {
  id: string;
  type: "heading1" | "heading2" | "paragraph" | "image" | "quote";
  content: string;
  imageUrl?: string;
  caption?: string;
}

interface RichContentEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function RichContentEditor({ blocks, onChange }: RichContentEditorProps) {
  const { toast } = useToast();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large (max 10MB)", variant: "destructive" });
      return;
    }

    setUploadingId(blockId);
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(`content/${fileName}`, file);

    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(`content/${fileName}`);
      updateBlock(blockId, { imageUrl: urlData.publicUrl });
      toast({ title: "Image uploaded" });
    }
    setUploadingId(null);
  };

  const renderBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case "heading1":
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="বড় শিরোনাম / Main Heading"
            className="text-2xl font-bold font-bengali-display"
          />
        );
      case "heading2":
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="উপ-শিরোনাম / Subheading"
            className="text-xl font-semibold font-bengali-display"
          />
        );
      case "paragraph":
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="অনুচ্ছেদ লিখুন... / Write paragraph..."
            rows={4}
            className="font-bengali"
          />
        );
      case "quote":
        return (
          <div className="space-y-2">
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="উদ্ধৃতি... / Quote text..."
              rows={2}
              className="italic border-l-4 border-accent pl-4 font-bengali"
            />
            <Input
              value={block.caption || ""}
              onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              placeholder="— উদ্ধৃতির উৎস / Quote source"
              className="text-sm text-muted-foreground"
            />
          </div>
        );
      case "image":
        return (
          <div className="space-y-2">
            {block.imageUrl ? (
              <div className="relative">
                <img
                  src={block.imageUrl}
                  alt="Content"
                  className="w-full max-h-80 object-cover rounded-lg"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(block.id, file);
                    }}
                  />
                  <span className="text-white font-medium">Change Image</span>
                </label>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(block.id, file);
                  }}
                />
                <div className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 bg-muted/50">
                  {uploadingId === block.id ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload image</span>
                    </>
                  )}
                </div>
              </label>
            )}
            <Input
              value={block.caption || ""}
              onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              placeholder="ছবির ক্যাপশন / Image caption (optional)"
              className="text-sm"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getBlockIcon = (type: ContentBlock["type"]) => {
    switch (type) {
      case "heading1":
        return <Heading1 className="h-4 w-4" />;
      case "heading2":
        return <Heading2 className="h-4 w-4" />;
      case "paragraph":
        return <Type className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "quote":
        return <Quote className="h-4 w-4" />;
    }
  };

  const getBlockLabel = (type: ContentBlock["type"]) => {
    switch (type) {
      case "heading1":
        return "শিরোনাম / Heading";
      case "heading2":
        return "উপ-শিরোনাম / Subheading";
      case "paragraph":
        return "অনুচ্ছেদ / Paragraph";
      case "image":
        return "ছবি / Image";
      case "quote":
        return "উদ্ধৃতি / Quote";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Content Blocks</label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => addBlock("heading1")}>
            <Heading1 className="h-4 w-4 mr-1" /> H1
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => addBlock("heading2")}>
            <Heading2 className="h-4 w-4 mr-1" /> H2
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => addBlock("paragraph")}>
            <Type className="h-4 w-4 mr-1" /> Text
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => addBlock("image")}>
            <ImageIcon className="h-4 w-4 mr-1" /> Image
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => addBlock("quote")}>
            <Quote className="h-4 w-4 mr-1" /> Quote
          </Button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Type className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No content blocks yet</p>
          <div className="flex justify-center gap-2">
            <Button type="button" variant="secondary" onClick={() => addBlock("heading1")}>
              <Plus className="h-4 w-4 mr-1" /> Add Heading
            </Button>
            <Button type="button" variant="secondary" onClick={() => addBlock("paragraph")}>
              <Plus className="h-4 w-4 mr-1" /> Add Paragraph
            </Button>
          </div>
        </div>
      ) : (
        <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-4">
          {blocks.map((block) => (
            <Reorder.Item key={block.id} value={block}>
              <motion.div
                layout
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getBlockIcon(block.type)}
                    <span>{getBlockLabel(block.type)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-destructive hover:text-destructive"
                    onClick={() => removeBlock(block.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {renderBlockEditor(block)}
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {blocks.length > 0 && (
        <div className="flex justify-center pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => addBlock("paragraph")}>
              <Plus className="h-4 w-4 mr-1" /> Add Block
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
