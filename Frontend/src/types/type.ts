export type UserRoleEnum = "user" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  phone?: string | null;
  role: UserRoleEnum;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type businessTypeEnum =
  | "Individual"
  | "Sole_proprietor"
  | "Pvt_ltd"
  | "Partnership";

export interface Seller {
  id: string;
  storeName: string;
  storeDescription?: string | null;
  storeLocation?: string | null;
  isActive: boolean;
  isVerified: boolean;
  panNumber: string;
  aadharNumber: string;
  gstNumber: string;
  gstCertificate: string;
  shopImage: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerDocument {
  id: string;
  sellerId: string;
  panNumber: string;
  aadharNumber: string;
  gstNumber: string;
  gstCertificate: string;
  shopImage: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string[] | null;
  image?: string[] | null;
  isActive: boolean;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderEnum =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentEnum = "COD" | "STRIPE" | "RAZORPAY";

export interface Order {
  id: string;
  status: OrderEnum;
  totalAmount: number;
  addressId: string;
  userId: string;
  discountId?: string | null;
  paymentMethod: PaymentEnum;
  paymentId?: string | null;
  shipmentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
}

export interface Cart {
  id: string;
  userId: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  cartId: string;
  productId: string;
}

export interface CartData {
  cart_item: CartItem;
  product: Product;
}

export interface Address {
  id: string;
  name: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DiscountTypeEnum = "percentage" | "flat";

export interface Discount {
  id: string;
  code: string;
  description?: string | null;
  discountType: DiscountTypeEnum;
  value: number;
  minOrderAmount: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export type PaymentProviderEnum = "razorpay" | "stripe" | "cash";
export type PaymentStatusEnum =
  | "pending"
  | "success"
  | "failed"
  | "cancelled"
  | "refunded";

export interface Payment {
  id: string;
  provider: PaymentProviderEnum;
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatusEnum;
  orderId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ShipmentStatusEnum =
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatusEnum;
  orderId: string;
  createdAt: Date;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
}

export interface Wishlist {
  id: string;
  productId: string;
  userId: string;
}

export interface WishlistItem {
  wishlist: {
    productId: string;
  };
}
