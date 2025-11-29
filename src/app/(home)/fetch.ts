export async function getOverviewData() {
  // Mock data for UI development without backend
  // Simulate a slight delay to test suspense states if needed, or return immediately
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    revenue: {
      value: 12000,
      growthRate: 12.5,
    },
    totalUsers: {
      value: 450,
      growthRate: 5.2,
    },
    newUsers: {
      value: 30,
      growthRate: 8.1,
    },
    totalOrders: {
      value: 150,
      growthRate: 7.0,
    },
    topSellingProduct: {
      name: "Smart Watch X",
      value: 120, // number of units sold
      growthRate: 15.0,
    },
  };
}

export async function getRecentOrdersData() {
  // Mock data for recent orders
  return [
    {
      orderId: "ORD001",
      customerName: "John Doe",
      totalAmount: 120.50,
      status: "Pending",
      orderDate: "2025-11-28T10:00:00Z",
    },
    {
      orderId: "ORD002",
      customerName: "Jane Smith",
      totalAmount: 245.00,
      status: "Completed",
      orderDate: "2025-11-27T14:30:00Z",
    },
    {
      orderId: "ORD003",
      customerName: "Peter Jones",
      totalAmount: 75.99,
      status: "Processing",
      orderDate: "2025-11-27T11:15:00Z",
    },
    {
      orderId: "ORD004",
      customerName: "Alice Brown",
      totalAmount: 300.00,
      status: "Completed",
      orderDate: "2025-11-26T09:00:00Z",
    },
    {
      orderId: "ORD005",
      customerName: "Bob White",
      totalAmount: 50.25,
      status: "Cancelled",
      orderDate: "2025-11-25T16:45:00Z",
    },
  ];
}

export async function getLowStockProductsData() {
  // Mock data for low stock products
  return [
    {
      id: "PROD001",
      name: "Smart Watch X",
      category: "Electronics",
      price: 199.99,
      stock: 5,
      image: "/images/product/product-01.png", // Placeholder image path
    },
    {
      id: "PROD002",
      name: "Wireless Earbuds Pro",
      category: "Audio",
      price: 89.00,
      stock: 3,
      image: "/images/product/product-02.png", // Placeholder image path
    },
    {
      id: "PROD003",
      name: "Portable Charger 10000mAh",
      category: "Accessories",
      price: 35.50,
      stock: 7,
      image: "/images/product/product-03.png", // Placeholder image path
    },
  ];
}