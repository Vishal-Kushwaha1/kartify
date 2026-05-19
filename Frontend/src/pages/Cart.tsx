import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "@/components/LoadingPage";
import { useCartActions } from "@/hooks/useCartAction";
import { CartItem } from "@/components/cartItem";
import { PaymentSummary } from "@/components/paymentSummary";

export const Cart = () => {
  const navigate = useNavigate();

  const { cart, loading: itemLoading } = useSelector(
    (state: RootState) => state.cart,
  );

  const { handleClearCart, actionLoading } = useCartActions();

  // loading
  if (itemLoading && !cart) {
    return <LoadingPage />;
  }

  // empty cart
  if (!cart || cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="space-y-5 p-10 text-center">
          <ShoppingBag className="mx-auto h-14 w-14 text-muted-foreground" />

          <div>
            <h2 className="text-2xl font-bold">Your Cart Is Empty</h2>

            <p className="text-muted-foreground">
              Add products to continue shopping
            </p>
          </div>

          <Button onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Shopping Cart</h1>
            <p className="text-sm text-muted-foreground mt-1">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={actionLoading}
            onClick={handleClearCart}
            className="text-destructive hover:bg-destructive/10"
          >
            Clear All
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Summary & Actions */}
          <div className="space-y-4">
            <PaymentSummary cart={cart} />
            
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white h-10"
              >
                Checkout
              </Button>

              <Button
                onClick={() => navigate("/products")}
                variant="outline"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
