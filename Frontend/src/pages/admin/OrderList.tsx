import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import type { Order } from "@/types/type.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, IndianRupee } from "lucide-react";

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await api.get("/admin/orders");
        setOrders(result.data.data || result.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "in_transit":
        return "bg-primary/15 text-primary border-primary/20";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "returned":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          All Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all customer orders across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/admin/orders/${order.id}`)}
            >
              <CardHeader className="bg-muted/10 border-b pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="text-primary h-5 w-5" />
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase ${getStatusColor(order.status)}`}
                  >
                    {order.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="flex items-center font-semibold text-green-700">
                      <IndianRupee className="mr-0.5 h-3 w-3" />
                      {order.totalAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-medium">
                      {order.items?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-muted/30 col-span-full rounded-lg border border-dashed py-12 text-center">
            <p className="text-muted-foreground text-lg">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
