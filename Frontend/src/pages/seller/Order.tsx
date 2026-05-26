import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api} from "@/utils/Axios.tsx";
import {LoadingPage} from "@/components/LoadingPage.tsx";
import type {Order, OrderEnum} from "@/types/type.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {toast} from "sonner";
import { IndianRupee, Package, User, Clock, CreditCard } from "lucide-react";

const OrderPage = () => {
    const {id} = useParams<{id: string}>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<OrderEnum | "">("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const result = await api.get(`/order/seller/order/${id}`);
                setOrder(result.data.data || result.data);
                setSelectedStatus((result.data.data || result.data).status);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!order || !selectedStatus) return;
        try {
            setIsUpdating(true);
            await api.put(`/order/seller/order/${order.id}/status`, { status: selectedStatus });
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
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
            case "confirmed": return "bg-purple-100 text-purple-800 border-purple-200";
            case "shipped": return "bg-indigo-100 text-indigo-800 border-indigo-200";
            case "in_transit": return "bg-primary/15 text-primary border-primary/20";
            case "delivered": return "bg-green-100 text-green-800 border-green-200";
            case "cancelled": return "bg-red-100 text-red-800 border-red-200";
            case "returned": return "bg-gray-100 text-gray-800 border-gray-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (loading) return <LoadingPage />;
    if (!order) return <div className="p-6 text-center">Order not found or access denied</div>;

    const statuses: OrderEnum[] = ["pending", "confirmed", "processing", "shipped", "in_transit", "delivered", "cancelled", "returned"];

    // Calculate sum of items belonging to this seller
    const myItemsTotal = order.items?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        Order #{order.id}
                        <Badge variant="outline" className={`uppercase text-xs ${getStatusColor(order.status)}`}>
                            {order.status.replace("_", " ")}
                        </Badge>
                    </p>
                </div>
                
                <Card className="flex items-center gap-4 p-3 bg-muted/20">
                    <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as OrderEnum)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map(s => (
                                <SelectItem key={s} value={s}>{s.replace("_", " ").toUpperCase()}</SelectItem>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                My Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items?.map((item, index) => (
                                    <div key={item.id}>
                                        <div className="flex gap-4 items-center">
                                            {item.product?.image?.[0] ? (
                                                <img src={item.product.image[0]} alt={item.product.name} className="w-16 h-16 rounded-md object-cover border" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-md border bg-muted flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.product?.name || "Unknown Product"}</h4>
                                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold flex items-center justify-end">
                                                    <IndianRupee className="w-4 h-4 mr-0.5" />
                                                    {item.price}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Subtotal: ₹{Number(item.price) * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        {index < order.items.length - 1 && <Separator className="my-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Payment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Payment Method</span>
                                    <span className="font-medium uppercase">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order Total (All Sellers)</span>
                                    <span className="font-medium flex items-center">
                                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                        {order.totalAmount}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span className="text-primary">My Items Total</span>
                                    <span className="flex items-center text-green-700">
                                        <IndianRupee className="w-5 h-5 mr-0.5" />
                                        {myItemsTotal.toFixed(2)}
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
                                <User className="w-5 h-5 text-primary" />
                                Customer Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">User ID</p>
                                    <p className="font-mono text-xs bg-muted p-1.5 rounded-md mt-1 break-all">{order.userId}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Address ID</p>
                                    <p className="font-mono text-xs bg-muted p-1.5 rounded-md mt-1 break-all">{order.addressId}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Timestamps
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                    <p className="text-sm mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                    <p className="text-sm mt-1">{new Date(order.updatedAt).toLocaleString()}</p>
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