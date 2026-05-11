import {useDispatch, useSelector} from "react-redux";
import {
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    fetchCartItem
} from "@/redux/cart/cartThunk";
import type {AppDispatch, RootState} from "@/redux/store";
import type {CartItem, Product} from "@/types/type";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";

import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag
} from "lucide-react";
import {LoadingPage} from "@/components/LoadingPage.tsx";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

interface CartData {
    cart_item: CartItem;
    product: Product;
}

export const Cart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    ;

    const {cart, loading, error} = useSelector(
        (state: RootState) => state.cart
    );

    const isInitalLoading = loading && !cart

    const handleAddToCart = async (productId: string) => {
        try {
            setActionLoading(true);
            await dispatch(addToCart(productId)).unwrap();
            await dispatch(fetchCartItem()).unwrap();
            toast.success("Item added to cart")
        } catch (error) {
            toast.error("Failed to add item");
        } finally {
            setActionLoading(false);
        }

    };
    const handleRemoveItem = async (cartItemId: string) => {
        try {
            setActionLoading(true);
            await dispatch(removeFromCart(cartItemId)).unwrap();
            await dispatch(fetchCartItem()).unwrap();
            toast.success("Item removed from cart")
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setActionLoading(false);
        }
    };
    const handleUpdateQuantity = async (
        cartItemId: string,
        quantity: number
    ) => {
        try {
            setActionLoading(true);
            if (quantity < 1) {
                await dispatch(removeFromCart(cartItemId)).unwrap();
                await dispatch(fetchCartItem()).unwrap();
                toast.success("Item removed from cart")
                return;
            }
            await dispatch(updateCartItem({productId: cartItemId, quantity})).unwrap();
            await dispatch(fetchCartItem()).unwrap();
            toast.success("Cart updated")
        } catch (error) {
            toast.error("Failed to update cart");
        } finally {
            setActionLoading(false);
        }

    };
    const handleClearCart = async () => {
        try {
            setActionLoading(true);
            await dispatch(clearCart()).unwrap();
            await dispatch(fetchCartItem()).unwrap();
            toast.success("Cart cleared")
        } catch (error) {
            toast.error("Failed to update cart");
        } finally {
            setActionLoading(false);
        }
    };

    const rawSubTotal: number =
        cart?.reduce((acc: number, cur: CartData) => {
            return (acc + Number(cur.cart_item.quantity) * Number(cur.cart_item.price))
        }, 0) || 0;

    const subTotal = Number(rawSubTotal.toFixed(2))
    const deliveryFee = Number(subTotal > 400 ? 0 : 60);
    const gst = Number((subTotal * 0.18).toFixed(2));
    const total = Number((subTotal + gst + deliveryFee).toFixed(2));

    if (isInitalLoading) {
        return (
            <LoadingPage/>
        );
    }

    if (error) { // TODO: navigate to product page
        return (
            <div className="min-h-screen bg-muted/40 px-6 py-10">
                <div className="mx-auto max-w-6xl">
                    <Card className="rounded-xl border bg-background p-6">
                        <p className="text-sm text-muted-foreground">
                            Error: {error}
                        </p>
                    </Card>
                </div>
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen bg-muted/40 px-6 py-10">
                <div className="mx-auto flex max-w-6xl items-center justify-center">
                    <Card
                        className="flex w-full max-w-md flex-col items-center rounded-xl border bg-background p-10 text-center">
                        <div
                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border bg-muted/50">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground"/>
                        </div>

                        <h2 className="text-2xl font-medium tracking-tight text-foreground">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Add products to continue shopping.
                        </p>

                        <Button
                            className="mt-6 bg-orange-600 text-white hover:bg-orange-700"
                            onClick={() => navigate("/products")}
                        >
                            Continue Shopping
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/40 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Shopping Cart
                        </p>

                        <h1 className="text-2xl font-medium tracking-tight text-foreground">
                            Your Cart
                        </h1>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleClearCart}
                        className="w-full md:w-auto"
                        disabled={actionLoading}
                    >
                        Clear Cart
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-4">
                        {cart.map((item: CartData) => (
                            <Card
                                key={
                                    item.product.id || item.cart_item.cartId
                                }
                                className="rounded-xl border bg-background p-6"
                            >
                                <div className="flex flex-col gap-6 sm:flex-row">
                                    <div className="shrink-0">
                                        <Avatar className="h-28 w-28 rounded-xl border">
                                            <AvatarImage
                                                src={item.product.image?.[0]}
                                                alt={item.product.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="rounded-xl">
                                                IMG
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-5">
                                        <div
                                            className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-2">
                                                <Badge
                                                    variant="outline"
                                                    className="w-fit"
                                                >
                                                    Product
                                                </Badge>

                                                <h3 className="text-xl font-medium tracking-tight text-foreground">
                                                    {item.product.name}
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    Premium quality product with
                                                    fast delivery.
                                                </p>
                                            </div>

                                            <div className="text-left md:text-right">
                                                <p className="text-xs text-muted-foreground">
                                                    Price
                                                </p>

                                                <p className="text-lg font-medium text-foreground">
                                                    ₹{item.product.price}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center rounded-lg border bg-background">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-10 w-10 rounded-r-none"
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                item.product.id ||
                                                                item.cart_item.productId
                                                            )
                                                        }
                                                        disabled={actionLoading}
                                                    >
                                                        <Minus className="h-4 w-4"/>
                                                    </Button>

                                                    <Input
                                                        key={`qty-${item.cart_item.productId}-${item.cart_item.quantity}`}
                                                        type="number"
                                                        min={1}
                                                        max={100}
                                                        defaultValue={item.cart_item.quantity}
                                                        onBlur={(e) => {
                                                            const value = Number(e.target.value);
                                                            handleUpdateQuantity(item.product.id || item.cart_item.productId, value)
                                                        }}
                                                        disabled={actionLoading}
                                                        className="h-10 w-14 border-0 bg-transparent text-center text-sm focus-visible:ring-0"
                                                    />

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-10 w-10 rounded-l-none"
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                item.product.id ||
                                                                item.cart_item.productId
                                                            )
                                                        }
                                                        disabled={actionLoading}
                                                    >
                                                        <Plus className="h-4 w-4"/>
                                                    </Button>
                                                </div>

                                                <p className="text-sm text-muted-foreground">
                                                    Qty
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">
                                                        Total
                                                    </p>

                                                    <p className="text-lg font-medium text-foreground">
                                                        ₹
                                                        {Number(
                                                                item.cart_item.quantity
                                                            ) *
                                                            Number(item.cart_item.price)}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.product.id ||
                                                            item.cart_item.productId
                                                        )
                                                    }
                                                    disabled={actionLoading}
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="h-fit">
                        <Card className="sticky top-10 rounded-xl border bg-background p-6">
                            <div className="mb-6">
                                <p className="text-xs text-muted-foreground">
                                    Order Summary
                                </p>

                                <h2 className="text-xl font-medium tracking-tight text-foreground">
                                    Payment Details
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>
                                    <span className="text-foreground">
                    ₹{subTotal}
                  </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    GST (18%)
                  </span>

                                    <span className="text-foreground">
                    ₹{gst}
                  </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Delivery Fee
                  </span>

                                    <span className="text-foreground">
                    ₹{deliveryFee}
                  </span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total
                    </span>

                                        <span className="text-2xl font-medium tracking-tight text-foreground">
                      ₹{total}
                    </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => navigate("/checkout")}
                                    className="mt-4 h-11 w-full bg-orange-600 text-white hover:bg-orange-700">
                                    Proceed to Checkout
                                </Button>

                                <Button
                                    onClick={() => navigate("/products")}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};