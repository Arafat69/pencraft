import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentMethod } from "@/lib/bangladeshData";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: PaymentMethod;
  transactionId: string;
  onTransactionIdChange: (value: string) => void;
  onConfirm: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  paymentMethod,
  transactionId,
  onTransactionIdChange,
  onConfirm,
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentMethod.number);
      setCopied(true);
      toast.success("নাম্বার কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("কপি করা যায়নি");
    }
  };

  const handleConfirm = () => {
    if (!transactionId.trim()) {
      toast.error("Transaction ID দিন");
      return;
    }
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header with brand color */}
        <div
          className="p-6 text-white"
          style={{ backgroundColor: paymentMethod.color }}
        >
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3 text-xl">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              {paymentMethod.name} পেমেন্ট
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Number */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">পেমেন্ট নাম্বার</Label>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 p-4 rounded-xl border-2 font-mono text-xl font-bold text-center"
                style={{ borderColor: paymentMethod.color, color: paymentMethod.color }}
              >
                {paymentMethod.number}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-14 w-14 shrink-0"
                style={{ 
                  borderColor: paymentMethod.color,
                  color: copied ? "#22c55e" : paymentMethod.color 
                }}
                onClick={handleCopy}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div
            className="p-4 rounded-xl space-y-2"
            style={{ backgroundColor: `${paymentMethod.color}15` }}
          >
            <p className="font-medium" style={{ color: paymentMethod.color }}>
              📋 পেমেন্ট নির্দেশনা:
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>উপরের নাম্বারে <strong>Send Money</strong> করুন</li>
              <li>টাকা পাঠানোর পর <strong>Transaction ID</strong> কপি করুন</li>
              <li>নিচের ঘরে Transaction ID বসান</li>
              <li>"নিশ্চিত করুন" বাটনে ক্লিক করুন</li>
            </ol>
          </div>

          {/* Transaction ID Input */}
          <div className="space-y-2">
            <Label htmlFor="transactionId" className="text-base font-semibold">
              Transaction ID *
            </Label>
            <Input
              id="transactionId"
              placeholder="যেমন: TRX123456789"
              value={transactionId}
              onChange={(e) => onTransactionIdChange(e.target.value)}
              className="h-12 text-base"
              style={{ borderColor: transactionId ? paymentMethod.color : undefined }}
            />
            <p className="text-xs text-muted-foreground">
              Send Money করার পর যে Transaction ID পাবেন সেটি এখানে লিখুন
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              বাতিল
            </Button>
            <Button
              type="button"
              className="flex-1 text-white"
              style={{ backgroundColor: paymentMethod.color }}
              onClick={handleConfirm}
            >
              <Check className="w-4 h-4 mr-2" />
              নিশ্চিত করুন
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
