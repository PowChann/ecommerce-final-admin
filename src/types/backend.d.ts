// src/types/backend.d.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  banned: boolean;
  loyaltyPoints: number;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // JSON array of URLs
  brandId: string;
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
  brand?: Brand;
  category?: Category;
  variants?: ProductVariant[];
  productTags?: any[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  quantity: number;
  images?: string[]; // Changed from image?: string to images?: string[]
  attributes: Record<string, any>; // JSON
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  shippingAddress: string | any; // Or specific Address interface
  grandTotal: number;
  createdAt: string;
  updatedAt?: string;
  items?: OrderItem[];
  user?: User;
  
  // Extended fields
  discountId?: string | null;
  discountAmount: number;
  shippingFee: number;
  tax: number;
  subtotal: number;
  pointUsed?: number;
  pointEarned?: number;
  statusHistory?: any[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
  
  // Extended fields
  productName: string;
  unitPrice: number;
  subTotal: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  newUsersThisMonth: number;
}

export interface ChartData {
  label: string;
  revenue: number;
  orders: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  // Add pagination metadata if your backend sends it in a specific envelope
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
