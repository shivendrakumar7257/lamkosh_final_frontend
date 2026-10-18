import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  Loader2,
  Lock,
  ShoppingBag,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/lib/auth-store";
import { orderService } from "@/api/orderService";
import { CheckoutPayload, PaymentMethod } from "@/types/order";
import { getGuestId, getOrCreateGuestId } from "@/lib/guest";
import { formatPrice } from "@/data/catalog";
import subcategoryBannerBg from "@/assets/subcategory-banner-bg.png";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — LaMoksh Atelier" },
      {
        name: "description",
        content: "Secure luxury checkout for handcrafted artisanal pieces.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, loading: isCartLoading, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuthStore();

  const items = cart?.items || [];

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobile || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with auth user when loaded
  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (!mobileNumber && user.mobile) setMobileNumber(user.mobile);
      if (!email && user.email) setEmail(user.email);
      if (!address && user.address) setAddress(user.address);
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2 || name.trim().length > 100) {
      newErrors.name = "Full name must be between 2 and 100 characters.";
    }

    const cleanMobile = mobileNumber.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      newErrors.mobileNumber = "Enter a valid 10-digit Indian mobile number (starts with 6-9).";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!address.trim() || address.trim().length < 3 || address.trim().length > 500) {
      newErrors.address = "Address must be between 3 and 500 characters.";
    }

    if (!state.trim()) {
      newErrors.state = "State is required.";
    }

    const cleanPincode = pincode.replace(/\D/g, "");
    if (!/^\d{6}$/.test(cleanPincode)) {
      newErrors.pincode = "Enter a valid 6-digit Indian postal pincode.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve the highlighted errors in the form.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty. Add items before checking out.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanMobile = mobileNumber.replace(/\D/g, "");
      const cleanPincode = pincode.replace(/\D/g, "");

      const currentGuestId = !isAuthenticated ? getGuestId() || getOrCreateGuestId() : undefined;

      const payload: CheckoutPayload = {
        name: name.trim(),
        mobileNumber: cleanMobile,
        email: email.trim() ? email.trim() : null,
        address: address.trim(),
        fullAddress: [address.trim(), landmark.trim(), city.trim(), state, cleanPincode]
          .filter(Boolean)
          .join(", "),
        landmark: landmark.trim() || undefined,
        city: city.trim() || district.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim(),
        pincode: cleanPincode,
        paymentMethod,
        guestId: currentGuestId,
      };

      const createdOrder = await orderService.placeOrder(payload, items);

      // Force cart refresh
      await refreshCart();

      toast.success("Order placed successfully!");

      // Navigate to order confirmation
      navigate({
        to: "/order-success",
        search: {
          orderId: createdOrder.id,
          token: createdOrder.trackingToken || "",
          orderNumber: createdOrder.orderNumber,
          hasEmail: email.trim() ? "true" : "false",
        },
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to place your order. Please check your inventory or try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Editorial Luxury Header */}
      <section className="relative flex min-h-[180px] items-center overflow-hidden border-b border-border/80 py-10 md:min-h-[220px]">
        <img
          src={subcategoryBannerBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#28201C]/35 backdrop-brightness-95" />
        <div className="container-lux relative z-10 text-center text-ivory">
          <nav className="flex justify-center gap-2 text-xs text-ivory/85">
            <Link to="/" className="hover:text-ivory hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-ivory hover:underline">
              Your Bag
            </Link>
            <span>/</span>
            <span className="font-medium text-ivory">Checkout</span>
          </nav>
          <p className="eyebrow mt-4 uppercase tracking-[0.2em] text-ivory/85">SECURE CHECKOUT</p>
          <h1 className="mt-2 font-serif text-3xl font-normal text-ivory sm:text-4xl">
            Delivery & Payment
          </h1>
          <p className="mt-1 font-serif text-xs italic text-ivory/95">
            Complimentary doorstep shipping with live courier tracking.
          </p>
        </div>
      </section>

      <div className="container-lux py-10 md:py-16">
        {isCartLoading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#28201C]/60" />
            <p className="body-lux mt-4 text-sm text-[#28201C]/80">Loading your bag details...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-lg border border-border bg-[#FAF8F5] p-12 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#28201C]/50" />
            <h2 className="mt-4 font-serif text-2xl uppercase tracking-wider text-[#28201C]">
              Your Bag is Empty
            </h2>
            <p className="mt-2 font-sans text-xs text-[#28201C]/75">
              Before placing an order, please add handcrafted fabrics or garments from our atelier.
            </p>
            <div className="mt-6">
              <Link
                to="/new-arrivals"
                className="inline-block bg-[#28201C] px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c]"
              >
                Discover Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Delivery & Payment Details Form */}
            <div className="lg:col-span-7 space-y-10">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
                {/* Guest / Account Info Banner */}
                {!isAuthenticated && (
                  <div className="flex items-start gap-3 border border-amber-200/80 bg-amber-50/60 p-4 text-xs text-amber-950">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <div>
                      <span className="font-semibold">Checking out as a Guest?</span>
                      <p className="mt-0.5 text-amber-900/80 leading-relaxed">
                        You can checkout without logging in. Providing your email will automatically
                        create an account with temporary credentials emailed to you for easy
                        tracking.
                      </p>
                    </div>
                  </div>
                )}

                {/* 1. Contact Information */}
                <div className="space-y-5 rounded-sm border border-border/80 bg-background p-6 md:p-8 shadow-sm">
                  <div className="border-b border-border/60 pb-3">
                    <span className="eyebrow text-[0.68rem] text-muted-foreground uppercase tracking-wider">
                      STEP 1 OF 3
                    </span>
                    <h2 className="font-serif text-xl text-foreground font-medium">
                      Contact Information
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className={cn(
                          "w-full border bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso",
                          errors.name ? "border-red-500" : "border-border",
                        )}
                      />
                      {errors.name && <p className="text-[0.68rem] text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        10-Digit Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-mono text-muted-foreground">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="9876543210"
                          className={cn(
                            "w-full border bg-[#FAF8F5] pl-11 pr-3.5 py-2.5 text-xs font-mono text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso",
                            errors.mobileNumber ? "border-red-500" : "border-border",
                          )}
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-[0.68rem] text-red-600">{errors.mobileNumber}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        Email Address <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aarav@example.com"
                        className={cn(
                          "w-full border bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso",
                          errors.email ? "border-red-500" : "border-border",
                        )}
                      />
                      {errors.email && (
                        <p className="text-[0.68rem] text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="space-y-5 rounded-sm border border-border/80 bg-background p-6 md:p-8 shadow-sm">
                  <div className="border-b border-border/60 pb-3">
                    <span className="eyebrow text-[0.68rem] text-muted-foreground uppercase tracking-wider">
                      STEP 2 OF 3
                    </span>
                    <h2 className="font-serif text-xl text-foreground font-medium">
                      Shipping Destination
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        House / Flat / Street Address <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Flat 302, Green Heights, MG Road, Residency Area"
                        className={cn(
                          "w-full border bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso",
                          errors.address ? "border-red-500" : "border-border",
                        )}
                      />
                      {errors.address && (
                        <p className="text-[0.68rem] text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        Landmark <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Opposite City Mall / Near Metro Pillar"
                        className="w-full border border-border bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        City / Town
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full border border-border bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        District <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Bengaluru Urban"
                        className="w-full border border-border bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        State <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={cn(
                          "w-full border bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso",
                          errors.state ? "border-red-500" : "border-border",
                        )}
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-[0.68rem] text-red-600">{errors.state}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        6-Digit PIN Code <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560001"
                        className={cn(
                          "w-full sm:w-1/2 border bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-mono text-foreground focus:bg-white focus:outline-none focus:ring-1 focus:ring-espresso",
                          errors.pincode ? "border-red-500" : "border-border",
                        )}
                      />
                      {errors.pincode && (
                        <p className="text-[0.68rem] text-red-600">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="space-y-5 rounded-sm border border-border/80 bg-background p-6 md:p-8 shadow-sm">
                  <div className="border-b border-border/60 pb-3">
                    <span className="eyebrow text-[0.68rem] text-muted-foreground uppercase tracking-wider">
                      STEP 3 OF 3
                    </span>
                    <h2 className="font-serif text-xl text-foreground font-medium">
                      Payment Preference
                    </h2>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* COD Option */}
                    <label
                      className={cn(
                        "relative flex cursor-pointer items-start gap-3 border p-4 transition-all",
                        paymentMethod === "CASH_ON_DELIVERY"
                          ? "border-espresso bg-champagne/40 ring-1 ring-espresso"
                          : "border-border bg-background hover:bg-[#FAF8F5]",
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CASH_ON_DELIVERY"
                        checked={paymentMethod === "CASH_ON_DELIVERY"}
                        onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                        className="mt-0.5 text-espresso focus:ring-espresso"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-medium text-xs text-foreground">
                          <Banknote className="h-4 w-4 text-emerald-700" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-[0.68rem] text-muted-foreground">
                          Pay cash or UPI upon delivery at your doorstep.
                        </p>
                      </div>
                    </label>

                    {/* Online Prepaid Option */}
                    <label
                      className={cn(
                        "relative flex cursor-pointer items-start gap-3 border p-4 transition-all",
                        paymentMethod === "ONLINE"
                          ? "border-espresso bg-champagne/40 ring-1 ring-espresso"
                          : "border-border bg-background hover:bg-[#FAF8F5]",
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={paymentMethod === "ONLINE"}
                        onChange={() => setPaymentMethod("ONLINE")}
                        className="mt-0.5 text-espresso focus:ring-espresso"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-medium text-xs text-foreground">
                          <CreditCard className="h-4 w-4 text-indigo-700" />
                          <span>Online Payment (Prepaid)</span>
                        </div>
                        <p className="text-[0.68rem] text-muted-foreground">
                          Instant checkout via UPI, NetBanking, Debit / Credit Cards.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit button on mobile */}
                <div className="block lg:hidden pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="flex w-full items-center justify-center gap-2 bg-[#28201C] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Confirming Atelier Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order &bull; {formatPrice(subtotal)}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-sm border border-border/80 bg-[#FAF8F5] p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      Order Summary
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? "piece" : "pieces"}
                    </span>
                  </div>

                  {/* Items snapshot list */}
                  <div className="mt-4 max-h-[340px] space-y-3 overflow-y-auto pr-1">
                    {items.map((it) => {
                      const img =
                        it.product?.images?.[0] ||
                        it.product?.media?.[0]?.url ||
                        "/placeholder-product.png";
                      return (
                        <div key={it.id} className="flex gap-3 text-xs">
                          <img
                            src={img}
                            alt={it.product?.name || "Product"}
                            className="h-16 w-14 shrink-0 rounded-[2px] object-cover bg-background border border-border/60"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs font-medium text-foreground line-clamp-1">
                              {it.product?.name}
                            </h4>
                            <div className="mt-0.5 flex flex-wrap gap-x-2 text-[0.68rem] text-muted-foreground">
                              {it.variant?.size && <span>Size: {it.variant.size}</span>}
                              {it.product?.color && <span>Color: {it.product.color}</span>}
                              <span>Qty: {it.quantity}</span>
                            </div>
                            <p className="mt-1 font-mono text-xs font-medium text-foreground">
                              {formatPrice(it.subtotal || it.product?.sellPrice * it.quantity || 0)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-6 space-y-2.5 border-t border-border/60 pt-4 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-mono text-foreground">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Insured Atelier Shipping</span>
                      </span>
                      <span className="font-medium text-emerald-700 uppercase tracking-wider text-[0.68rem]">
                        Free
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-border/60 pt-3 text-sm font-semibold">
                      <span className="font-serif text-base text-foreground">Total Payable</span>
                      <span className="font-serif text-lg text-foreground">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Submit Button */}
                  <div className="mt-6 hidden lg:block">
                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={isSubmitting || items.length === 0}
                      className="flex w-full items-center justify-center gap-2 bg-[#28201C] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] transition-colors hover:bg-[#3d322c] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Securing Your Order...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Order &bull; {formatPrice(subtotal)}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Assurance Badges */}
                <div className="space-y-3 rounded-sm border border-border/80 bg-background p-5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-espresso shrink-0" />
                    <span>Safe & Verified Transactions with SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Authentic Indian Textiles & Craftsmanship Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Lock className="h-4 w-4 text-espresso shrink-0" />
                    <span>Live Shiprocket GPS Tracking with Dispatch Notifications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
