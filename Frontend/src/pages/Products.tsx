import type { Product } from "@/types/type";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useGetUserQuery } from "@/redux/user/userApi";
import { useAddToCartMutation } from "@/redux/cart/cartApi";
import {
  useAddItemToWishlistMutation,
  useFetchWishlistQuery,
  useRemoveItemFromWishlistMutation,
} from "@/redux/wishlist/wishlistApi";
import { api } from "@/utils/Axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10);
  const limit = 20;

  const { data: user } = useGetUserQuery();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");

  const [addToCart] = useAddToCartMutation();
  const [removeItemFromWishlist] = useRemoveItemFromWishlistMutation();
  const [addItemToWishlist] = useAddItemToWishlistMutation();
  const { data: wishlistData } = useFetchWishlistQuery();
  const wishlistIds = useMemo(
    () => new Set(wishlistData?.map((item) => item.wishlist.productId) ?? []),
    [wishlistData],
  );

  const fetchProducts = useCallback(
    async (page: number) => {
      try {
        setPageLoading(true);
        const url = query
          ? `/products?search=${query}&page=${page}&limit=${limit}`
          : `/products?page=${page}&limit=${limit}`;
        const response = await api.get(url);
        const data = response?.data?.data ?? response?.data;
        if (data?.products) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch {
        toast.error("Failed to load products");
      } finally {
        setPageLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  useEffect(() => {
    const data = localStorage.getItem("kartify_recommendation");
    if (data) {
      setRecommendations(JSON.parse(data));
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    const cached = localStorage.getItem("kartify_recommendation")
    if(cached){
      const {data, timeStamp} = JSON.parse(cached)
      const oneHour = 60*60*1000
      if(Date.now()-timeStamp < oneHour){
        setRecommendations(JSON.parse(data))
      }
      return
    }
    try {
      const response = await api.get(`/recommendation`, {
        withCredentials: true,
      });
      const data = response?.data?.data ?? response?.data;
      if (Array.isArray(data)) {
        setRecommendations(data);
        localStorage.setItem("kartify_recommendation", JSON.stringify({data, timeStamp: Date.now()}))
      }
    } catch (error) {
      console.error("Recommendation error", error);
    }
  },[])

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, fetchRecommendations]);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent, productId: string) => {
      e.stopPropagation();
      try {
        setActionLoading(productId);
        await addToCart(productId);
        toast.success("Item added to cart");
      } catch (error) {
        toast.error("Failed to add item");
      } finally {
        setActionLoading(null);
      }
    },
    [addToCart],
  );

  const handleWishlistToggle = useCallback(
    async (e: React.MouseEvent, productId: string) => {
      e.stopPropagation();
      try {
        if (wishlistIds.has(productId)) {
          await removeItemFromWishlist(productId);
          toast.success("Removed from Wishlist");
        } else {
          await addItemToWishlist(productId);
          toast.success("Item added to wishlist");
        }
      } catch (error) {
        toast.error("Wishlist error");
      }
    },
    [wishlistIds, removeItemFromWishlist, addItemToWishlist],
  );

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Page Header */}
      <div className="bg-background border-b border-border/50 px-6 py-12 mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 flex items-center justify-center gap-2">
          Explore Products <Sparkles className="h-6 w-6 text-primary" />
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our curated collection of premium products, designed to
          elevate your everyday lifestyle.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        {!query && recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Sparkles className="h-6 w-6 text-primary" /> Recommended for You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recommendations.map((item) => (
                <ProductCard
                  key={`reco-${item.id}`}
                  item={item}
                  wishlistIds={wishlistIds}
                  actionLoading={actionLoading}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            All Products
          </h2>
        )}

        {pageLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col gap-4">
                <div className="h-64 w-full rounded-2xl bg-muted/50 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-muted/50 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-full bg-muted/50 rounded-full animate-pulse mt-4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-background rounded-3xl border border-dashed border-border">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">
              Check back later for new arrivals.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
              {products.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  wishlistIds={wishlistIds}
                  actionLoading={actionLoading}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  navigate={navigate}
                />
              ))}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(1)}
                    isActive={currentPage === 1}
                    className="cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => page !== 1 && page !== totalPages)
                  .filter((page) => Math.abs(page - currentPage) <= 1)
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(totalPages)}
                      isActive={currentPage === totalPages}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
};
export default Products;
