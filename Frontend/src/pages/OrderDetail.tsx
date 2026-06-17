import { LoadingPage } from "@/components/LoadingPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderItem } from "@/types/type";
import { api } from "@/utils/Axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Package, CreditCard, ArrowLeft, Calendar, Hash } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  processing: {
    label: "Processing",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  in_transit: {
    label: "In Transit",
    className: "bg-primary/15 text-primary border-primary/20",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  returned: {
    label: "Returned",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const result = await api.get(`/order/${orderId}`, {
          withCredentials: true,
        });
        setOrder(result.data.data);
      } catch {
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (loading) return <LoadingPage />;
  if (!order) return null;

  const status = statusConfig[order.status] ?? {
    label: order.status,
    className: "bg-gray-100 text-gray-800",
  };

  const itemTotal = order.items?.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const deliveryFee = itemTotal > 400 ? 0 : 60;
  const gst = Number((itemTotal * 0.18).toFixed(2));

  return (
    <div className="bg-muted/40 min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/orders")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Order Details
            </h1>
            <p className="text-muted-foreground font-mono text-xs">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card className="bg-background rounded-xl border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Order Status</p>
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-sm font-medium ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
                  <Calendar className="h-3 w-3" /> Placed on
                </p>
                <p className="text-sm font-medium">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="bg-background rounded-xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Package className="h-4 w-4" />
              Items ({order.items?.length})
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {order.items?.map((item: OrderItem, index: number) => (
              <div key={item.id}>
                <div className="flex gap-4 p-4">
                  {/* Product Image */}
                  <div className="bg-muted h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                    {item.product?.image?.[0] ? (
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="text-muted-foreground h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {item.product?.name}
                    </p>
                    <p className="text-muted-foreground line-clamp-1 text-xs">
                      {item.product?.description}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      ₹
                      {(Number(item.price) * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      ₹{Number(item.price).toLocaleString("en-IN")} each
                    </p>
                  </div>
                </div>
                {index < order.items.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price Breakdown */}
        <Card className="bg-background rounded-xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <CreditCard className="h-4 w-4" />
              Price Details
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Item Total</span>
              <span>₹{itemTotal?.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span>₹{gst?.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span
                className={
                  deliveryFee === 0 ? "font-medium text-green-600" : ""
                }
              >
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <CreditCard className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-xs capitalize">
                Paid via {order.paymentMethod ?? "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card className="bg-background rounded-xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Hash className="h-4 w-4" />
              Order Info
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs">{order.id}</span>
            </div>
            {order.shipmentId && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipment ID</span>
                <span className="font-mono text-xs">{order.shipmentId}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{formatDate(order.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
