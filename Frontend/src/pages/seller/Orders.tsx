import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "@/utils/Axios.tsx";
import {LoadingPage} from "@/components/LoadingPage.tsx";
import type {Order} from "@/types/type.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, IndianRupee } from "lucide-react";

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const result = await api.get("/order/seller/order");
                setOrders(result.data.data || result.data);
            } catch (error) {
                console.error("Error fetching seller orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

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

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">My Orders</h1>
                <p className="text-muted-foreground mt-1">Manage and fulfill orders placed for your products.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <Card 
                            key={order.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/seller/orders/${order.id}`)}
                        >
                            <CardHeader className="pb-3 border-b bg-muted/10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Package className="w-5 h-5 text-primary" />
                                            Order #{order.id.slice(0, 8)}
                                        </CardTitle>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`uppercase text-[10px] ${getStatusColor(order.status)}`}>
                                        {order.status.replace("_", " ")}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Order Total:</span>
                                        <span className="font-semibold flex items-center text-green-700">
                                            <IndianRupee className="w-3 h-3 mr-0.5" />
                                            {order.totalAmount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Payment:</span>
                                        <span className="font-medium">{order.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">My Items:</span>
                                        <span className="font-medium">{order.items?.length || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-muted/30 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-lg">No orders received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;