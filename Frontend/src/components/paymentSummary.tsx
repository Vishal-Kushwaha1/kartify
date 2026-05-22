import type { CartData } from "@/types/type";
import { Card } from "@/components/ui/card";

type Props = {
  cart: CartData[];
};

export const PaymentSummary = ({ cart }: Props) => {
  // subtotal
  const rawSubTotal =
    cart.reduce((acc, item) => {
      return (
        acc + Number(item.cart_item.quantity) * Number(item.cart_item.price)
      );
    }, 0) || 0;

  const subTotal = Number(rawSubTotal.toFixed(2));

  // delivery fee
  const deliveryFee = subTotal > 400 ? 0 : 60;

  // gst
  const gst = Number((subTotal * 0.18).toFixed(2));

  // total
  const total = Number((subTotal + gst + deliveryFee).toFixed(2));

  return (
    <Card className="sticky top-10 h-fit space-y-6 rounded-xl border bg-background p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-medium tracking-tight text-foreground">Order Summary</h2>
        <p className="text-xs text-muted-foreground">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">₹{subTotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="font-medium text-foreground">₹{gst}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-foreground'}`}>
            {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Total */}
      <div className="space-y-1">
        <div className="flex justify-between text-lg">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-bold text-orange-600">₹{total}</span>
        </div>
      </div>

    </Card>
  );
};
