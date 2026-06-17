import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "@/components/LoadingPage";
import { useCartActions } from "@/hooks/useCartAction";
import { CartItem } from "@/components/cartItem";
import { PaymentSummary } from "@/components/paymentSummary";
import { useGetCartItemQuery } from "@/redux/cart/cartApi";

export const Cart = () => {
  const navigate = useNavigate();

  const { data: cart, isLoading: itemLoading } = useGetCartItemQuery();

  const { handleClearCart, actionLoading } = useCartActions();

  // loading
  if (itemLoading && !cart) {
    return <LoadingPage />;
  }

  // empty cart
  if (!cart || cart.length === 0) {
    return (
      <div className="bg-muted/20 flex min-h-[70vh] items-center justify-center px-4 pb-20">
        <Card className="border-border/60 bg-background/50 w-full max-w-md space-y-6 rounded-3xl border-dashed p-12 text-center shadow-sm backdrop-blur-sm">
          <div className="bg-muted mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <ShoppingBag className="text-muted-foreground h-10 w-10 opacity-50" />
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Your Cart is Empty
            </h2>
            <p className="text-muted-foreground text-sm">
              Looks like you haven't added anything yet. Discover our premium
              collection.
            </p>
          </div>

          <Button
            onClick={() => navigate("/products")}
            className="mt-4 h-12 w-full rounded-xl text-base shadow-md transition-all hover:shadow-lg"
          >
            Start Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-background border-border/50 mb-10 border-b px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-foreground mb-2 flex items-center gap-2 text-4xl font-bold tracking-tight">
              Shopping Cart <Sparkles className="text-primary h-6 w-6" />
            </h1>
            <p className="text-muted-foreground text-lg">
              You have{" "}
              <span className="text-foreground font-semibold">
                {cart.length}
              </span>{" "}
              item{cart.length !== 1 ? "s" : ""} in your cart.
            </p>
          </div>
          <Button
            variant="ghost"
            disabled={actionLoading}
            onClick={handleClearCart}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 w-fit shrink-0 rounded-xl px-4 font-medium"
          >
            Clear Cart
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-4">
            {cart?.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Summary & Actions */}
          <div className="relative">
            <div className="sticky top-24 space-y-4">
              <PaymentSummary cart={cart} />

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="h-14 w-full rounded-2xl text-lg shadow-md transition-all hover:shadow-xl"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  onClick={() => navigate("/products")}
                  variant="outline"
                  className="border-border/50 bg-background/50 hover:bg-muted h-12 w-full rounded-2xl font-medium backdrop-blur transition-colors"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
