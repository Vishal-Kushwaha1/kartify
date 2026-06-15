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

  const { data:cart, isLoading: itemLoading } =useGetCartItemQuery()
  
  const { handleClearCart, actionLoading } = useCartActions();

  // loading
  if (itemLoading && !cart) {
    return <LoadingPage />;
  }

  // empty cart
  if (!cart || cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-muted/20 pb-20 px-4">
        <Card className="space-y-6 p-12 text-center rounded-3xl border-dashed border-border/60 shadow-sm bg-background/50 backdrop-blur-sm max-w-md w-full">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Your Cart is Empty</h2>
            <p className="text-muted-foreground text-sm">
              Looks like you haven't added anything yet. Discover our premium collection.
            </p>
          </div>

          <Button 
            onClick={() => navigate("/products")}
            className="w-full h-12 rounded-xl text-base mt-4 shadow-md hover:shadow-lg transition-all"
          >
            Start Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      
      {/* Page Header */}
      <div className="bg-background border-b border-border/50 px-6 py-12 mb-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2 flex items-center gap-2">
              Shopping Cart <Sparkles className="h-6 w-6 text-primary" />
            </h1>
            <p className="text-muted-foreground text-lg">
              You have <span className="font-semibold text-foreground">{cart.length}</span> item{cart.length !== 1 ? "s" : ""} in your cart.
            </p>
          </div>
          <Button
            variant="ghost"
            disabled={actionLoading}
            onClick={handleClearCart}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 px-4 rounded-xl font-medium shrink-0 w-fit"
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
                  className="w-full h-14 text-lg rounded-2xl shadow-md hover:shadow-xl transition-all"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  onClick={() => navigate("/products")}
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-border/50 bg-background/50 backdrop-blur font-medium hover:bg-muted transition-colors"
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
