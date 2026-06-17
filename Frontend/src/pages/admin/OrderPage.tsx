import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import type { Order, OrderEnum } from "@/types/type.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { IndianRupee, Package, User, Clock, CreditCard } from "lucide-react";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderEnum | "">("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.get(`/admin/orders/${id}`);
      setOrder(result.data.data || result.data);
      setSelectedStatus((result.data.data || result.data).status);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [fetchOrder, id]);

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) return;
    try {
      setIsUpdating(true);
      await api.put(`/admin/orders/${order.id}/status`, {
        status: selectedStatus,
      });
      setOrder({ ...order, status: selectedStatus });
      toast.success("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status.");
    } finally {
      setIsUpdating(false);
    }
  };

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
  if (!order) return <div className="p-6 text-center">Order not found</div>;

  const statuses: OrderEnum[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "in_transit",
    "delivered",
    "cancelled",
    "returned",
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            Order #{order.id}
            <Badge
              variant="outline"
              className={`text-xs uppercase ${getStatusColor(order.status)}`}
            >
              {order.status.replace("_", " ")}
            </Badge>
          </p>
        </div>

        <Card className="bg-muted/20 flex items-center gap-4 p-3">
          <Select
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val as OrderEnum)}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleUpdateStatus}
            disabled={isUpdating || selectedStatus === order.status}
          >
            Save Changes
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="text-primary h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4">
                      {item.product?.image?.[0] ? (
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-md border object-cover"
                        />
                      ) : (
                        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-md border">
                          <Package className="text-muted-foreground h-6 w-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {item.product?.name || "Unknown Product"}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center justify-end font-semibold">
                          <IndianRupee className="mr-0.5 h-4 w-4" />
                          {item.price}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Total: ₹{Number(item.price) * item.quantity}
                        </p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-primary h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                {order.paymentId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Transaction ID
                    </span>
                    <span className="font-mono text-xs">{order.paymentId}</span>
                  </div>
                )}
                {order.discountId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Discount Applied
                    </span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="flex items-center text-green-700">
                    <IndianRupee className="mr-0.5 h-5 w-5" />
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-primary h-5 w-5" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    User ID
                  </p>
                  <p className="bg-muted mt-1 rounded-md p-1.5 font-mono text-xs break-all">
                    {order.userId}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Address ID
                  </p>
                  <p className="bg-muted mt-1 rounded-md p-1.5 font-mono text-xs break-all">
                    {order.addressId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-primary h-5 w-5" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Created At
                  </p>
                  <p className="mt-1 text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
