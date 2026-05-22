import { LoadingPage } from "@/components/LoadingPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderItem } from "@/types/type";
import { api } from "@/utils/Axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, CreditCard, ShoppingBag, ChevronRight } from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed:  { label: "Confirmed",  className: "bg-blue-100 text-blue-800 border-blue-200" },
  processing: { label: "Processing", className: "bg-purple-100 text-purple-800 border-purple-200" },
  shipped:    { label: "Shipped",    className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  in_transit: { label: "In Transit", className: "bg-orange-100 text-orange-800 border-orange-200" },
  delivered:  { label: "Delivered",  className: "bg-green-100 text-green-800 border-green-200" },
  cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-800 border-red-200" },
  returned:   { label: "Returned",   className: "bg-gray-100 text-gray-800 border-gray-200" },
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};



export const Orders = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await api.get("/order", { withCredentials: true });
        setOrders(result.data.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">
            {orders?.length
              ? `${orders.length} order${orders.length > 1 ? "s" : ""} placed`
              : "Track and manage your orders"}
          </p>
        </div>

        {/* Empty State */}
        {orders && orders.length === 0 && (
          <Card className="rounded-xl border bg-background">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="rounded-full bg-muted p-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold text-foreground">No orders yet</h2>
                <p className="text-sm text-muted-foreground">
                  Looks like you haven't placed any orders yet.
                </p>
              </div>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => navigate("/products")}
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders?.map((order: Order) => {
            const status = statusConfig[order.status] ?? {
              label: order.status,
              className: "bg-gray-100 text-gray-800",
            };

            return (
              <Card
                key={order.id}
                className="rounded-xl border bg-background hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left — Order ID + Date */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground font-mono">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Right — Status + Arrow */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4 space-y-4">
                  {/* Product Images + Names */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items?.slice(0, 3).map((item: OrderItem) => (
                        <div
                          key={item.id}
                          className="h-12 w-12 rounded-lg border-2 border-background overflow-hidden bg-muted"
                        >
                          {item.product?.image?.[0] ? (
                            <img
                              src={item.product.image[0]}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="h-12 w-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground font-medium">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {order.items?.[0]?.product?.name}
                        {order.items?.length > 1 &&
                          ` + ${order.items.length - 1} more item${order.items.length - 1 > 1 ? "s" : ""}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Footer — Amount + Payment */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span className="capitalize">{order.paymentMethod ?? "—"}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};