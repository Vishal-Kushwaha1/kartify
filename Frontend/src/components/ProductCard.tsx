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
      className="group flex flex-col border-none bg-background shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full h-64 bg-muted/30 overflow-hidden">
        {images.length > 0 ? (
          <Carousel
            className="w-full h-full"
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent>
              {images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <div className="w-full h-64 flex items-center justify-center">
                    <img
                      src={img}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CarouselPrevious className="left-2 bg-background/50 backdrop-blur border-none hover:bg-background h-8 w-8" />
                <CarouselNext className="right-2 bg-background/50 backdrop-blur border-none hover:bg-background h-8 w-8" />
              </div>
            )}
          </Carousel>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
            No image available
          </div>
        )}
        {/* Floating Wishlist Button */}
        {user && (
          <button
            onClick={(e) => onWishlistToggle(e, item.id)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-background/60 backdrop-blur-md border border-border/50 hover:bg-background transition-colors shadow-sm"
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
              className="shadow-sm font-semibold text-[10px] uppercase tracking-wider"
            >
              Sold Out
            </Badge>
          )}
          {item.stock !== undefined && inStock && item.stock < 10 && (
            <Badge className="bg-amber-500 text-white shadow-sm font-semibold text-[10px] uppercase tracking-wider hover:bg-amber-600">
              Low Stock
            </Badge>
          )}
        </div>
      </div>
      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.category?.map((cat) => (
            <span
              key={cat}
              className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
        <h3 className="font-semibold text-base text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {item.description}
          </p>
        )}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium mb-0.5">
              Price
            </span>
            <span className="text-xl font-bold text-foreground tracking-tight">
              ₹{item.price?.toLocaleString("en-IN") ?? "0"}
            </span>
          </div>
          {user && (
            <Button
              onClick={(e) => onAddToCart(e, item.id)}
              disabled={actionLoading === item.id || !inStock}
              size="icon"
              className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
            >
              {actionLoading === item.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
              ) : (
                <ShoppingCart className="h-4 w-4 text-primary-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
