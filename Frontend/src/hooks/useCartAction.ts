import { useDispatch } from "react-redux";
import { useState } from "react";
import type { AppDispatch } from "@/redux/store";
import {
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/redux/cart/cartThunk";
import { toast } from "sonner";

export const useCartActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // increment
  const handleIncrementQuantity = async (
    productId: string,
    currentQty: number,
  ) => {
    try {
      setLoadingId(productId);
      await dispatch(
        updateCartItem({
          productId,
          quantity: currentQty + 1,
        }),
      ).unwrap();
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
        await dispatch(removeFromCart(productId)).unwrap();
        toast.success("Item removed");
        return;
      }

      await dispatch(
        updateCartItem({
          productId,
          quantity: currentQty - 1,
        }),
      ).unwrap();
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
      await dispatch(
        updateCartItem({
          productId,
          quantity,
        }),
      ).unwrap();
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
      setLoadingId(productId)
      await dispatch(removeFromCart(productId)).unwrap();
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
      await dispatch(clearCart()).unwrap();
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
