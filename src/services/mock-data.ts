import { Product, User, Order, Category, Brand, DashboardStats, ChartData } from "@/types/backend";

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Alice Admin", email: "alice@example.com", role: "admin", banned: false, loyaltyPoints: 100, createdAt: "2023-01-01T10:00:00Z" },
  { id: "u2", name: "Bob Buyer", email: "bob@example.com", role: "user", banned: false, loyaltyPoints: 50, createdAt: "2023-01-02T11:00:00Z" },
  { id: "u3", name: "Charlie Customer", email: "charlie@example.com", role: "user", banned: false, loyaltyPoints: 20, createdAt: "2023-01-03T12:00:00Z" },
  { id: "u4", name: "Dave Deleter", email: "dave@example.com", role: "user", banned: true, loyaltyPoints: 0, createdAt: "2023-01-04T13:00:00Z" },
  { id: "u5", name: "Eve Explorer", email: "eve@example.com", role: "user", banned: false, loyaltyPoints: 150, createdAt: "2023-01-05T14:00:00Z" },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Electronics" },
  { id: "c2", name: "Fashion" },
  { id: "c3", name: "Home & Garden" },
  { id: "c4", name: "Sports" },
];

export const MOCK_BRANDS: Brand[] = [
  { id: "b1", name: "TechGiant" },
  { id: "b2", name: "StyleCo" },
  { id: "b3", name: "HomeBasics" },
  { id: "b4", name: "FitGear" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Smartphone X",
    description: "Latest model smartphone",
    price: 999,
    images: [],
    brandId: "b1",
    categoryId: "c1",
    createdAt: "2023-02-01T10:00:00Z",
    brand: MOCK_BRANDS[0],
    category: MOCK_CATEGORIES[0],
  },
  {
    id: "p2",
    name: "Designer Jeans",
    description: "Blue denim jeans",
    price: 89,
    images: [],
    brandId: "b2",
    categoryId: "c2",
    createdAt: "2023-02-02T11:00:00Z",
    brand: MOCK_BRANDS[1],
    category: MOCK_CATEGORIES[1],
  },
  {
    id: "p3",
    name: "Laptop Pro",
    description: "High performance laptop",
    price: 1499,
    images: [],
    brandId: "b1",
    categoryId: "c1",
    createdAt: "2023-02-03T12:00:00Z",
    brand: MOCK_BRANDS[0],
    category: MOCK_CATEGORIES[0],
  },
  {
    id: "p4",
    name: "Coffee Maker",
    description: "Automatic coffee maker",
    price: 129,
    images: [],
    brandId: "b3",
    categoryId: "c3",
    createdAt: "2023-02-04T13:00:00Z",
    brand: MOCK_BRANDS[2],
    category: MOCK_CATEGORIES[2],
  },
  {
    id: "p5",
    name: "Running Shoes",
    description: "Comfortable running shoes",
    price: 110,
    images: [],
    brandId: "b4",
    categoryId: "c4",
    createdAt: "2023-02-05T14:00:00Z",
    brand: MOCK_BRANDS[3],
    category: MOCK_CATEGORIES[3],
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    userId: "u2",
    status: "completed",
    shippingAddress: "123 Main St",
    grandTotal: 999,
    createdAt: "2023-03-01T10:00:00Z",
    user: MOCK_USERS[1],
    items: [
      { id: "oi1", orderId: "o1", productId: "p1", quantity: 1, price: 999, product: MOCK_PRODUCTS[0] }
    ]
  },
  {
    id: "o2",
    userId: "u3",
    status: "pending",
    shippingAddress: "456 Elm St",
    grandTotal: 89,
    createdAt: "2023-03-02T11:00:00Z",
    user: MOCK_USERS[2],
    items: [
      { id: "oi2", orderId: "o2", productId: "p2", quantity: 1, price: 89, product: MOCK_PRODUCTS[1] }
    ]
  },
  {
    id: "o3",
    userId: "u5",
    status: "shipped",
    shippingAddress: "789 Oak St",
    grandTotal: 1609,
    createdAt: "2023-03-03T12:00:00Z",
    user: MOCK_USERS[4],
    items: [
      { id: "oi3", orderId: "o3", productId: "p3", quantity: 1, price: 1499, product: MOCK_PRODUCTS[2] },
      { id: "oi4", orderId: "o3", productId: "p5", quantity: 1, price: 110, product: MOCK_PRODUCTS[4] }
    ]
  },
];

export const MOCK_DISCOUNTS = [
    { id: "d1", code: "SUMMER20", type: "percentage", value: 20, startsAt: "2023-06-01", endsAt: "2023-08-31" },
    { id: "d2", code: "WELCOME10", type: "percentage", value: 10, startsAt: "2023-01-01", endsAt: null },
];

export const MOCK_TAGS = [
    { id: "t1", name: "New Arrival" },
    { id: "t2", name: "Best Seller" },
    { id: "t3", name: "Sale" },
];

export const MOCK_STATS: DashboardStats = {
  totalRevenue: 54321,
  totalOrders: 1234,
  totalUsers: 567,
  newUsersThisMonth: 45,
};

export const MOCK_CHART_DATA: ChartData[] = [
  { label: "Mon", revenue: 1000, orders: 10 },
  { label: "Tue", revenue: 1500, orders: 15 },
  { label: "Wed", revenue: 1200, orders: 12 },
  { label: "Thu", revenue: 1800, orders: 18 },
  { label: "Fri", revenue: 2000, orders: 20 },
  { label: "Sat", revenue: 2500, orders: 25 },
  { label: "Sun", revenue: 2200, orders: 22 },
];
