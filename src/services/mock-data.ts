import { Product, User, Order, Category, Brand, DashboardStats, ChartData, ProductVariant } from "@/types/backend";

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

export const MOCK_PRODUCT_VARIANTS: ProductVariant[] = [
    {
        id: "pv1",
        productId: "p1",
        sku: "SMARTPHONEX-BLU-64GB",
        price: 999,
        quantity: 100,
        images: ["/images/placeholder.svg"],
        attributes: { color: "Blue", storage: "64GB" },
        createdAt: "2023-02-01T10:00:00Z",
        updatedAt: "2023-02-01T10:00:00Z",
    },
    {
        id: "pv2",
        productId: "p1",
        sku: "SMARTPHONEX-BLK-128GB",
        price: 1099,
        quantity: 50,
        images: ["/images/placeholder.svg"],
        attributes: { color: "Black", storage: "128GB" },
        createdAt: "2023-02-01T10:00:00Z",
        updatedAt: "2023-02-01T10:00:00Z",
    },
];

export const MOCK_PRODUCT_DETAILS: Product = {
    id: "p1",
    name: "Smartphone X",
    description: "This is the latest model smartphone with cutting-edge features. It boasts a powerful processor, stunning display, and an advanced camera system. Available in multiple colors and storage options.",
    price: 999,
    images: [
        "/images/placeholder.svg",
        "/images/placeholder.svg",
    ],
    brandId: MOCK_BRANDS[0].id,
    categoryId: MOCK_CATEGORIES[0].id,
    createdAt: "2023-02-01T10:00:00Z",
    updatedAt: "2023-02-01T10:00:00Z",
    brand: MOCK_BRANDS[0],
    category: MOCK_CATEGORIES[0],
    variants: MOCK_PRODUCT_VARIANTS,
    productTags: [ // Example tags
      { productId: "p1", tagId: "t1", createdAt: "2023-01-01T10:00:00Z", tag: { id: "t1", name: "New Arrival", createdAt: "2023-01-01T10:00:00Z", updatedAt: "2023-01-01T10:00:00Z" } },
    ]
};

export const MOCK_ORDER_DETAILS: Order = {
  id: "o1",
  userId: "u2",
  user: { id: "u2", email: "bob@example.com", name: "Bob Buyer", role: "user", banned: false, loyaltyPoints: 50 },
  status: "confirmed", // Example: Start as confirmed
  shippingAddress: {
    fullName: "Bob Buyer",
    phone: "123-456-7890",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "Anytown",
    state: "CA",
    ward: "Central Ward",
    cityCode: "123",
    wardCode: "456",
    postalCode: "90210",
    country: "USA",
  },
  discountAmount: 100000,
  shippingFee: 50000,
  tax: 80000,
  subtotal: 1000000,
  grandTotal: 1230000, // Adjusted to match calculations
  pointUsed: 50,
  pointEarned: 100,
  
  // New fields
  paymentMethod: "COD", // If we still need this field
  paymentStatus: "unpaid", // If we still need this field
  couponCode: "SUMMER20", // If we still need this field

  discount: {
    id: "d1",
    code: "SUMMER20",
    value: 100000, // Fixed amount
    type: "fixed",
    usageLimit: 100,
    timesUsed: 10,
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
  },
  payment: {
    id: "pay1",
    method: "COD",
    status: "pending",
    amount: 1230000,
    createdAt: "2023-03-01T10:00:00Z",
    updatedAt: "2023-03-01T10:00:00Z",
  },

  createdAt: "2023-03-01T10:00:00Z",
  updatedAt: "2023-03-01T10:00:00Z",
  items: [
    { 
      id: "oi1", orderId: "o1", productId: MOCK_PRODUCT_DETAILS.id, productName: MOCK_PRODUCT_DETAILS.name, quantity: 1, price: 999000, unitPrice: 999000, subTotal: 999000,
      createdAt: "2023-03-01T10:00:00Z", updatedAt: "2023-03-01T10:00:00Z",
      product: MOCK_PRODUCT_DETAILS
    }
  ],
  statusHistory: [
    { id: "osh1", orderId: "o1", status: "pending", createdAt: "2023-03-01T10:00:00Z" },
    { id: "osh2", orderId: "o1", status: "confirmed", createdAt: "2023-03-01T10:05:00Z", updatedBy: "admin_id_1", updatedByUser: { id: "admin_id_1", name: "Admin One", email: "admin1@example.com" } },
    { id: "osh3", orderId: "o1", status: "shipping", createdAt: "2023-03-01T11:00:00Z" },
  ],
};


