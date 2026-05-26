import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Package, TrendingUp, AlertTriangle, Plus, ArrowRight, Activity } from "lucide-react";
import { api } from "@/utils/Axios.tsx";
import type { Product } from "@/types/type.ts";

export const SellerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await api.get("/products/seller", { withCredentials: true });
        setProducts(result.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch products for dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 rounded-full px-6 shadow-sm" asChild>
            <Link to="/seller/products">Manage Products</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-11 rounded-full px-6 shadow-md" asChild>
            <Link to="/seller/add">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-3xl border-transparent bg-muted/10 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">In your inventory</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-transparent bg-muted/10 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
            <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : activeProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Visible to customers</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-transparent bg-muted/10 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            <div className="h-10 w-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : lowStockProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Items running out soon</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-transparent bg-muted/10 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
            <div className="h-10 w-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-sm">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs immediate restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Recent Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl overflow-hidden border-transparent bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-xl">
          <CardContent className="p-8 sm:p-10 flex flex-col h-full justify-center relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm z-10">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 z-10">Expand Your Store</h2>
            <p className="text-white/90 text-lg mb-8 max-w-md z-10 leading-relaxed">
              Add more products to your inventory to attract more customers and increase your sales potential.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 self-start rounded-full px-8 font-semibold shadow-lg z-10 hover:-translate-y-1 transition-transform">
              <Link to="/seller/add">
                Create New Product <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-transparent bg-muted/5 shadow-md">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 rounded-full border-4 border-orange-600 border-t-transparent animate-spin" />
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 4).map((product) => (
                  <Link key={product.id} to={`/seller/product/${product.id}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors border bg-background/50 group">
                    <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0">
                      {product.image && product.image.length > 0 ? (
                        <img src={product.image[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.category?.[0] || "No category"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-primary">${product.price?.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No products added yet.</p>
              </div>
            )}
            {products.length > 4 && (
              <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10 rounded-xl" asChild>
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

