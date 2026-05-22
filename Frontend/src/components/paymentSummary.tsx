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
    <Card className="rounded-3xl border-none shadow-sm bg-background/80 backdrop-blur-sm p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Receipt className="w-32 h-32" />
      </div>
      
      {/* Header */}
      <div className="space-y-1 mb-6 relative z-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Order Summary
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-4 text-sm relative z-10">
        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl">
          <span className="text-muted-foreground font-medium">Subtotal</span>
          <span className="font-bold text-foreground">₹{subTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl">
          <span className="text-muted-foreground font-medium">GST (18%)</span>
          <span className="font-bold text-foreground">₹{gst.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl">
          <span className="text-muted-foreground font-medium">Delivery</span>
          <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded' : 'text-foreground'}`}>
            {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toLocaleString('en-IN')}`}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-dashed border-border/80 relative z-10">
        <div className="absolute -left-8 -top-3 w-6 h-6 rounded-full bg-muted/20"></div>
        <div className="absolute -right-8 -top-3 w-6 h-6 rounded-full bg-muted/20"></div>
      </div>

      {/* Total */}
      <div className="space-y-1 relative z-10">
        <div className="flex justify-between items-end">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-3xl font-black text-primary tracking-tight">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </Card>
  );
};
