import { useEffect, useState } from "react";
import { api } from "@/utils/Axios.tsx";
import type { Order, Seller, User } from "@/types/type.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Clock } from "lucide-react";
import { LoadingPage } from "@/components/LoadingPage.tsx";

export const AdminDashboard = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sellersRes, usersRes, pendingRes, ordersRes] = await Promise.all(
          [
            api.get("/admin/seller", { withCredentials: true }),
            api.get("/admin/user", { withCredentials: true }),
            api.get("/admin/pending", { withCredentials: true }),
            api.get("/admin/orders", { withCredentials: true }),
          ],
        );

        setSellers(sellersRes.data.data || []);
        setUsers(usersRes.data.data || []);
        setPendingSellers(pendingRes.data.data || []);
        setOrders(ordersRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingPage />;

  const activeSellers = sellers.filter((s) => s.isActive).length;
  const activeUsers = users.filter((u) => u.isActive).length;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your platform's activity and metrics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {activeUsers} active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {activeSellers} active sellers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-primary text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSellers.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
