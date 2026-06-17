import type { CartData } from "@/types/type";
import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";

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
    <Card className="bg-background/80 relative overflow-hidden rounded-3xl border-none p-6 shadow-sm backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Receipt className="h-32 w-32" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6 space-y-1">
        <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight">
          Order Summary
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Breakdown */}
      <div className="relative z-10 space-y-4 text-sm">
        <div className="bg-muted/30 flex items-center justify-between rounded-xl p-3">
          <span className="text-muted-foreground font-medium">Subtotal</span>
          <span className="text-foreground font-bold">
            ₹{subTotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="bg-muted/30 flex items-center justify-between rounded-xl p-3">
          <span className="text-muted-foreground font-medium">GST (18%)</span>
          <span className="text-foreground font-bold">
            ₹{gst.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="bg-muted/30 flex items-center justify-between rounded-xl p-3">
          <span className="text-muted-foreground font-medium">Delivery</span>
          <span
            className={`font-bold ${deliveryFee === 0 ? "rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-600" : "text-foreground"}`}
          >
            {deliveryFee === 0
              ? "Free"
              : `₹${deliveryFee.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-border/80 relative z-10 my-6 border-t border-dashed">
        <div className="bg-muted/20 absolute -top-3 -left-8 h-6 w-6 rounded-full"></div>
        <div className="bg-muted/20 absolute -top-3 -right-8 h-6 w-6 rounded-full"></div>
      </div>

      {/* Total */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-end justify-between">
          <span className="text-foreground text-base font-bold">Total</span>
          <span className="text-primary text-3xl font-black tracking-tight">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </Card>
  );
};
