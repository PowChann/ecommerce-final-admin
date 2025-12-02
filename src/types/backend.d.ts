// src/types/backend.d.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'seller'; // Updated based on UserEditModal and common roles
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
  productTags?: any[]; // Consider defining a specific interface for ProductTag if possible
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

export interface OrderStatusHistory {
  id?: string; // Optional if not always provided by backend
  orderId: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedBy?: string; // userId of admin who performed the action
  updatedByUser?: { // Populate basic user info of who updated
    id: string;
    name: string;
    email: string;
  }
}

// ...

export interface Order {
  id: string;
  userId: string;
  user?: User; // Populate basic user info in list, full in detail
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  shippingAddress: Address; // Changed to Address interface
  grandTotal: number;
  createdAt: string;
  updatedAt?: string;
  items?: OrderItem[];
  
  // Extended fields for details
  discountId?: string | null;
  discount?: DiscountDetail; // Populate discount details
  discountAmount: number;
  shippingFee: number;
  tax: number;
  subtotal: number;
  pointUsed?: number;
  pointEarned?: number;
  statusHistory?: OrderStatusHistory[]; // Changed to specific OrderStatusHistory interface

  paymentMethod?: string; // Redundant if payment object is present, but kept for simplicity
  paymentStatus?: "paid" | "unpaid"; // Redundant if payment object is present, but kept for simplicity
  payment?: PaymentDetail; // Populate payment details
  couponCode?: string; // Redundant if discount object is present, can be discount.code
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number; // Unit price
  product?: Product;
  
  // Extended fields
  productName: string;
  unitPrice: number; // Keep unitPrice for clarity with price
  subTotal: number; // Quantity * UnitPrice
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

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  // Add pagination metadata if your backend sends it in a specific envelope
  pagination?: Pagination;
}