import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  Phone,
  FileText,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Package,
  User,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { divisions, districtsByDivision, paymentMethods } from "@/lib/bangladeshData";
import PaymentModal from "@/components/checkout/PaymentModal";
import { toast } from "sonner";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    division: "",
    district: "",
    address: "",
    notes: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get districts based on selected division
  const availableDistricts = useMemo(() => {
    if (!formData.division) return [];
    return districtsByDivision[formData.division] || [];
  }, [formData.division]);

  // Get selected payment method details
  const currentPaymentMethod = useMemo(() => {
    return paymentMethods.find((m) => m.id === selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  if (!user) {
    return (
      <Layout>
        <div className="container-blog py-24 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            অনুগ্রহ করে লগইন করুন
          </h2>
          <p className="text-muted-foreground mb-6">
            চেকআউট করতে আপনাকে প্রথমে লগইন করতে হবে
          </p>
          <Link to="/auth">
            <Button>লগইন করুন</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (cartLoading) {
    return (
      <Layout>
        <div className="container-blog py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout>
        <div className="container-blog py-24 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            আপনার কার্ট খালি
          </h2>
          <p className="text-muted-foreground mb-6">
            চেকআউট করতে প্রথমে কিছু পণ্য কার্টে যোগ করুন
          </p>
          <Link to="/shop">
            <Button>শপিং করুন</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = 60;
  const total = subtotal + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDivisionChange = (value: string) => {
    setFormData({ ...formData, division: value, district: "" });
    if (errors.division) {
      setErrors({ ...errors, division: "" });
    }
  };

  const handleDistrictChange = (value: string) => {
    setFormData({ ...formData, district: value });
    if (errors.district) {
      setErrors({ ...errors, district: "" });
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setPaymentConfirmed(false);
    setTransactionId("");
    setIsPaymentModalOpen(true);
    if (errors.paymentMethod) {
      setErrors({ ...errors, paymentMethod: "" });
    }
  };

  const handlePaymentConfirm = () => {
    setPaymentConfirmed(true);
    setIsPaymentModalOpen(false);
    toast.success("পেমেন্ট তথ্য সংরক্ষিত হয়েছে!");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "নাম দিন";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "ফোন নম্বর দিন";
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = "সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 01XXXXXXXXX)";
    }

    if (!formData.division) {
      newErrors.division = "বিভাগ নির্বাচন করুন";
    }

    if (!formData.district) {
      newErrors.district = "জেলা নির্বাচন করুন";
    }

    if (!formData.address.trim()) {
      newErrors.address = "সম্পূর্ণ ঠিকানা দিন";
    }

    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = "পেমেন্ট মাধ্যম নির্বাচন করুন";
    }

    if (selectedPaymentMethod && !paymentConfirmed) {
      newErrors.paymentMethod = "পেমেন্ট নিশ্চিত করুন";
    }

    if (selectedPaymentMethod && paymentConfirmed && !transactionId.trim()) {
      newErrors.transactionId = "Transaction ID দিন";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("সব তথ্য সঠিকভাবে পূরণ করুন");
      return;
    }

    const divisionName = divisions.find((d) => d.id === formData.division)?.name || "";
    const districtName = availableDistricts.find((d) => d.id === formData.district)?.name || "";

    try {
      const order = await createOrder.mutateAsync({
        customer_name: formData.customerName,
        phone: formData.phone,
        division: divisionName,
        district: districtName,
        shipping_address: formData.address,
        notes: formData.notes,
        payment_method: selectedPaymentMethod,
        transaction_id: transactionId,
      });

      setOrderId(order.id);
      setOrderComplete(true);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // Order Confirmation View
  if (orderComplete && orderId) {
    return (
      <Layout>
        <section className="py-12 lg:py-20">
          <div className="container-blog max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-card rounded-2xl border border-border p-8 lg:p-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>

              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3">
                আপনার অর্ডার সফলভাবে সাবমিট হয়েছে!
              </h1>
              <p className="text-muted-foreground mb-6">
                শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব। ধন্যবাদ!
              </p>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">অর্ডার নম্বর</p>
                <p className="font-mono font-semibold text-foreground text-lg">
                  #{orderId.slice(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left bg-secondary/30 rounded-xl p-4 mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">মোট পণ্য</p>
                  <p className="font-semibold text-foreground">
                    {cartItems?.length || 0}টি
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">মোট মূল্য</p>
                  <p className="font-semibold text-accent">৳{total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">পেমেন্ট মাধ্যম</p>
                  <p className="font-semibold text-foreground">
                    {paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">স্ট্যাটাস</p>
                  <p className="font-semibold text-orange-500">প্রসেসিং</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Package className="w-4 h-4" />
                    আরও শপিং করুন
                  </Button>
                </Link>
                <Link to="/profile" className="flex-1">
                  <Button className="w-full gap-2">
                    <FileText className="w-4 h-4" />
                    অর্ডার দেখুন
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 lg:py-12">
        <div className="container-blog">
          {/* Back Button */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            কার্টে ফিরে যান
          </Link>

          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-8">
            চেকআউট
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Forms */}
              <div className="flex-1 space-y-6">
                {/* Customer Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">গ্রাহক তথ্য</h2>
                      <p className="text-sm text-muted-foreground">
                        আপনার নাম ও যোগাযোগ নম্বর
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Customer Name */}
                      <div className="space-y-2">
                        <Label htmlFor="customerName">নাম *</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          placeholder="আপনার সম্পূর্ণ নাম"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className={errors.customerName ? "border-destructive" : ""}
                        />
                        {errors.customerName && (
                          <p className="text-xs text-destructive">{errors.customerName}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">ফোন নাম্বার *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="01XXXXXXXXX"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-destructive">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">ডেলিভারি ঠিকানা</h2>
                      <p className="text-sm text-muted-foreground">
                        আপনার পণ্য কোথায় পাঠাতে হবে
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {/* Division & District */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>বিভাগ *</Label>
                        <Select
                          value={formData.division}
                          onValueChange={handleDivisionChange}
                        >
                          <SelectTrigger className={errors.division ? "border-destructive" : ""}>
                            <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            {divisions.map((division) => (
                              <SelectItem key={division.id} value={division.id}>
                                {division.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.division && (
                          <p className="text-xs text-destructive">{errors.division}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>জেলা *</Label>
                        <Select
                          value={formData.district}
                          onValueChange={handleDistrictChange}
                          disabled={!formData.division}
                        >
                          <SelectTrigger className={errors.district ? "border-destructive" : ""}>
                            <SelectValue placeholder={formData.division ? "জেলা নির্বাচন করুন" : "প্রথমে বিভাগ নির্বাচন করুন"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDistricts.map((district) => (
                              <SelectItem key={district.id} value={district.id}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.district && (
                          <p className="text-xs text-destructive">{errors.district}</p>
                        )}
                      </div>
                    </div>

                    {/* Full Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="গ্রাম / এলাকা / রাস্তা / বাড়ী নম্বর / বিস্তারিত ঠিকানা লিখুন"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={errors.address ? "border-destructive" : ""}
                      />
                      {errors.address && (
                        <p className="text-xs text-destructive">{errors.address}</p>
                      )}
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="ডেলিভারি সম্পর্কে কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">পেমেন্ট মাধ্যম</h2>
                      <p className="text-sm text-muted-foreground">
                        কিভাবে পেমেন্ট করতে চান
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => handlePaymentMethodSelect(method.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id && paymentConfirmed
                            ? "border-green-500 bg-green-500/10"
                            : selectedPaymentMethod === method.id
                            ? `border-2`
                            : "border-border hover:border-accent/50"
                        }`}
                        style={{
                          borderColor:
                            selectedPaymentMethod === method.id && paymentConfirmed
                              ? "#22c55e"
                              : selectedPaymentMethod === method.id
                              ? method.color
                              : undefined,
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${method.color}20` }}
                        >
                          <Smartphone className="w-6 h-6" style={{ color: method.color }} />
                        </div>
                        <span className="font-medium text-foreground">{method.name}</span>
                        {selectedPaymentMethod === method.id && paymentConfirmed && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> নিশ্চিত
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {errors.paymentMethod && (
                    <p className="text-xs text-destructive mt-2">{errors.paymentMethod}</p>
                  )}

                  {/* Show Transaction ID if payment confirmed */}
                  {paymentConfirmed && transactionId && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        <strong>Transaction ID:</strong> {transactionId}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:w-96">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-xl border border-border p-6 sticky top-24"
                >
                  <h2 className="font-semibold text-lg text-foreground mb-4">
                    অর্ডার সারসংক্ষেপ
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.image_url || "/placeholder.svg"}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity}x ৳{item.product?.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          ৳{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">সাবটোটাল</span>
                      <span className="text-foreground">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                      <span className="text-foreground">৳{shipping}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                      <span className="text-foreground">মোট</span>
                      <span className="text-accent">৳{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6 h-12 text-base gap-2"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        অর্ডার করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        অর্ডার কনফার্ম করুন
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন
                  </p>
                </motion.div>
              </div>
            </div>
          </form>

          {/* Payment Modal */}
          {currentPaymentMethod && (
            <PaymentModal
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
              paymentMethod={currentPaymentMethod}
              transactionId={transactionId}
              onTransactionIdChange={setTransactionId}
              onConfirm={handlePaymentConfirm}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
