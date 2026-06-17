import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Package, Search, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  useFetchWishlistQuery,
  useMoveToCartMutation,
  useRemoveItemFromWishlistMutation,
} from "@/redux/wishlist/wishlistApi";

export const Wishlist = () => {
  const { data: wishlistItems = [], isLoading } = useFetchWishlistQuery();
  const [removeItemFromWishlist] = useRemoveItemFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");

  const totalValue = useMemo(() => {
    return wishlistItems.reduce((sum, item) => {
      const price = Number(item.product.price ?? 0);
      return sum + (Number.isNaN(price) ? 0 : price);
    }, 0);
  }, [wishlistItems]);

  const navigate = useNavigate();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setLoading(true);
      await removeItemFromWishlist(productId);
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      setLoading(true);
      await moveToCart(productId);
      toast.success("Item moved to cart");
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return wishlistItems;
    return wishlistItems.filter((item) =>
      [item.product.name, item.product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [query, wishlistItems]);

  return (
    <div className="bg-muted/40 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="bg-background flex flex-col gap-6 rounded-xl border p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-foreground text-2xl font-medium tracking-tight">
                Wishlist
              </h1>
              <p className="text-muted-foreground text-sm">
                Save your favorite items and move them to cart when you are
                ready.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className="bg-background text-foreground border"
                variant="outline"
              >
                {wishlistItems.length} items
              </Badge>
              <Badge
                className="bg-background text-foreground border"
                variant="outline"
              >
                Value: ₹{totalValue.toFixed(2)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
              <Input
                className="pl-9"
                placeholder="Search wishlist"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">In stock</Button>
              <Button variant="outline">On sale</Button>
              <Button variant="outline">Newest</Button>
            </div>
          </div>
        </div>

        {loading || isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                className="bg-background rounded-xl border"
                key={`skeleton-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted h-20 w-20 animate-pulse rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
                      <div className="bg-muted h-8 w-full animate-pulse rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-background rounded-xl border">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border">
                <Heart className="text-muted-foreground h-5 w-5" />
              </div>
              <div>
                <h2 className="text-foreground text-xl font-medium tracking-tight">
                  Your wishlist is empty
                </h2>
                <p className="text-muted-foreground text-sm">
                  Start exploring products and save items you want to buy later.
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => navigate("/products")}
              >
                Browse products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredItems.map((item) => (
              <Card
                className="group bg-background rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                key={item.wishlist.id}
              >
                <CardHeader className="flex flex-col gap-5 p-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="bg-muted h-24 w-24 rounded-2xl border md:h-28 md:w-28">
                      {item.product.image && (
                        <AvatarImage
                          className="object-cover"
                          src={item.product.image[0]}
                          alt={item.product.name ?? "Wishlist item"}
                        />
                      )}

                      <AvatarFallback className="rounded-2xl">
                        <Package className="text-muted-foreground h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
                          {item.product.name ?? "Wishlist item"}
                        </CardTitle>

                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {item.product.description ??
                            "Fresh pick for your wishlist."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(item.product.category ?? [])
                          .slice(0, 2)
                          .map((tag) => (
                            <Badge
                              key={`${item.product.id}-${tag}`}
                              variant="outline"
                              className="bg-background rounded-md border px-2 py-0.5 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>

                      {/* Extra details like rating and brand can be added here in the future when available in the DB */}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`rounded-md px-3 py-1 ${
                      item.product.stock && item.product.stock > 0
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-primary/20 bg-primary/10 text-primary"
                    }`}
                  >
                    {item.product.stock && item.product.stock > 0
                      ? `${item.product.stock} in stock`
                      : "Notify me"}
                  </Badge>
                </CardHeader>

                <CardContent className="flex flex-col gap-5 p-6 pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Price</p>

                      <div className="flex items-center gap-2">
                        <p className="text-foreground text-lg font-semibold">
                          {item.product.price ? `₹${item.product.price}` : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">
                        Availability
                      </p>

                      <p className="text-foreground text-sm font-medium">
                        {item.product.stock && item.product.stock > 0
                          ? "Ready to ship"
                          : "Out of stock"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() =>
                        handleMoveToCart(
                          item.wishlist.productId || item.product.id,
                        )
                      }
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Move to cart
                    </Button>

                    <Button
                      onClick={() =>
                        handleRemoveFromWishlist(
                          item.product.id || item.wishlist.productId,
                        )
                      }
                      variant="outline"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
