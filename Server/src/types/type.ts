export type EmailProps = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type ProductType =
  | {
      id: string;
      name: string;
      description?: string | null;
      price: number;
      stock: number;
      category?: string[] | null;
      image?: string[] | null;
      isActive: boolean;
      sellerId: string;
      createdAt: Date;
      updatedAt: Date;
    }
  | undefined;

export type CartType =
  | {
      id: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }
  | undefined;
