import { CartItem } from "@/components/cartItem";
import { LoadingPage } from "@/components/LoadingPage";
import { PaymentSummary } from "@/components/paymentSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { RootState } from "@/redux/store";
import type { Address } from "@/types/type";
import { api } from "@/utils/Axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

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
            <Card className="rounded-xl border bg-background">
              <CardHeader>
                <CardTitle className="text-lg font-medium tracking-tight">Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingAddress ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-lg border border-dashed bg-muted p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">No saved addresses yet</p>
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
                        className="cursor-pointer"
                        onClick={() => setAddress(item)}
                      >
                        <div className="rounded-lg border bg-background p-4 has-checked:border-orange-600">
                          <div className="flex gap-3">
                            <RadioGroupItem
                              value={item.id}
                              id={item.id}
                              className="mt-1"
                            />

                            <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground">
                                    {item.name}
                                  </p>
                                  {item.isDefault && (
                                    <Badge variant="outline" className="text-xs">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {item.recipientName} • {item.phone}
                                </p>
                                <p className="text-xs text-muted-foreground">
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
            <Card className="rounded-xl border bg-background">
              <CardHeader>
                <CardTitle className="text-lg font-medium tracking-tight">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {cart?.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </CardContent>
            </Card>

            {/* Step 3: Payment Method */}
            <Card className="rounded-xl border bg-background">
              <CardHeader>
                <CardTitle className="text-lg font-medium tracking-tight">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-1 text-center"
                  >
                    <span className="text-xl">💳</span>
                    <span className="text-sm font-medium">COD</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-1 text-center"
                  >
                    <span className="text-xl">🏦</span>
                    <span className="text-sm font-medium">Stripe</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-1 text-center"
                  >
                    <span className="text-xl">₹</span>
                    <span className="text-sm font-medium">Razorpay</span>
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
