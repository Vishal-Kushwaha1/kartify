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
  const itemTotal = Number(item.cart_item.quantity) * Number(item.cart_item.price);

  return (
    <Card className="rounded-2xl border-none shadow-sm bg-background hover:shadow-md transition-shadow p-5 flex flex-col gap-4 sm:flex-row">
      {/* Image Section */}
      <div className="shrink-0 flex items-center justify-center">
        <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-muted/30 border border-border/50">
          <Avatar className="h-full w-full rounded-none">
            <AvatarImage src={item.product.image?.[0]} className="object-cover" />
            <AvatarFallback className="rounded-none bg-muted/20">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider">IMG</span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between gap-4 py-1">
        
        {/* Top - Product Info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <h2 className="line-clamp-2 text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {item.product.name}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0 h-5">
                {item.product.category?.[0] || "Product"}
              </Badge>
              <span className="text-sm font-semibold text-primary">
                ₹{item.product.price?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
            disabled={loadingId === productId}
            onClick={() => handleRemoveItem(productId)}
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Bottom - Controls & Total */}
        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/10 p-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full hover:bg-background shadow-sm transition-colors"
              disabled={loadingId === productId}
              onClick={() => handleDecrementQuantity(productId, item.cart_item.quantity)}
            >
              <Minus size={14} />
            </Button>

            <Input
              type="number"
              className="h-7 w-10 border-0 bg-transparent text-center text-sm font-bold focus-visible:ring-0 p-0 shadow-none hide-number-spinners"
              value={item.cart_item.quantity}
              min={1}
              onChange={(e) => handleUpdateQuantity(productId, Number(e.target.value))}
            />

            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full hover:bg-background shadow-sm transition-colors"
              disabled={loadingId === productId}
              onClick={() => handleIncrementQuantity(productId, item.cart_item.quantity)}
            >
              <Plus size={14} />
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-right flex flex-col">
            <span className="text-xl font-bold text-foreground">
              ₹{itemTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
