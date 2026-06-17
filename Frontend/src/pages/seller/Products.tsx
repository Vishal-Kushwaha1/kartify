import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/type.ts";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Eye, PackageOpen, Tag, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

const Products = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const result = await api.get("/products/seller", {
        withCredentials: true,
      });
      setProducts(result.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-7xl px-4 py-8 duration-700">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory, prices, and product details.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 h-11 shrink-0 rounded-full px-6 shadow-md"
        >
          <Link to="/seller/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="bg-muted/20 glass-card flex flex-col items-center justify-center rounded-3xl border border-dashed py-24 text-center">
          <div className="bg-muted mb-4 rounded-full p-4 shadow-sm">
            <PackageOpen className="text-muted-foreground h-10 w-10" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No products found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
            You haven't added any products to your store yet. Start selling by
            adding your first product.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 rounded-full px-8"
          >
            <Link to="/seller/add">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            onClick={() => navigate(`/seller/product/${product.id}`)}
            className="group bg-muted/10 hover:bg-background flex flex-col overflow-hidden rounded-3xl border-transparent transition-all duration-300 hover:shadow-xl"
          >
            {/* Image Section */}
            <div className="bg-muted/50 relative aspect-square overflow-hidden rounded-t-3xl">
              {product.image && product.image.length > 0 ? (
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                  <PackageOpen className="h-12 w-12 opacity-20" />
                </div>
              )}
              {/* Badges on image */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                <Badge
                  variant={product.isActive ? "default" : "secondary"}
                  className={
                    product.isActive
                      ? "bg-green-600 text-white shadow-sm hover:bg-green-700"
                      : "bg-background/80 text-foreground shadow-sm backdrop-blur-md"
                  }
                >
                  {product.isActive ? "Active" : "Draft"}
                </Badge>
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="destructive" className="shadow-sm">
                    Low Stock
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="shadow-sm">
                    Out of Stock
                  </Badge>
                )}
              </div>
              {/* Dropdown Action Menu */}
              <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-background/90 hover:bg-background text-foreground h-8 w-8 rounded-full border-0 shadow-sm backdrop-blur-md"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-lg"
                    >
                      <Link to={`/seller/product/${product.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-lg"
                    >
                      <Link to={`/seller/product/${product.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Product
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="bg-background flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3
                  className="line-clamp-1 text-lg font-semibold"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <span className="text-primary shrink-0 text-lg font-bold">
                  {product.price?.toFixed(2)}
                </span>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
                {product.description || "No description provided."}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2">
                <div className="text-muted-foreground bg-muted/50 flex items-center rounded-full px-2.5 py-1.5 text-xs font-medium">
                  <PackageOpen className="text-primary mr-1.5 h-3.5 w-3.5" />
                  {product.stock} in stock
                </div>
                {product.category && product.category.length > 0 && (
                  <div className="text-muted-foreground bg-muted/50 flex items-center rounded-full px-2.5 py-1.5 text-xs font-medium">
                    <Tag className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
                    {product.category[0]}
                  </div>
                )}
              </div>
            </CardContent>

            {/* Footer Actions */}
            <CardFooter className="bg-background mt-4 flex gap-2 rounded-b-3xl border-t p-4 pt-2 pb-2">
              <Button
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary/20 h-10 w-full rounded-full text-sm transition-colors"
                asChild
              >
                <Link to={`/seller/product/${product.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;
