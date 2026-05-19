import { addToCart, fetchCartItem } from "@/redux/cart/cartThunk";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Product, Wishlist, WishlistItem } from "@/types/type";
import { api } from "@/utils/Axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const { cart, loading, error } = useSelector(
  //   (state: RootState) => state.cart,
  // );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setPageLoading(true);
        const response = await api.get("/products");
        const data = response?.data?.data ?? response?.data ?? [];
        setProducts(data);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setPageLoading(false);
      }
    };
    const fetchWishlist = async () => {
      try {
        const response = await api.get("/wishlist", { withCredentials: true });
        const wishlistData: WishlistItem[] = response?.data?.data ?? [];
        const ids = wishlistData.map((item) => item.wishlist.productId);
        setWishlistIds(new Set(ids));
      } catch (error) {
        console.error("Fetching wishlist error", error);
      }
    };
    fetchProducts();
    fetchWishlist();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      setActionLoading(productId);
      await dispatch(addToCart(productId)).unwrap();
      toast.success("Item added to cart");
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setActionLoading(null);
    }
  };

  const handleWishlistToggle = async (
    e: React.MouseEvent,
    productId: string,
  ) => {
    e.stopPropagation();
    try {
      if (wishlistIds.has(productId)) {
        await api.delete(`/wishlist/${productId}`, { withCredentials: true });
        setWishlistIds((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
        toast.success("Removed from Wishlist");
      } else {
        await api.post("/wishlist", { productId }, { withCredentials: true });
        setWishlistIds((prev) => new Set(prev).add(productId));
        toast.success("Item added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Wishlist error");
    }
  };

  const getImages = (item: Product) => {
    if (Array.isArray(item.image) && item.image.length > 0) {
      return item.image;
    }
    if (typeof item.image === "string" && item.image) {
      return [item.image];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">
            Products
          </h1>
          <p className="text-muted-foreground">
            Discover our curated collection of premium products
          </p>
        </div>

        {pageLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <Card
                key={item.id}
                onClick={() => navigate(`/products/${item.id}`)}
                className="border bg-background p-6 rounded-xl hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="mb-4">
                  {(() => {
                    const images = getImages(item);
                    return images.length > 0 ? (
                      <Carousel className="w-full" opts={{ loop: true }}>
                        <CarouselContent>
                          {images.map((image, idx) => (
                            <CarouselItem key={idx}>
                              <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                  src={image}
                                  alt={`${item.name} - ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {images.length > 1 && (
                          <>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </>
                        )}
                      </Carousel>
                    ) : (
                      <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-muted-foreground text-sm">
                          No image
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2">
                      {item.name}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => handleWishlistToggle(e, item.id)}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        wishlistIds.has(item.id)
                          ? "fill-orange-600 text-orange-600"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>

                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>
                )}
                <div className="flex gap-2">
                  {item.category?.map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4 mt-auto">
                  <div>
                    {item.price && (
                      <p className="text-lg font-medium text-foreground">
                        ₹{item.price}
                      </p>
                    )}
                  </div>
                  {item.stock !== undefined && (
                    <Badge
                      variant={item.stock > 0 ? "default" : "secondary"}
                      className={
                        item.stock > 0
                          ? item.stock > 10
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-orange-100 text-orange-800 border-orange-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {item.stock > 0 ? `${item.stock} left` : "Out of stock"}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={(e) => handleAddToCart(e, item.id)}
                  disabled={
                    actionLoading === item.id ||
                    (item.stock !== undefined && item.stock === 0)
                  }
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2"
                >
                  {actionLoading === item.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Add to cart
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
