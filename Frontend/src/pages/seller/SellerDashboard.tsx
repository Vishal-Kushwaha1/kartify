import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";
import { api } from "@/utils/Axios.tsx";
import type { Product } from "@/types/type.ts";

export const SellerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const result = await api.get("/products/seller", {
        withCredentials: true,
      });
      setProducts(result.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch products for dashboard", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= 5,
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-7xl px-4 py-8 duration-700">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-11 rounded-full px-6 shadow-sm"
            asChild
          >
            <Link to="/seller/products">Manage Products</Link>
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 h-11 rounded-full px-6 shadow-md"
            asChild
          >
            <Link to="/seller/add">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-muted/10 rounded-3xl border-transparent transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Products
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "-" : totalProducts}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              In your inventory
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/10 rounded-3xl border-transparent transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Products
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "-" : activeProducts}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Visible to customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/10 rounded-3xl border-transparent transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Low Stock
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "-" : lowStockProducts}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Items running out soon
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/10 rounded-3xl border-transparent transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Out of Stock
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "-" : outOfStockProducts}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Needs immediate restock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Recent Activity Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-3xl border-transparent bg-linear-to-br from-orange-500 to-rose-500 text-white shadow-xl">
          <CardContent className="relative flex h-full flex-col justify-center p-8 sm:p-10">
            <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h2 className="z-10 mb-4 text-3xl font-bold">Expand Your Store</h2>
            <p className="z-10 mb-8 max-w-md text-lg leading-relaxed text-white/90">
              Add more products to your inventory to attract more customers and
              increase your sales potential.
            </p>
            <Button
              asChild
              size="lg"
              className="text-primary z-10 self-start rounded-full bg-white! px-8 font-semibold shadow-lg transition-transform hover:-translate-y-1 hover:bg-white/90"
            >
              <Link to="/seller/add">
                Create New Product <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/5 rounded-3xl border-transparent shadow-md">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    to={`/seller/product/${product.id}`}
                    className="hover:bg-muted/50 bg-background/50 group flex items-center gap-4 rounded-2xl border p-3 transition-colors"
                  >
                    <div className="bg-muted h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      {product.image && product.image.length > 0 ? (
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="text-muted-foreground/30 h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {product.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {product.category?.[0] || "No category"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-primary text-sm font-bold">
                        ${product.price?.toFixed(2)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-muted-foreground mb-4">
                  No products added yet.
                </p>
              </div>
            )}
            {products.length > 4 && (
              <Button
                variant="ghost"
                className="text-primary hover:text-primary hover:bg-primary/10 mt-4 w-full rounded-xl"
                asChild
              >
                <Link to="/seller/products">View All Products</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
