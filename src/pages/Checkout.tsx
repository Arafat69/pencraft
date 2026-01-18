import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  Phone,
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Package,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";

const paymentMethods = [
  {
    id: "cod",
    name: "ক্যাশ অন ডেলিভারি",
    description: "পণ্য হাতে পেয়ে টাকা দিন",
    icon: Banknote,
  },
  {
    id: "bkash",
    name: "বিকাশ",
    description: "বিকাশ মোবাইল পেমেন্ট",
    icon: Smartphone,
  },
  {
    id: "nagad",
    name: "নগদ",
    description: "নগদ মোবাইল ব্যাংকিং",
    icon: Smartphone,
  },
  {
    id: "card",
    name: "কার্ড পেমেন্ট",
    description: "ভিসা/মাস্টারকার্ড",
    icon: CreditCard,
  },
];

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    area: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

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
  const shipping = 60; // Fixed shipping cost
  const total = subtotal + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      return;
    }

    const fullAddress = `${formData.fullName}, ${formData.address}, ${formData.area ? formData.area + ", " : ""}${formData.city}`;

    try {
      const order = await createOrder.mutateAsync({
        shipping_address: fullAddress,
        phone: formData.phone,
        notes: formData.notes,
        payment_method: paymentMethod,
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
                অর্ডার সফল হয়েছে!
              </h1>
              <p className="text-muted-foreground mb-6">
                আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
              </p>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">অর্ডার নম্বর</p>
                <p className="font-mono font-semibold text-foreground">
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
                    {paymentMethods.find((m) => m.id === paymentMethod)?.name}
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
                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">সম্পূর্ণ নাম *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="আপনার নাম"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">ফোন নম্বর *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="01XXXXXXXXX"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="বাড়ি নম্বর, রাস্তা, এলাকা"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">শহর *</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="ঢাকা"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">এলাকা</Label>
                        <Input
                          id="area"
                          name="area"
                          placeholder="মিরপুর"
                          value={formData.area}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="ডেলিভারি সম্পর্কে কোনো বিশেষ নির্দেশনা..."
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
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

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="w-5 h-5 text-accent" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {method.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {method.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </motion.div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:w-96">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                      <span className="text-foreground">
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                      <span className="text-foreground">৳{shipping}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>সর্বমোট</span>
                        <span className="text-accent">৳{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6 h-12 text-base font-semibold gap-2"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        অর্ডার প্রসেস হচ্ছে...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        অর্ডার কনফার্ম করুন
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    অর্ডার করার মাধ্যমে আপনি আমাদের{" "}
                    <Link to="/terms" className="text-accent hover:underline">
                      শর্তাবলী
                    </Link>{" "}
                    মেনে নিচ্ছেন
                  </p>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
