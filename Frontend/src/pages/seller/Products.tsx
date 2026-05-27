import { useEffect, useState } from "react";
import type { Product } from "@/types/type.ts";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Link } from "react-router-dom";
import { Plus, Edit, Eye, PackageOpen, Tag, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

export const Products = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await api.get("/products/seller", { withCredentials: true });
        setProducts(result.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory, prices, and product details.
          </p>
        </div>
        <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 h-11 px-6 rounded-full shadow-md">
          <Link to="/seller/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-3xl bg-muted/20 border-dashed glass-card">
          <div className="bg-muted p-4 rounded-full mb-4 shadow-sm">
            <PackageOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
            You haven't added any products to your store yet. Start selling by adding your first product.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-8">
            <Link to="/seller/add">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-3xl border-transparent bg-muted/10 hover:bg-background">
            {/* Image Section */}
            <div className="relative aspect-square bg-muted/50 overflow-hidden rounded-t-3xl">
              {product.image && product.image.length > 0 ? (
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <PackageOpen className="h-12 w-12 opacity-20" />
                </div>
              )}
              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-600 hover:bg-green-700 text-white shadow-sm" : "shadow-sm backdrop-blur-md bg-background/80 text-foreground"}>
                  {product.isActive ? "Active" : "Draft"}
                </Badge>
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="destructive" className="shadow-sm">Low Stock</Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="destructive" className="shadow-sm">Out of Stock</Badge>
                )}
              </div>
              {/* Dropdown Action Menu */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-sm bg-background/90 hover:bg-background text-foreground backdrop-blur-md border-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link to={`/seller/product/${product.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link to={`/seller/product/${product.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Product
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="p-5 flex-1 flex flex-col bg-background">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-semibold text-lg line-clamp-1" title={product.name}>
                  {product.name}
                </h3>
                <span className="font-bold text-lg text-primary shrink-0">
                  ${product.price?.toFixed(2)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                {product.description || "No description provided."}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-auto">
                <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
                  <PackageOpen className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  {product.stock} in stock
                </div>
                {product.category && product.category.length > 0 && (
                  <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
                    <Tag className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
                    {product.category[0]}
                  </div>
                )}
              </div>
            </CardContent>

            {/* Footer Actions */}
            <CardFooter className="p-4 pt-0 flex gap-2 bg-background border-t mt-4 pb-5 rounded-b-3xl">
              <Button variant="outline" className="w-full text-sm h-10 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors" asChild>
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
