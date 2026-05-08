import type { Product } from "@/types/type";
import { api } from "@/utils/Axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { LoadingPage } from "@/components/LoadingPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  IndianRupee,
  Package,
} from "lucide-react";

export const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/seller/products");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const result = await api.get(`/products/${id}`);

        const product = result?.data?.data;
        if (!product) {
          toast.error("No product found");
          return;
        }
        setProduct(product);
        setActiveImage(product?.image?.[0] || "");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleDelete = async () => {
    const productId = id;
    try {
      const result = await api.delete(`/products/${productId}`);
      toast.success("Product Deleted");
      navigate("/seller/products");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }
  if (!product) return null;

  return (
    <div className="min-h-screen bg-muted/40 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/seller/products")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Badge
            className={`border px-3 py-1 text-xs font-normal ${
              product.isActive
                ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300"
                : ""
            }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-xl border bg-background p-6">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border bg-muted/30">
                <img
                  src={activeImage || "https://placehold.co/800x800/png"}
                  alt={product.name}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>

              {product.image && product.image.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`overflow-hidden rounded-lg border transition ${
                        activeImage === img
                          ? "border-orange-600"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`product-${index}`}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-xl border bg-background p-6">
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Product Name
                  </p>

                  <h1 className="text-2xl font-medium tracking-tight text-foreground">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-foreground">
                  <IndianRupee className="h-5 w-5 text-orange-600" />

                  <span className="text-2xl font-medium tracking-tight">
                    {product.price}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                      <Boxes className="h-4 w-4" />
                      <p className="text-xs">Stock</p>
                    </div>

                    <p className="text-sm text-foreground">
                      {product.stock} available
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-4">
                    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <p className="text-xs">Created</p>
                    </div>

                    <p className="text-sm text-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Categories
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {product.category?.length ? (
                      product.category.map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-md px-3 py-1 text-xs font-normal"
                        >
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No categories added
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-xl border bg-background p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />

                  <p className="text-xs text-muted-foreground">Description</p>
                </div>

                <p className="text-sm leading-7 text-muted-foreground">
                  {product.description || "No description available"}
                </p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/seller/product/${id}/edit`)}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                Edit Product
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this product?",
                    )
                  ) {
                    handleDelete();
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