export const MOCK_PRODUCTS: Product[] = [
  MOCK_PRODUCT_DETAILS, // Include the detailed product here
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
  MOCK_ORDER_DETAILS, // Include the detailed order here
  {
    id: "o2",
    userId: "u3",
    user: MOCK_USERS[2], // Populated user info
    status: "delivered", // Example status
    shippingAddress: {
      fullName: "Charlie Customer",
      phone: "0987654321",
      addressLine1: "456 Oak Avenue",
      city: "Hanoi",
      country: "Vietnam",
    },
    grandTotal: 890000,
    subtotal: 890000,
    tax: 0,
    shippingFee: 0,
    discountAmount: 0,
    paymentMethod: "COD",
    paymentStatus: "paid",
    couponCode: undefined,
    createdAt: "2023-03-02T11:00:00Z",
    updatedAt: "2023-03-02T12:00:00Z",
    items: [
      { id: "oi2", orderId: "o2", productId: "p2", quantity: 1, price: 890000, productName: "Designer Jeans", unitPrice: 890000, subTotal: 890000, product: MOCK_PRODUCTS[1] }
    ],
    statusHistory: [
      { id: "osh4", orderId: "o2", status: "pending", createdAt: "2023-03-02T11:00:00Z" },
      { id: "osh5", orderId: "o2", status: "confirmed", createdAt: "2023-03-02T11:10:00Z" },
      { id: "osh6", orderId: "o2", status: "delivered", createdAt: "2023-03-02T12:00:00Z" },
    ],
  },
  {
    id: "o3",
    userId: "u5",
    user: MOCK_USERS[4], // Populated user info
    status: "shipping", // Example status
    shippingAddress: {
      fullName: "Eve Explorer",
      phone: "0123456789",
      addressLine1: "789 Pine Street",
      city: "Danang",
      country: "Vietnam",
    },
    grandTotal: 1609000,
    subtotal: 1609000,
    tax: 0,
    shippingFee: 0,
    discountAmount: 0,
    paymentMethod: "Online Banking",
    paymentStatus: "paid",
    couponCode: "WELCOME10",
    createdAt: "2023-03-03T12:00:00Z",
    updatedAt: "2023-03-03T13:00:00Z",
    items: [
      { id: "oi3", orderId: "o3", productId: "p3", quantity: 1, price: 1499000, productName: "Laptop Pro", unitPrice: 1499000, subTotal: 1499000, product: MOCK_PRODUCTS[2] },
      { id: "oi4", orderId: "o3", productId: "p5", quantity: 1, price: 110000, productName: "Running Shoes", unitPrice: 110000, subTotal: 110000, product: MOCK_PRODUCTS[4] }
    ],
    statusHistory: [
      { id: "osh7", orderId: "o3", status: "pending", createdAt: "2023-03-03T12:00:00Z" },
      { id: "osh8", orderId: "o3", status: "confirmed", createdAt: "2023-03-03T12:05:00Z" },
      { id: "osh9", orderId: "o3", status: "shipping", createdAt: "2023-03-03T13:00:00Z" },
    ],
  },
];

export const MOCK_DISCOUNTS = [
    { id: "d1", code: "SUMMER20", value: 20, usageLimit: 100, timesUsed: 10, createdAt: "2023-06-01T10:00:00Z", updatedAt: "2023-06-01T10:00:00Z" },
    { id: "d2", code: "WELCOME10", value: 10, usageLimit: 50, timesUsed: 5, createdAt: "2023-01-01T10:00:00Z", updatedAt: "2023-01-01T10:00:00Z" },
];

export const MOCK_TAGS = [
    { id: "t1", name: "New Arrival", createdAt: "2023-01-01T10:00:00Z", updatedAt: "2023-01-01T10:00:00Z" },
    { id: "t2", name: "Best Seller", createdAt: "2023-01-01T10:00:00Z", updatedAt: "2023-01-01T10:00:00Z" },
    { id: "t3", name: "Sale", createdAt: "2023-01-01T10:00:00Z", updatedAt: "2023-01-01T10:00:00Z" },
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
