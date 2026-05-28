import {api} from "@/utils/Axios.tsx";
import {toast} from "sonner";
import {useState} from "react";
import type {WishlistItem} from "@/types/type.ts";

export const useWishlistActions = () => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

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
            await api.post(
                "/wishlist",
                { productId },
                { withCredentials: true },
            );
            toast.success("Item added to wishlist");
            await fetchWishlist();
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add to wishlist");
        }
    };
    return {
        wishlistItems,
        fetchWishlist,
        handleAddToWishlist,
    }
}