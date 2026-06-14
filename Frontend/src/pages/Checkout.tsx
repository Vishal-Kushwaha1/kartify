import { CartItem } from "@/components/cartItem";
import { LoadingPage } from "@/components/LoadingPage";
import { PaymentSummary } from "@/components/paymentSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Address } from "@/types/type";
import { api } from "@/utils/Axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ShieldCheck,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";
import { useGetCartItemQuery } from "@/redux/cart/cartApi";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export const Checkout = () => {
  const navigate = useNavigate();
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);

  const { data: cart, isLoading: ItemLoading } = useGetCartItemQuery();

  if (cart && cart?.length < 1) {
    navigate("/products");
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchAddresses = useCallback(async () => {
    try {
      setLoadingAddress(true);
      const res = await api.get("/address", { withCredentials: true });
      const payload = res?.data?.data ?? res?.data ?? [];
      setAddresses(Array.isArray(payload) ? payload : []);

      // Auto-select default address
      const defaultAddr = Array.isArray(payload)
        ? payload.find((a: Address) => a.isDefault)
        : null;
      if (defaultAddr) setAddressId(defaultAddr.id);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleCOD = async () => {
    if (!addressId) {
      toast.error("Select your address");
      return;
    }
    try {
      setLoadingPayment(true);
      await api.post("/order/cash", { addressId }, { withCredentials: true });

      toast.success("Order Placed successfully");
      navigate("/order-success");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleRazorpay = async () => {
    if (!addressId) {
      toast.error("Select your address");
      return;
    }
    try {
      setLoadingPayment(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoadingPayment(false);
        return;
      }

      const response = await api.post(
        "/order/razorpay/create",
        { addressId },
        { withCredentials: true },
      );
      const { orderId, razorpayOrderId, amount, currency } = response.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency,
        name: "Kartify",
        description: "Premium E-commerce Experience",
        order_id: razorpayOrderId,
        theme: {
          color: "#0F172A", // using a darker premium color
        },
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const params = new URLSearchParams({
            rzp_order_id: paymentResponse.razorpay_order_id,
            rzp_payment_id: paymentResponse.razorpay_payment_id,
            rzp_signature: paymentResponse.razorpay_signature,
            order_id: orderId,
          });
          setLoadingPayment(false);
          navigate(`/order-success?${params.toString()}`);
        },
        modal: {
          ondismiss: async () => {
            setLoadingPayment(false);
            toast.warning("Payment cancelled");
            try {
              await api.post(
                "/order/razorpay/cancel",
                { orderId },
                { withCredentials: true },
              );
            } catch (e) {
              console.error("Failed to cancel order", e);
            }
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoadingPayment(false);
      toast.error("Something went wrong");
    }
  };

  const handleStripe = async () => {
    if (!addressId) {
      toast.error("Select your address");
      return;
    }
    try {
      setLoadingPayment(true);
      const response = await api.post(
        "/order/stripe/create",
        { addressId },
        { withCredentials: true },
      );
      if (response.data.data && response.data.data.url) {
        toast.success("Redirecting to Stripe...");
        window.location.href = response.data.data.url;
      } else {
        toast.error("Failed to create payment session");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingPayment(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cancelled = params.get("stripe_cancelled");
    const orderId = params.get("orderId");

    if (cancelled && orderId) {
      api
        .post("/order/stripe/cancel", { orderId }, { withCredentials: true })
        .then(() => toast.warning("Payment cancelled"))
        .catch(console.error);

      window.history.replaceState({}, "", "/checkout");
    }
  }, []);

  if (ItemLoading && !cart) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Page Header */}
      <div className="bg-background border-b border-border/50 px-6 py-10 mb-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1 flex items-center gap-2">
              Secure Checkout <ShieldCheck className="h-6 w-6 text-primary" />
            </h1>
            <p className="text-muted-foreground">
              Complete your purchase securely.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Step 1: Delivery Address */}
            <Card className="rounded-3xl border-none shadow-sm bg-background/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  Delivery Address
                </CardTitle>
                <CardDescription>
                  Select where you'd like us to deliver your order.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loadingAddress ? (
                  <div className="flex flex-col gap-3 py-4">
                    <div className="h-20 w-full bg-muted/50 animate-pulse rounded-2xl"></div>
                    <div className="h-20 w-full bg-muted/50 animate-pulse rounded-2xl"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-8 text-center flex flex-col items-center justify-center">
                    <MapPin className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
                    <p className="text-foreground font-medium mb-1">
                      No saved addresses
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please add an address to continue checkout
                    </p>
                    <Button
                      onClick={() => navigate("/user")}
                      className="rounded-xl px-6"
                    >
                      Go to Profile to Add Address
                    </Button>
                  </div>
                ) : (
                  <RadioGroup
                    value={addressId ?? ""}
                    onValueChange={(id) => setAddressId(id)}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    {addresses.slice(0, 4).map((item) => (
                      <Label
                        key={item.id}
                        htmlFor={item.id}
                        className={`cursor-pointer rounded-2xl border-2 p-5 transition-all hover:bg-muted/30 ${
                          addressId === item.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/50 bg-background"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem
                            value={item.id}
                            id={item.id}
                            className="mt-1"
                          />
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground line-clamp-1">
                                {item.name}
                              </p>
                              {item.isDefault && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] uppercase font-bold py-0 h-4"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">
                              {item.recipientName} • {item.phone}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {item.address}, {item.city}, {item.state}{" "}
                              {item.postalCode}
                            </p>
                          </div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Order Items */}
            <Card className="rounded-3xl border-none shadow-sm bg-background/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {cart?.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Payment & Summary */}
          <div className="relative">
            <div className="sticky top-24 space-y-8">
              <Card className="rounded-3xl border-none shadow-sm bg-background/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleCOD()}
                      disabled={loadingPayment || !addressId}
                      className="h-14 justify-start px-4 text-left font-medium border-border/50 hover:bg-muted/50 rounded-xl"
                    >
                      <Banknote className="h-5 w-5 mr-3 text-emerald-600" />
                      Cash on Delivery (COD)
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleStripe()}
                      disabled={loadingPayment || !addressId}
                      className="h-14 justify-start px-4 text-left font-medium border-border/50 hover:bg-muted/50 rounded-xl"
                    >
                      <Wallet className="h-5 w-5 mr-3 text-indigo-600" />
                      Pay with Stripe
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleRazorpay()}
                      disabled={loadingPayment || !addressId}
                      className="h-14 justify-start px-4 text-left font-medium border-border/50 hover:bg-muted/50 rounded-xl"
                    >
                      <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                      Pay with Razorpay
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <PaymentSummary cart={cart ?? []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
