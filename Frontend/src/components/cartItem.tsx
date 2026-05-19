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
    <Card className="rounded-xl border bg-background p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Image Section */}
        <div className="shrink-0">
          <Avatar className="h-24 w-24 rounded-lg border">
            <AvatarImage src={item.product.image?.[0]} className="object-cover" />
            <AvatarFallback className="rounded-lg bg-muted">
              <span className="text-xs font-medium text-muted-foreground">IMG</span>
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between gap-4">
          {/* Top - Product Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h2 className="line-clamp-2 text-lg font-semibold text-foreground">
                  {item.product.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.product.description}
                </p>
              </div>
              <Badge variant="outline">
                {item.product.category?.[0] || "Product"}
              </Badge>
            </div>
          </div>

          {/* Middle - Price & Quantity Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Price Info */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Unit Price</p>
              <p className="text-lg font-semibold text-foreground">
                ₹{item.product.price}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                disabled={loadingId === productId}
                onClick={() =>
                  handleDecrementQuantity(productId, item.cart_item.quantity)
                }
              >
                <Minus size={16} />
              </Button>

              <Input
                type="number"
                className="h-8 w-12 border-0 bg-transparent text-center text-sm font-medium focus-visible:ring-0"
                value={item.cart_item.quantity}
                min={1}
                onChange={(e) =>
                  handleUpdateQuantity(productId, Number(e.target.value))
                }
              />

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                disabled={loadingId === productId}
                onClick={() =>
                  handleIncrementQuantity(productId, item.cart_item.quantity)
                }
              >
                <Plus size={16} />
              </Button>
            </div>

            {/* Total & Remove */}
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold text-foreground">₹{itemTotal}</p>
              </div>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                disabled={loadingId === productId}
                onClick={() => handleRemoveItem(productId)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
