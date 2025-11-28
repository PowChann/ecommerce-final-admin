export async function getOverviewData() {
  // Mock data for UI development without backend
  // Simulate a slight delay to test suspense states if needed, or return immediately
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    sales: {
      value: 12000,
      growthRate: 12.5,
    },
    users: {
      value: 450,
      growthRate: 5.2, 
    },
    pendingOrders: {
      value: 25,
      growthRate: -2.1,
    },
    productStock: {
      value: 340, 
      growthRate: 0,
    },
  };
}