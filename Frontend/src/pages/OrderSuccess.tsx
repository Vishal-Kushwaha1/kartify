import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppDispatch} from "@/redux/hook";
import {fetchCartItem} from "@/redux/cart/cartThunk";
import {api} from "@/utils/Axios";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
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
    const dispatch = useAppDispatch();

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
        dispatch(fetchCartItem());

        if (isStripe) {
            const verifyPayment = async () => {
                try {
                    await api.post(
                        "/order/stripe/verify",
                        {sessionId},
                        {withCredentials: true},
                    );
                    setVerified(true);
                    dispatch(fetchCartItem());
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
                        {withCredentials: true},
                    );
                    setVerified(true);
                    dispatch(fetchCartItem());
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
        dispatch,
    ]);

    return (
        <div
            className="min-h-[80vh] flex items-center justify-center bg-linear-to-br from-background via-muted/50 to-background px-4 py-16">
            <Card
                className="w-full max-w-md overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-8 text-center flex flex-col items-center">
                    {loading ? (
                        <div className="space-y-6 py-8">
                            <div className="relative flex items-center justify-center">
                                <div
                                    className="absolute h-16 w-16 animate-ping rounded-full bg-primary/15 dark:bg-primary/20 opacity-75"></div>
                                <div
                                    className="relative rounded-full bg-primary/10 dark:bg-primary/20 p-4 text-primary">
                                    <Loader2 className="h-8 w-8 animate-spin"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                    Verifying Payment
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    Please do not refresh or close this window. We are confirming
                                    your payment.
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="space-y-6 py-6">
                            <div className="mx-auto rounded-full bg-red-50 dark:bg-red-950/50 p-4 text-red-600 w-fit">
                                <XCircle className="h-12 w-12 animate-pulse"/>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                    Verification Failed
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    {error}
                                </p>
                            </div>
                            <div className="pt-4 flex flex-col gap-2 w-full">
                                <Button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
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
                                <div
                                    className="absolute h-20 w-20 animate-pulse rounded-full bg-green-100 dark:bg-green-950/30 opacity-75"></div>
                                <div className="relative rounded-full bg-green-50 dark:bg-green-950 p-4 text-green-600">
                                    <CheckCircle2 className="h-12 w-12"/>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    Order Confirmed!
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    Thank you for your purchase. Your order has been placed
                                    successfully and is now being processed.
                                </p>
                            </div>

                            <div
                                className="rounded-lg bg-muted/50 p-4 border text-left w-full space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className="font-semibold text-green-600">
                    Paid / Placed
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated Delivery</span>
                                    <span className="font-semibold text-foreground">
                    5-7 Business Days
                  </span>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
                                <Button
                                    onClick={() => navigate("/orders")}
                                    variant="outline"
                                    className="w-full sm:flex-1 gap-2"
                                >
                                    <ShoppingBag size={16}/>
                                    View Orders
                                </Button>
                                <Button
                                    onClick={() => navigate("/products")}
                                    className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
                                >
                                    Shop More
                                    <ArrowRight size={16}/>
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
