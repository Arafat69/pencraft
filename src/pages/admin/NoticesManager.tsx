import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical, Eye, EyeOff, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  useNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
  Notice,
} from "@/hooks/useNotices";

export default function NoticesManager() {
  const { data: notices, isLoading } = useNotices();
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    is_active: true,
    display_order: 0,
    bg_color: "#f97316",
    text_color: "#ffffff",
  });

  const resetForm = () => {
    setFormData({
      content: "",
      is_active: true,
      display_order: notices?.length || 0,
      bg_color: "#f97316",
      text_color: "#ffffff",
    });
    setEditingNotice(null);
  };

  const handleOpenDialog = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        content: notice.content,
        is_active: notice.is_active,
        display_order: notice.display_order,
        bg_color: notice.bg_color || "#f97316",
        text_color: notice.text_color || "#ffffff",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNotice) {
      await updateNotice.mutateAsync({
        id: editingNotice.id,
        ...formData,
      });
    } else {
      await createNotice.mutateAsync(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleToggleActive = async (notice: Notice) => {
    await updateNotice.mutateAsync({
      id: notice.id,
      is_active: !notice.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteNotice.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-display font-bold">Notice Bar</h1>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? "Edit Notice" : "Create New Notice"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="content">Notice Content (বাংলা/English)</Label>
                <Input
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="আপনার বার্তা লিখুন / Enter your message"
                  required
                  className="font-bengali"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bg_color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg_color"
                      type="color"
                      value={formData.bg_color}
                      onChange={(e) =>
                        setFormData({ ...formData, bg_color: e.target.value })
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.bg_color}
                      onChange={(e) =>
                        setFormData({ ...formData, bg_color: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text_color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text_color"
                      type="color"
                      value={formData.text_color}
                      onChange={(e) =>
                        setFormData({ ...formData, text_color: e.target.value })
                      }
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.text_color}
                      onChange={(e) =>
                        setFormData({ ...formData, text_color: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              {/* Preview */}
              <div className="mt-4">
                <Label>Preview</Label>
                <div
                  className="mt-2 p-3 rounded-lg flex items-center gap-2"
                  style={{
                    backgroundColor: formData.bg_color,
                    color: formData.text_color,
                  }}
                >
                  <Megaphone className="w-4 h-4" />
                  <span className="text-sm font-bengali">
                    {formData.content || "Your notice will appear here..."}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createNotice.isPending || updateNotice.isPending}
                >
                  {editingNotice ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {notices?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notices yet. Create one to display on your website.</p>
            </CardContent>
          </Card>
        ) : (
          notices?.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={!notice.is_active ? "opacity-60" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="text-muted-foreground cursor-grab">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Color preview */}
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-border"
                      style={{ backgroundColor: notice.bg_color || "#f97316" }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-bengali truncate">{notice.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Order: {notice.display_order}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(notice)}
                        title={notice.is_active ? "Hide" : "Show"}
                      >
                        {notice.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(notice)}
                      >
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this notice? This
                              action cannot be undone.
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
          ))
        )}
      </div>
    </div>
  );
}
