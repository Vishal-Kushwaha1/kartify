export type EmailProps = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type ProductType = {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  stock: number;
  category?: string[] | null;
  image?: string[] | null;
  isActive: boolean;
  sellerId: string;
  discountId?: string | null;
  createdAt: Date;
  updatedAt: Date;
} | undefined

export type CartType = {
  id: string,
  userId: string,
  createdAt: Date;
  updatedAt: Date;
} | undefined

export type CartItemsType = {
  id: string,
  quantity: number,
  price: string,
  cartId:string,
  productId: string,
} | undefined