import type { Product, Review as ReviewProps, User } from "@/types/type";
import { api } from "@/utils/Axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Hash,
  Package,
  Star,
  Store,
  XCircle,
} from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { Review } from "@/components/Review";
import { toast } from "sonner";
import { useWishlistActions } from "@/hooks/useWishlistActions.ts";
import { useGetUserQuery } from "@/redux/user/userApi";
import {
  useAddToCartMutation,
  useGetCartItemQuery,
} from "@/redux/cart/cartApi";

type ReviewPropsData = { review: ReviewProps; user: User };

export const ProductDetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewPropsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: user } = useGetUserQuery();
  const { data: cart } = useGetCartItemQuery();
  const [addToCart] = useAddToCartMutation();
  const { id } = useParams();

  const isInCart = cart?.some(
    (item) => item.cart_item.productId === product?.id,
  );
  const { handleWishlistToggle } = useWishlistActions();

  const handleButtonCLick = async () => {
    if (isInCart) {
      navigate("/checkout");
    } else {
      try {
        setCartLoading(true);
        await addToCart({ productId: product?.id }).unwrap();
        toast.success("Item added to cart");
      } catch (error) {
        toast.error("Failed to add item");
      } finally {
        setCartLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await api.get(`/products/${id}`);
        setProduct(result.data.data);
        if (user) {
          await api.post(
            `/recommendation/track`,
            { productId: id, actionType: "view" },
            { withCredentials: true },
          );
        }
      } catch {
        toast.error("Unable to load product. Please refresh");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const result = await api.get(`/review/${id}`);
        setReviews(result.data.data);
      } catch (error) {
        console.error("unable to load reviews");
      } finally {
        setReviewLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [user, id]);

  const images = product?.image ?? [];
  const categories = product?.category ?? [];
  const stock = product?.stock ?? 0;
  const stockStatus =
    stock > 10 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock";
  const stockDotClass =
    stock > 10
      ? "bg-primary"
      : stock > 0
        ? "bg-primary"
        : "bg-muted-foreground";

  if (loading) {
    return (
      <div className="bg-muted/40 text-foreground min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-32" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="bg-background rounded-xl border p-6 shadow-none">
              <Skeleton className="aspect-square w-full rounded-xl" />
            </Card>

            <Card className="bg-background rounded-xl border p-6 shadow-none">
              <div className="space-y-5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-muted/40 text-foreground flex min-h-screen items-center justify-center px-6 py-10">
        <Card className="bg-background w-full max-w-md rounded-xl border p-6 text-center shadow-none">
          <div className="bg-muted/40 mx-auto mb-4 flex size-12 items-center justify-center rounded-full border">
            <Package className="text-muted-foreground size-5" />
          </div>
          <h2 className="text-xl font-medium tracking-tight">
            Product does not exist
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            The product you are looking for may have been removed.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90 mt-6 text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 text-foreground min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-background rounded-xl border p-6 shadow-none">
            {images?.length > 0 ? (
              <Carousel
                className="w-full"
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={index}>
                      <Card className="bg-background overflow-hidden rounded-xl border shadow-none">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <img
                            src={img}
                            alt={product.name}
                            className="h-full w-full rounded-lg object-contain"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-3" />
                    <CarouselNext className="right-3" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="bg-muted/40 flex aspect-square items-center justify-center rounded-xl border">
                <div className="text-center">
                  <Package className="text-muted-foreground mx-auto size-8" />
                  <p className="text-muted-foreground mt-3 text-sm">
                    No image found
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="bg-background rounded-xl border p-6 shadow-none">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Product ID</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Hash className="text-muted-foreground size-4" />
                    <span className="text-sm">{product.id.slice(-8)}</span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary"
                >
                  {product.isActive ? (
                    <CheckCircle2 className="mr-1 size-3" />
                  ) : (
                    <XCircle className="mr-1 size-3" />
                  )}
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <h1 className="text-2xl font-medium tracking-tight">
                  {product.name || "Product Name"}
                </h1>
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  {product.description || "No description available."}
                </p>
              </div>

              {categories?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {categories?.map((cat, index) => (
                      <Badge key={index} variant="secondary">
                        #{cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-background rounded-xl border p-4">
                  <p className="text-muted-foreground text-xs">Seller</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback>
                        <Store className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="truncate text-sm font-medium">
                      {product.sellerStore || "Kartify Seller"}
                    </p>
                  </div>
                </div>

                <div className="bg-background rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Stock Status
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`size-2.5 rounded-full ${stockDotClass}`}
                        />
                        <p className="text-foreground text-sm font-medium">
                          {stockStatus}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary"
                    >
                      {stock} left
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mt-3 text-xs">
                    {stock > 0
                      ? "Inventory is available for this product."
                      : "This product is currently unavailable."}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 border-t pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs">Created At</p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground size-4" />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Updated At</p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Calendar className="text-muted-foreground size-4" />
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {user && (
                <div className="grid gap-3 border-t pt-6 sm:grid-cols-2">
                  <Button onClick={(e) => handleWishlistToggle(e, product.id)}>
                    Add to Wishlist
                  </Button>
                  <Button onClick={handleButtonCLick} disabled={cartLoading}>
                    {isInCart ? "Checkout" : "Add to Cart"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Review Form */}
          <div>
            <ReviewForm />
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-lg font-medium tracking-tight">
                Customer Reviews
              </h3>
              {reviews.length > 0 && !reviewLoading && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <=
                          Math.round(
                            reviews.reduce(
                              (sum: number, r: ReviewPropsData) =>
                                sum + r.review.rating,
                              0,
                            ) / reviews.length,
                          )
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    {(
                      reviews.reduce(
                        (sum: number, r: ReviewPropsData) =>
                          sum + r.review.rating,
                        0,
                      ) / reviews.length
                    ).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {reviewLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-background space-y-3 rounded-xl border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-muted/40 flex items-center justify-center rounded-xl border border-dashed py-8">
                  <p className="text-muted-foreground text-sm">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((feedback: ReviewPropsData) => (
                    <Review key={feedback.review.id} feedback={feedback} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
