import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, Eye, EyeOff, Image, Type, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  usePopupNotices,
  useCreatePopupNotice,
  useUpdatePopupNotice,
  useDeletePopupNotice,
  PopupNotice,
} from "@/hooks/usePopupNotices";

const displayTypeIcons = {
  text: Type,
  image: Image,
  both: Layers,
};

const displayTypeLabels = {
  text: "Text Only",
  image: "Image Only",
  both: "Image & Text",
};

export default function PopupManager() {
  const { data: notices, isLoading } = usePopupNotices();
  const createMutation = useCreatePopupNotice();
  const updateMutation = useUpdatePopupNotice();
  const deleteMutation = useDeletePopupNotice();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<PopupNotice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    link_url: "",
    button_text: "Learn More",
    display_type: "both" as "text" | "image" | "both",
    is_active: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image_url: "",
      link_url: "",
      button_text: "Learn More",
      display_type: "both",
      is_active: false,
    });
    setEditingNotice(null);
  };

  const openEditDialog = (notice: PopupNotice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      content: notice.content || "",
      image_url: notice.image_url || "",
      link_url: notice.link_url || "",
      button_text: notice.button_text || "Learn More",
      display_type: notice.display_type,
      is_active: notice.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on display type
    if (formData.display_type === "image" && !formData.image_url) {
      toast.error("Image URL is required for image-only popups");
      return;
    }
    if (formData.display_type === "text" && !formData.title && !formData.content) {
      toast.error("Title or content is required for text-only popups");
      return;
    }
    if (formData.display_type === "both" && !formData.image_url && !formData.title && !formData.content) {
      toast.error("Please provide image or text content");
      return;
    }

    try {
      if (editingNotice) {
        await updateMutation.mutateAsync({
          id: editingNotice.id,
          ...formData,
        });
        toast.success("Popup notice updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Popup notice created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save popup notice");
    }
  };

  const handleToggleActive = async (notice: PopupNotice) => {
    try {
      await updateMutation.mutateAsync({
        id: notice.id,
        is_active: !notice.is_active,
      });
      toast.success(notice.is_active ? "Popup deactivated" : "Popup activated");
    } catch (error) {
      toast.error("Failed to update popup status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Popup notice deleted");
    } catch (error) {
      toast.error("Failed to delete popup notice");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Popup Notices</h1>
          <p className="text-sm text-muted-foreground">
            Manage popup notices shown to visitors
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Popup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? "Edit Popup Notice" : "Create Popup Notice"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Type */}
              <div className="space-y-2">
                <Label>Display Type</Label>
                <Select
                  value={formData.display_type}
                  onValueChange={(value: "text" | "image" | "both") =>
                    setFormData({ ...formData, display_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Image & Text
                      </span>
                    </SelectItem>
                    <SelectItem value="image">
                      <span className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Image Only
                      </span>
                    </SelectItem>
                    <SelectItem value="text">
                      <span className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Text Only
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image URL - show for image and both */}
              {(formData.display_type === "image" || formData.display_type === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL *</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>
              )}

              {/* Title - show for text and both */}
              {(formData.display_type === "text" || formData.display_type === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Popup title"
                  />
                </div>
              )}

              {/* Content - show for text and both */}
              {(formData.display_type === "text" || formData.display_type === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Popup message content"
                    rows={3}
                  />
                </div>
              )}

              {/* Link URL */}
              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL (optional)</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://example.com/page"
                />
              </div>

              {/* Button Text - show if link and text */}
              {formData.link_url && (formData.display_type === "text" || formData.display_type === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Learn More"
                  />
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="is_active" className="font-medium">
                    Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show this popup to visitors
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingNotice ? "Update Popup" : "Create Popup"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : notices && notices.length > 0 ? (
        <div className="grid gap-4">
          {notices.map((notice, index) => {
            const IconComponent = displayTypeIcons[notice.display_type];
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={notice.is_active ? "border-accent" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Preview Image */}
                      {notice.image_url && (
                        <img
                          src={notice.image_url}
                          alt=""
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {displayTypeLabels[notice.display_type]}
                          </span>
                          {notice.is_active && (
                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        {notice.title && (
                          <h3 className="font-semibold text-foreground truncate">
                            {notice.title}
                          </h3>
                        )}
                        {notice.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notice.content}
                          </p>
                        )}
                        {notice.link_url && (
                          <p className="text-xs text-accent truncate mt-1">
                            {notice.link_url}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(notice)}
                          title={notice.is_active ? "Deactivate" : "Activate"}
                        >
                          {notice.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(notice)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Popup Notice?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(notice.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No popup notices yet. Create one to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
