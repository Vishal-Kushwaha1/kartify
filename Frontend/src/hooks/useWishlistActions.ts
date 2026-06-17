import { api } from "@/utils/Axios.tsx";
import { toast } from "sonner";
import { useState } from "react";
import type { WishlistItem } from "@/types/type.ts";

export const useWishlistActions = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/wishlist", {
        withCredentials: true,
      });
      const payload = response?.data?.data ?? response?.data ?? [];
      setWishlistItems(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      await api.post("/wishlist", { productId }, { withCredentials: true });
      await api.post(
        `/recommendation/track`,
        { productId, actionType: "wishlist" },
        { withCredentials: true },
      );
      toast.success("Item added to wishlist");
      await fetchWishlist();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
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

  return {
    wishlistItems,
    fetchWishlist,
    handleAddToWishlist,
    handleWishlistToggle,
  };
};
