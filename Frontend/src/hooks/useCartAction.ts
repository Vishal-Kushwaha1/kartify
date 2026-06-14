import { useState } from "react";
import { toast } from "sonner";
import {
  useClearCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "@/redux/cart/cartApi";

export const useCartActions = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  const handleIncrementQuantity = async (
    productId: string,
    currentQty: number,
  ) => {
    try {
      setLoadingId(productId);
      await updateCartItem({
        productId,
        quantity: currentQty + 1,
      }).unwrap();
      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setLoadingId(null);
    }
  };

  // decrement
  const handleDecrementQuantity = async (
    productId: string,
    currentQty: number,
  ) => {
    try {
      setLoadingId(productId);
      // remove item if quantity 1
      if (currentQty <= 1) {
        await removeFromCart(productId).unwrap();
        toast.success("Item removed");
        return;
      }

      await updateCartItem({
          productId,
          quantity: currentQty - 1,
        }).unwrap();
      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setLoadingId(null);
    }
  };

  // manual quantity update
  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoadingId(productId);
      await updateCartItem({
          productId,
          quantity,
        }).unwrap();
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setLoadingId(null);
    }
  };

  // remove item
  const handleRemoveItem = async (productId: string) => {
    try {
      setLoadingId(productId);
      await removeFromCart(productId).unwrap();
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setLoadingId(null);
    }
  };

  // clear cart
  const handleClearCart = async () => {
    try {
      setActionLoading(true);
      await clearCart().unwrap();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    loadingId,
    actionLoading,
    handleIncrementQuantity,
    handleDecrementQuantity,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  };
};
