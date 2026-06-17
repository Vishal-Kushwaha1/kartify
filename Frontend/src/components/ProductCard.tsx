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
import type { Product } from "@/types/type.ts";
import type { NavigateFunction } from "react-router-dom";
import { useGetUserQuery } from "@/redux/user/userApi";

const ProductCard = ({
  item,
  wishlistIds,
  actionLoading,
  onWishlistToggle,
  onAddToCart,
  navigate,
}: {
  item: Product;
  wishlistIds: Set<string>;
  actionLoading: string | null;
  onWishlistToggle: (e: React.MouseEvent, productId: string) => void;
  onAddToCart: (e: React.MouseEvent, productId: string) => void;
  navigate: NavigateFunction;
}) => {
  const getImages = (item: Product) => {
    if (Array.isArray(item.image) && item.image.length > 0) {
      return item.image;
    }
    if (typeof item.image === "string" && item.image) {
      return [item.image];
    }
    return [];
  };
  const images = getImages(item);
  const inStock = item.stock !== undefined ? item.stock > 0 : true;

  const { data: user } = useGetUserQuery();

  return (
    <Card
      onClick={() => navigate(`/products/${item.id}`)}
      className="group bg-background flex cursor-pointer flex-col overflow-hidden rounded-3xl border-none shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="bg-muted/30 relative h-64 w-full overflow-hidden">
        {images.length > 0 ? (
          <Carousel
            className="h-full w-full"
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent>
              {images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="flex h-64 w-full items-center justify-center">
                    <img
                      src={img}
                      alt={item.name}
                      className="h-full w-full transform object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <CarouselPrevious className="bg-background/50 hover:bg-background left-2 h-8 w-8 border-none backdrop-blur" />
                <CarouselNext className="bg-background/50 hover:bg-background right-2 h-8 w-8 border-none backdrop-blur" />
              </div>
            )}
          </Carousel>
        ) : (
          <div className="text-muted-foreground bg-muted/50 flex h-full w-full items-center justify-center">
            No image available
          </div>
        )}
        {/* Floating Wishlist Button */}
        {user && (
          <button
            onClick={(e) => onWishlistToggle(e, item.id)}
            className="bg-background/60 border-border/50 hover:bg-background absolute top-4 right-4 z-10 rounded-full border p-2.5 shadow-sm backdrop-blur-md transition-colors"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlistIds.has(item.id)
                  ? "fill-rose-500 text-rose-500"
                  : "text-foreground"
              }`}
            />
          </button>
        )}
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {!inStock && (
            <Badge
              variant="destructive"
              className="text-[10px] font-semibold tracking-wider uppercase shadow-sm"
            >
              Sold Out
            </Badge>
          )}
          {item.stock !== undefined && inStock && item.stock < 10 && (
            <Badge className="bg-amber-500 text-[10px] font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-amber-600">
              Low Stock
            </Badge>
          )}
        </div>
      </div>
      {/* Content Container */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.category?.map((cat) => (
            <span
              key={cat}
              className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
            >
              {cat}
            </span>
          ))}
        </div>
        <h3 className="text-foreground group-hover:text-primary mb-1 line-clamp-1 text-base font-semibold transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
            {item.description}
          </p>
        )}
        <div className="border-border/50 mt-auto flex items-end justify-between border-t pt-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-0.5 text-xs font-medium">
              Price
            </span>
            <span className="text-foreground text-xl font-bold tracking-tight">
              ₹{item.price?.toLocaleString("en-IN") ?? "0"}
            </span>
          </div>
          {user && (
            <Button
              onClick={(e) => onAddToCart(e, item.id)}
              disabled={actionLoading === item.id || !inStock}
              size="icon"
              className="bg-primary hover:bg-primary/90 h-10 w-10 rounded-full shadow-sm transition-all group-hover:scale-110 hover:shadow-md"
            >
              {actionLoading === item.id ? (
                <Loader2 className="text-primary-foreground h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="text-primary-foreground h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
