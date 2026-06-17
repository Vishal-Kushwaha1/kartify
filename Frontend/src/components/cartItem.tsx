import type { CartData } from "@/types/type";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartActions } from "@/hooks/useCartAction";

type Props = {
  item: CartData;
};

export const CartItem = ({ item }: Props) => {
  const {
    loadingId,
    handleIncrementQuantity,
    handleDecrementQuantity,
    handleUpdateQuantity,
    handleRemoveItem,
  } = useCartActions();

  const productId = item.product.id || item.cart_item.productId;
  const itemTotal =
    Number(item.cart_item.quantity) * Number(item.cart_item.price);

  return (
    <Card className="bg-background flex flex-col gap-4 rounded-2xl border-none p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      {/* Image Section */}
      <div className="flex shrink-0 items-center justify-center">
        <div className="bg-muted/30 border-border/50 relative h-28 w-28 overflow-hidden rounded-xl border">
          <Avatar className="h-full w-full rounded-none">
            <AvatarImage
              src={item.product.image?.[0]}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted/20 rounded-none">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider">
                IMG
              </span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between gap-4 py-1">
        {/* Top - Product Info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <h2 className="text-foreground group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition-colors">
              {item.product.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="h-5 py-0 text-[10px] font-bold uppercase"
              >
                {item.product.category?.[0] || "Product"}
              </Badge>
              <span className="text-primary text-sm font-semibold">
                ₹{item.product.price?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full"
            disabled={loadingId === productId}
            onClick={() => handleRemoveItem(productId)}
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Bottom - Controls & Total */}
        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="border-border/60 bg-muted/10 flex items-center gap-1.5 rounded-full border p-1">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-background h-7 w-7 rounded-full shadow-sm transition-colors"
              disabled={loadingId === productId}
              onClick={() =>
                handleDecrementQuantity(productId, item.cart_item.quantity)
              }
            >
              <Minus size={14} />
            </Button>

            <Input
              type="number"
              className="hide-number-spinners h-7 w-10 border-0 bg-transparent p-0 text-center text-sm font-bold shadow-none focus-visible:ring-0"
              value={item.cart_item.quantity}
              min={1}
              onChange={(e) =>
                handleUpdateQuantity(productId, Number(e.target.value))
              }
            />

            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-background h-7 w-7 rounded-full shadow-sm transition-colors"
              disabled={loadingId === productId}
              onClick={() =>
                handleIncrementQuantity(productId, item.cart_item.quantity)
              }
            >
              <Plus size={14} />
            </Button>
          </div>

          {/* Total Price */}
          <div className="flex flex-col text-right">
            <span className="text-foreground text-xl font-bold">
              ₹{itemTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
