import { CartItem } from "@/components/cartItem";
import { LoadingPage } from "@/components/LoadingPage";
import { PaymentSummary } from "@/components/paymentSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { RootState } from "@/redux/store";
import type { Address, CartData } from "@/types/type";
import { api } from "@/utils/Axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { MapPin, Truck, CreditCard, Home } from "lucide-react";

export const Checkout = () => {
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address | null>(null);

  const { cart, loading: ItemLoading } = useSelector(
    (state: RootState) => state.cart,
  );

  const fetchAddresses = async () => {
    try {
      setLoadingAddress(true);
      const res = await api.get("/address", { withCredentials: true });
      const payload = res?.data?.data ?? res?.data ?? [];
      setAddresses(Array.isArray(payload) ? payload : []);
      
      // Auto-select default address
      const defaultAddr = Array.isArray(payload) ? payload.find((a: Address) => a.isDefault) : null;
      if (defaultAddr) setAddress(defaultAddr);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (ItemLoading && !cart) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Step 1: Delivery Address */}
            <Card className="overflow-hidden rounded-2xl border border-orange-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-background border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Delivery Address</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Choose where to deliver</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingAddress ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-orange-200 bg-orange-50 p-8 text-center">
                    <Home className="mx-auto h-12 w-12 text-orange-300 mb-3" />
                    <p className="font-semibold text-foreground mb-2">No saved addresses</p>
                    <p className="text-sm text-muted-foreground mb-4">Add an address to continue checkout</p>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <RadioGroup
                    value={address?.id ?? ""}
                    onValueChange={(id) =>
                      setAddress(addresses.find((a) => a.id === id) ?? null)
                    }
                    className="space-y-3"
                  >
                    {addresses.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="relative cursor-pointer"
                        onClick={() => setAddress(item)}
                      >
                        <div className="rounded-xl border-2 border-orange-100 bg-white p-4 transition-all hover:border-orange-400 hover:shadow-md has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50">
                          <div className="flex gap-3">
                            <RadioGroupItem
                              value={item.id}
                              id={item.id}
                              className="mt-1 border-orange-300 text-orange-600"
                            />

                            <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-foreground">
                                    {item.name}
                                  </p>
                                  {item.isDefault && (
                                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                      Default
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-sm text-foreground font-medium">
                                  {item.recipientName} • {item.phone}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                  {item.address}, {item.city}, {item.state} {item.postalCode}
                                </p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Order Items */}
            <Card className="overflow-hidden rounded-2xl border border-orange-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-background border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{cart?.length} item{cart?.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {cart?.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Step 3: Payment Method */}
            <Card className="overflow-hidden rounded-2xl border border-orange-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-background border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Choose how to pay</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 border-2 border-orange-200 hover:border-orange-600 hover:bg-orange-50 transition-all"
                  >
                    <span className="text-2xl">💳</span>
                    <span className="font-semibold">Pay on Delivery</span>
                    <span className="text-xs text-muted-foreground">Cash/Card at door</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 border-2 border-orange-200 hover:border-orange-600 hover:bg-orange-50 transition-all"
                  >
                    <span className="text-2xl">🏦</span>
                    <span className="font-semibold">Stripe</span>
                    <span className="text-xs text-muted-foreground">International cards</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 border-2 border-orange-200 hover:border-orange-600 hover:bg-orange-50 transition-all sm:col-span-2"
                  >
                    <span className="text-2xl">₹</span>
                    <span className="font-semibold">Razorpay</span>
                    <span className="text-xs text-muted-foreground">Indian payment gateway</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Summary */}
          <div>
            <PaymentSummary cart={cart ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
};
