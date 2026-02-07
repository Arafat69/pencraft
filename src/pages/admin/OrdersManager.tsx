import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Eye, Loader2, Calendar, User, MapPin, Phone, Trash2, CreditCard, FileText, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAllOrders, useUpdateOrderStatus, useDeleteOrder, OrderWithItems } from "@/hooks/useOrders";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentMethodColors: Record<string, { bg: string; text: string; border: string }> = {
  bkash: { bg: "bg-[#E2136E]/10", text: "text-[#E2136E]", border: "border-[#E2136E]/30" },
  nagad: { bg: "bg-[#F6921E]/10", text: "text-[#F6921E]", border: "border-[#F6921E]/30" },
  rocket: { bg: "bg-[#8E24AA]/10", text: "text-[#8E24AA]", border: "border-[#8E24AA]/30" },
};

const paymentMethodNames: Record<string, string> = {
  bkash: "বিকাশ",
  nagad: "নগদ",
  rocket: "রকেট",
};

// Extended order type with new fields
interface ExtendedOrder extends OrderWithItems {
  customer_name?: string | null;
  division?: string | null;
  district?: string | null;
  payment_method?: string | null;
  transaction_id?: string | null;
}

export default function OrdersManager() {
  const { data: orders, isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder.mutate(orderId, {
      onSuccess: () => {
        setIsDetailOpen(false);
        setSelectedOrder(null);
      },
    });
  };

  const filteredOrders = ((orders || []) as ExtendedOrder[]).filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.shipping_address?.toLowerCase().includes(search.toLowerCase()) ||
      order.phone?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.transaction_id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus.mutate({ orderId, status: newStatus });
  };

  const viewOrderDetails = (order: ExtendedOrder) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
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
          <Package className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
        </div>
        <Badge variant="outline" className="text-sm">
          Total {orders?.length || 0} Orders
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, order ID, transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => {
                const paymentColors = order.payment_method ? paymentMethodColors[order.payment_method] : null;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(order.created_at), "dd MMM yyyy")}
                      <br />
                      <span className="text-xs">{format(new Date(order.created_at), "hh:mm a")}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium text-sm">
                          {order.customer_name || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {order.phone || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="text-muted-foreground">
                        {order.district && order.division
                          ? `${order.district}, ${order.division}`
                          : order.shipping_address?.slice(0, 30) || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.payment_method && paymentColors ? (
                        <Badge className={`${paymentColors.bg} ${paymentColors.text} ${paymentColors.border} border`}>
                          {paymentMethodNames[order.payment_method] || order.payment_method}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-accent">
                      ৳{order.total_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className={`w-32 h-8 text-xs border ${statusColors[order.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this order? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOrder(order.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Order ID
                  </p>
                  <p className="font-mono font-medium">#{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date & Time
                  </p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.created_at), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedOrder.status]}>
                    {statusLabels[selectedOrder.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold text-accent">
                    ৳{selectedOrder.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 border border-border rounded-lg space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">নাম (Name)</p>
                    <p className="font-medium">{selectedOrder.customer_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> ফোন নাম্বার
                    </p>
                    <p className="font-medium">{selectedOrder.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">বিভাগ (Division)</p>
                    <p className="font-medium">{selectedOrder.division || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">জেলা (District)</p>
                    <p className="font-medium">{selectedOrder.district || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> সম্পূর্ণ ঠিকানা (Full Address)
                  </p>
                  <p className="font-medium text-sm">{selectedOrder.shipping_address || "N/A"}</p>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-3 p-3 bg-secondary/50 rounded-md">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" /> অতিরিক্ত নোট (Notes)
                    </p>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="p-4 border border-border rounded-lg space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">পেমেন্ট মাধ্যম (Payment Method)</p>
                    {selectedOrder.payment_method ? (
                      <Badge 
                        className={`mt-1 ${
                          paymentMethodColors[selectedOrder.payment_method]?.bg || ""
                        } ${
                          paymentMethodColors[selectedOrder.payment_method]?.text || ""
                        } ${
                          paymentMethodColors[selectedOrder.payment_method]?.border || ""
                        } border`}
                      >
                        {paymentMethodNames[selectedOrder.payment_method] || selectedOrder.payment_method}
                      </Badge>
                    ) : (
                      <p className="font-medium">N/A</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="font-mono font-medium">
                      {selectedOrder.transaction_id || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="p-4 bg-muted/30 border-b border-border">
                  <h3 className="font-semibold">Order Items</h3>
                </div>
                <div className="divide-y divide-border">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.product?.image_url || "/placeholder.svg"}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ৳{item.price_at_time} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-accent">
                        ৳{(item.price_at_time * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="font-medium">Update Status:</span>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    handleStatusChange(selectedOrder.id, value);
                    setSelectedOrder({ ...selectedOrder, status: value });
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Delete Order Button */}
              <div className="flex justify-end pt-4 border-t border-border">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Order</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this order? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
