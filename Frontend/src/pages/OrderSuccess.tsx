import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/utils/Axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const rzpOrderId = searchParams.get("rzp_order_id");
  const rzpPaymentId = searchParams.get("rzp_payment_id");
  const rzpSignature = searchParams.get("rzp_signature");
  const orderId = searchParams.get("order_id");

  const isRazorpay =
    !!rzpOrderId && !!rzpPaymentId && !!rzpSignature && !!orderId;
  const isStripe = !!sessionId;

  const [loading, setLoading] = useState<boolean>(isStripe || isRazorpay);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean>(!isStripe && !isRazorpay);

  useEffect(() => {
    if (isStripe) {
      const verifyPayment = async () => {
        try {
          await api.post(
            "/order/stripe/verify",
            { sessionId },
            { withCredentials: true },
          );
          setVerified(true);
        } catch {
          setError(
            "Something went wrong while verifying your payment. Please contact support.",
          );
        } finally {
          setLoading(false);
        }
      };

      verifyPayment();
    } else if (isRazorpay) {
      const verifyRazorpay = async () => {
        try {
          await api.post(
            "/order/razorpay/verify",
            {
              orderId,
              razorpay_order_id: rzpOrderId,
              razorpay_payment_id: rzpPaymentId,
              razorpay_signature: rzpSignature,
            },
            { withCredentials: true },
          );
          setVerified(true);
        } catch {
          setError(
            "Something went wrong while verifying your payment. Please contact support.",
          );
        } finally {
          setLoading(false);
        }
      };

      verifyRazorpay();
    }
  }, [
    sessionId,
    rzpOrderId,
    rzpPaymentId,
    rzpSignature,
    orderId,
    isStripe,
    isRazorpay,
  ]);

  return (
    <div className="from-background via-muted/50 to-background flex min-h-[80vh] items-center justify-center bg-linear-to-br px-4 py-16">
      <Card className="bg-background/60 w-full max-w-md overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl">
        <CardContent className="flex flex-col items-center p-8 text-center">
          {loading ? (
            <div className="space-y-6 py-8">
              <div className="relative flex items-center justify-center">
                <div className="bg-primary/15 dark:bg-primary/20 absolute h-16 w-16 animate-ping rounded-full opacity-75"></div>
                <div className="bg-primary/10 dark:bg-primary/20 text-primary relative rounded-full p-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-foreground text-xl font-semibold tracking-tight">
                  Verifying Payment
                </h2>
                <p className="text-muted-foreground mx-auto max-w-xs text-sm">
                  Please do not refresh or close this window. We are confirming
                  your payment.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="space-y-6 py-6">
              <div className="mx-auto w-fit rounded-full bg-red-50 p-4 text-red-600 dark:bg-red-950/50">
                <XCircle className="h-12 w-12 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-foreground text-2xl font-bold tracking-tight">
                  Verification Failed
                </h2>
                <p className="text-muted-foreground mx-auto max-w-xs text-sm">
                  {error}
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 pt-4">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="bg-primary hover:bg-primary/90 w-full text-white"
                >
                  Return to Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </div>
            </div>
          ) : verified ? (
            <div className="space-y-6 py-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-20 w-20 animate-pulse rounded-full bg-green-100 opacity-75 dark:bg-green-950/30"></div>
                <div className="relative rounded-full bg-green-50 p-4 text-green-600 dark:bg-green-950">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-foreground text-3xl font-extrabold tracking-tight">
                  Order Confirmed!
                </h2>
                <p className="text-muted-foreground mx-auto max-w-xs text-sm">
                  Thank you for your purchase. Your order has been placed
                  successfully and is now being processed.
                </p>
              </div>

              <div className="bg-muted/50 text-muted-foreground w-full space-y-1.5 rounded-lg border p-4 text-left text-xs">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-semibold text-green-600">
                    Paid / Placed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-foreground font-semibold">
                    5-7 Business Days
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
                <Button
                  onClick={() => navigate("/orders")}
                  variant="outline"
                  className="w-full gap-2 sm:flex-1"
                >
                  <ShoppingBag size={16} />
                  View Orders
                </Button>
                <Button
                  onClick={() => navigate("/products")}
                  className="bg-primary hover:bg-primary/90 w-full gap-2 text-white sm:flex-1"
                >
                  Shop More
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
