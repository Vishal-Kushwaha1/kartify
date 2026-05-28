import {addToCart} from "@/redux/cart/cartThunk";
import type {AppDispatch} from "@/redux/store";
import type {Product, WishlistItem} from "@/types/type";
import {api} from "@/utils/Axios";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Heart, ShoppingCart, Loader2, Sparkles} from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {useNavigate} from "react-router-dom";


export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(10);
    const limit = 20;
    const fetchProducts = async (page: number) => {
        try {
            setPageLoading(true);
            const response = await api.get(`/products?page=${page}&limit=${limit}`);
            const data = response?.data?.data ?? response?.data
            if (data && data.products) {
                setProducts(data.products);
                setTotalPages(data.totalPages)
            } else if (Array.isArray(data)) {
                setProducts(data)
            }
        } catch {
            toast.error("Failed to load products");
        } finally {
            setPageLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await api.get("/wishlist", {withCredentials: true});
                const wishlistData: WishlistItem[] = response?.data?.data ?? [];
                const ids = wishlistData.map((item) => item.wishlist.productId);
                setWishlistIds(new Set(ids));
            } catch (error) {
                console.error("Fetching wishlist error", error);
            }
        };
        fetchWishlist();
    }, []);
    const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        try {
            setActionLoading(productId);
            await dispatch(addToCart(productId)).unwrap();
            toast.success("Item added to cart");
        } catch (error) {
            toast.error("Failed to add item");
        } finally {
            setActionLoading(null);
        }
    };
    const handleWishlistToggle = async (
        e: React.MouseEvent,
        productId: string,
    ) => {
        e.stopPropagation();
        try {
            if (wishlistIds.has(productId)) {
                await api.delete(`/wishlist/${productId}`, {withCredentials: true});
                setWishlistIds((prev) => {
                    const updated = new Set(prev);
                    updated.delete(productId);
                    return updated;
                });
                toast.success("Removed from Wishlist");
            } else {
                await api.post("/wishlist", {productId}, {withCredentials: true});
                setWishlistIds((prev) => new Set(prev).add(productId));
                toast.success("Item added to wishlist");
            }
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Wishlist error");
        }
    };
    const getImages = (item: Product) => {
        if (Array.isArray(item.image) && item.image.length > 0) {
            return item.image;
        }
        if (typeof item.image === "string" && item.image) {
            return [item.image];
        }
        return [];
    };
    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            {/* Page Header */}
            <div className="bg-background border-b border-border/50 px-6 py-12 mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 flex items-center justify-center gap-2">
                    Explore Products <Sparkles className="h-6 w-6 text-primary"/>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Discover our curated collection of premium products, designed to elevate your everyday lifestyle.
                </p>
            </div>
            <div className="max-w-7xl mx-auto px-6">
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
                    <div
                        className="flex flex-col items-center justify-center py-32 text-center bg-background rounded-3xl border border-dashed border-border">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4 opacity-50"/>
                        <h2 className="text-2xl font-semibold mb-2">No products found</h2>
                        <p className="text-muted-foreground">Check back later for new arrivals.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
                            {products.map((item) => {
                                const images = getImages(item);
                                const inStock = item.stock !== undefined ? item.stock > 0 : true;
                                return (
                                    <Card
                                        key={item.id}
                                        onClick={() => navigate(`/products/${item.id}`)}
                                        className="group flex flex-col border-none bg-background shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer"
                                    >
                                        {/* Image Container */}
                                        <div className="relative w-full h-64 bg-muted/30 overflow-hidden">
                                            {images.length > 0 ? (
                                                <Carousel className="w-full h-full" opts={{loop: true}}>
                                                    <CarouselContent>
                                                        {images.map((img, idx) => (
                                                            <CarouselItem key={idx}>
                                                                <div
                                                                    className="w-full h-64 flex items-center justify-center">
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
                                                        <div
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <CarouselPrevious
                                                                className="left-2 bg-background/50 backdrop-blur border-none hover:bg-background h-8 w-8"/>
                                                            <CarouselNext
                                                                className="right-2 bg-background/50 backdrop-blur border-none hover:bg-background h-8 w-8"/>
                                                        </div>
                                                    )}
                                                </Carousel>
                                            ) : (
                                                <div
                                                    className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                                    No image available
                                                </div>
                                            )}
                                            {/* Floating Wishlist Button */}
                                            <button
                                                onClick={(e) => handleWishlistToggle(e, item.id)}
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
                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                                                {!inStock && (
                                                    <Badge variant="destructive"
                                                           className="shadow-sm font-semibold text-[10px] uppercase tracking-wider">
                                                        Sold Out
                                                    </Badge>
                                                )}
                                                {item.stock !== undefined && inStock && item.stock < 10 && (
                                                    <Badge
                                                        className="bg-amber-500 text-white shadow-sm font-semibold text-[10px] uppercase tracking-wider hover:bg-amber-600">
                                                        Low Stock
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {/* Content Container */}
                                        <div className="flex flex-col flex-1 p-5">
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {item.category?.map((cat) => (
                                                    <span key={cat}
                                                          className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
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
                                            <div
                                                className="flex items-end justify-between mt-auto pt-4 border-t border-border/50">
                                                <div className="flex flex-col">
                                                    <span
                                                        className="text-xs text-muted-foreground font-medium mb-0.5">Price</span>
                                                    <span className="text-xl font-bold text-foreground tracking-tight">
                            ₹{item.price?.toLocaleString("en-IN") ?? "0"}
                          </span>
                                                </div>
                                                <Button
                                                    onClick={(e) => handleAddToCart(e, item.id)}
                                                    disabled={actionLoading === item.id || !inStock}
                                                    size="icon"
                                                    className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all group-hover:scale-110"
                                                >
                                                    {actionLoading === item.id ? (
                                                        <Loader2
                                                            className="h-4 w-4 animate-spin text-primary-foreground"/>
                                                    ) : (
                                                        <ShoppingCart className="h-4 w-4 text-primary-foreground"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
