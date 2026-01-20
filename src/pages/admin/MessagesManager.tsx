import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  Archive,
  Loader2,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import {
  useContactMessages,
  useMarkAsRead,
  useArchiveMessage,
  useDeleteMessage,
  ContactMessage,
} from "@/hooks/useContactMessages";
import { format, formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { toast } from "sonner";

export default function MessagesManager() {
  const { data: messages, isLoading } = useContactMessages();
  const markAsRead = useMarkAsRead();
  const archiveMessage = useArchiveMessage();
  const deleteMessage = useDeleteMessage();

  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredMessages = (messages || []).filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = (messages || []).filter((m) => !m.is_read).length;

  const handleOpenMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
    if (!message.is_read) {
      markAsRead.mutate(message.id);
    }
  };

  const handleArchive = (id: string) => {
    archiveMessage.mutate(id, {
      onSuccess: () => {
        toast.success("মেসেজ আর্কাইভ করা হয়েছে");
        setIsDetailOpen(false);
      },
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMessage.mutate(deleteId, {
        onSuccess: () => {
          toast.success("মেসেজ মুছে ফেলা হয়েছে");
          setDeleteId(null);
          setIsDetailOpen(false);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-bold text-foreground">মেসেজ ইনবক্স</h1>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} নতুন
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            মোট {messages?.length || 0} টি মেসেজ
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="নাম, ইমেইল বা মেসেজ দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">কোনো মেসেজ পাওয়া যায়নি</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleOpenMessage(message)}
                className={`group p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  message.is_read
                    ? "bg-card border-border hover:bg-muted/50"
                    : "bg-accent/5 border-accent/30 hover:bg-accent/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-full ${
                      message.is_read
                        ? "bg-muted text-muted-foreground"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {message.is_read ? (
                      <MailOpen className="w-5 h-5" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium truncate ${
                          !message.is_read && "text-accent"
                        }`}
                      >
                        {message.name}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: bn,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {message.email}
                    </p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {message.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(message.id);
                      }}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(message.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" />
              মেসেজ বিস্তারিত
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6 mt-4">
              {/* Sender Info */}
              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedMessage.name}</h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(selectedMessage.created_at), "dd MMM yyyy, hh:mm a")}
                  </span>
                  {selectedMessage.is_read && (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      পড়া হয়েছে
                    </span>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="p-4 border border-border rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">মেসেজ</h4>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => handleArchive(selectedMessage.id)}
                  className="gap-2"
                >
                  <Archive className="w-4 h-4" />
                  আর্কাইভ
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteId(selectedMessage.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    মুছে ফেলুন
                  </Button>
                  <Button asChild className="gap-2">
                    <a href={`mailto:${selectedMessage.email}`}>
                      <Mail className="w-4 h-4" />
                      উত্তর দিন
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>মেসেজ মুছে ফেলতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              এই মেসেজটি স্থায়ীভাবে মুছে ফেলা হবে এবং পুনরুদ্ধার করা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
