export async function getUsersChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      totalUsers: [
        { x: 2020, y: 150 },
        { x: 2021, y: 220 },
        { x: 2022, y: 380 },
        { x: 2023, y: 520 },
        { x: 2024, y: 780 },
      ],
      newUsers: [
        { x: 2020, y: 50 },
        { x: 2021, y: 70 },
        { x: 2022, y: 160 },
        { x: 2023, y: 140 },
        { x: 2024, y: 260 },
      ],
    };
  }

  return {
    totalUsers: [
      { x: "Jan", y: 100 },
      { x: "Feb", y: 120 },
      { x: "Mar", y: 155 },
      { x: "Apr", y: 180 },
      { x: "May", y: 210 },
      { x: "Jun", y: 240 },
      { x: "Jul", y: 280 },
      { x: "Aug", y: 320 },
      { x: "Sep", y: 360 },
      { x: "Oct", y: 400 },
      { x: "Nov", y: 450 },
      { x: "Dec", y: 500 },
    ],
    newUsers: [
      { x: "Jan", y: 10 },
      { x: "Feb", y: 15 },
      { x: "Mar", y: 20 },
      { x: "Apr", y: 25 },
      { x: "May", y: 30 },
      { x: "Jun", y: 20 },
      { x: "Jul", y: 40 },
      { x: "Aug", y: 35 },
      { x: "Sep", y: 40 },
      { x: "Oct", y: 50 },
      { x: "Nov", y: 55 },
      { x: "Dec", y: 60 },
    ],
  };
}

export async function getOrdersChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      totalOrders: [
        { x: 2020, y: 500 },
        { x: 2021, y: 650 },
        { x: 2022, y: 800 },
        { x: 2023, y: 950 },
        { x: 2024, y: 1100 },
      ],
      newOrders: [
        { x: 2020, y: 100 },
        { x: 2021, y: 150 },
        { x: 2022, y: 200 },
        { x: 2023, y: 250 },
        { x: 2024, y: 300 },
      ],
      productsSold: [
        { x: 2020, y: 800 },
        { x: 2021, y: 1000 },
        { x: 2022, y: 1200 },
        { x: 2023, y: 1500 },
        { x: 2024, y: 1800 },
      ],
    };
  }

  return {
    totalOrders: [
      { x: "Jan", y: 50 },
      { x: "Feb", y: 60 },
      { x: "Mar", y: 70 },
      { x: "Apr", y: 80 },
      { x: "May", y: 90 },
      { x: "Jun", y: 100 },
      { x: "Jul", y: 110 },
      { x: "Aug", y: 120 },
      { x: "Sep", y: 130 },
      { x: "Oct", y: 140 },
      { x: "Nov", y: 150 },
      { x: "Dec", y: 160 },
    ],
    newOrders: [
      { x: "Jan", y: 10 },
      { x: "Feb", y: 12 },
      { x: "Mar", y: 15 },
      { x: "Apr", y: 18 },
      { x: "May", y: 20 },
      { x: "Jun", y: 22 },
      { x: "Jul", y: 25 },
      { x: "Aug", y: 28 },
      { x: "Sep", y: 30 },
      { x: "Oct", y: 32 },
      { x: "Nov", y: 35 },
      { x: "Dec", y: 38 },
    ],
    productsSold: [
      { x: "Jan", y: 80 },
      { x: "Feb", y: 90 },
      { x: "Mar", y: 100 },
      { x: "Apr", y: 110 },
      { x: "May", y: 120 },
      { x: "Jun", y: 130 },
      { x: "Jul", y: 140 },
      { x: "Aug", y: 150 },
      { x: "Sep", y: 160 },
      { x: "Oct", y: 170 },
      { x: "Nov", y: 180 },
      { x: "Dec", y: 190 },
    ],
  };
}

export async function getRevenueChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      revenue: [
        { x: 2020, y: 10000 },
        { x: 2021, y: 15000 },
        { x: 2022, y: 20000 },
        { x: 2023, y: 25000 },
        { x: 2024, y: 30000 },
      ],
    };
  }

  return {
    revenue: [
      { x: "Jan", y: 1000 },
      { x: "Feb", y: 1200 },
      { x: "Mar", y: 1500 },
      { x: "Apr", y: 1800 },
      { x: "May", y: 2000 },
      { x: "Jun", y: 2300 },
      { x: "Jul", y: 2500 },
      { x: "Aug", y: 2800 },
      { x: "Sep", y: 3000 },
      { x: "Oct", y: 3200 },
      { x: "Nov", y: 3500 },
      { x: "Dec", y: 3800 },
    ],
  };
}

export async function getProfitChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      profit: [
        { x: 2020, y: 2000 },
        { x: 2021, y: 3500 },
        { x: 2022, y: 4000 },
        { x: 2023, y: 5500 },
        { x: 2024, y: 6000 },
      ],
    };
  }

  return {
    profit: [
      { x: "Jan", y: 200 },
      { x: "Feb", y: 250 },
      { x: "Mar", y: 300 },
      { x: "Apr", y: 350 },
      { x: "May", y: 400 },
      { x: "Jun", y: 450 },
      { x: "Jul", y: 500 },
      { x: "Aug", y: 550 },
      { x: "Sep", y: 600 },
      { x: "Oct", y: 650 },
      { x: "Nov", y: 700 },
      { x: "Dec", y: 750 },
    ],
  };
}

export async function getProductsSoldByTypeData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      electronics: [
        { x: 2020, y: 120 },
        { x: 2021, y: 180 },
        { x: 2022, y: 250 },
        { x: 2023, y: 300 },
        { x: 2024, y: 400 },
      ],
      clothing: [
        { x: 2020, y: 80 },
        { x: 2021, y: 100 },
        { x: 2022, y: 150 },
        { x: 2023, y: 200 },
        { x: 2024, y: 250 },
      ],
      books: [
        { x: 2020, y: 50 },
        { x: 2021, y: 70 },
        { x: 2022, y: 90 },
        { x: 2023, y: 120 },
        { x: 2024, y: 150 },
      ],
    };
  }

  return {
    electronics: [
      { x: "Jan", y: 10 },
      { x: "Feb", y: 15 },
      { x: "Mar", y: 20 },
      { x: "Apr", y: 25 },
      { x: "May", y: 30 },
      { x: "Jun", y: 35 },
      { x: "Jul", y: 40 },
      { x: "Aug", y: 45 },
      { x: "Sep", y: 50 },
      { x: "Oct", y: 55 },
      { x: "Nov", y: 60 },
      { x: "Dec", y: 65 },
    ],
    clothing: [
      { x: "Jan", y: 5 },
      { x: "Feb", y: 8 },
      { x: "Mar", y: 10 },
      { x: "Apr", y: 12 },
      { x: "May", y: 15 },
      { x: "Jun", y: 18 },
      { x: "Jul", y: 20 },
      { x: "Aug", y: 22 },
      { x: "Sep", y: 25 },
      { x: "Oct", y: 28 },
      { x: "Nov", y: 30 },
      { x: "Dec", y: 32 },
    ],
    books: [
      { x: "Jan", y: 3 },
      { x: "Feb", y: 4 },
      { x: "Mar", y: 5 },
      { x: "Apr", y: 6 },
      { x: "May", y: 7 },
      { x: "Jun", y: 8 },
      { x: "Jul", y: 9 },
      { x: "Aug", y: 10 },
      { x: "Sep", y: 11 },
      { x: "Oct", y: 12 },
      { x: "Nov", y: 13 },
      { x: "Dec", y: 14 },
    ],
  };
}


export async function getPaymentsOverviewData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      received: [
        { x: 2020, y: 450 },
        { x: 2021, y: 620 },
        { x: 2022, y: 780 },
        { x: 2023, y: 920 },
        { x: 2024, y: 1080 },
      ],
      due: [
        { x: 2020, y: 1480 },
        { x: 2021, y: 1720 },
        { x: 2022, y: 1950 },
        { x: 2023, y: 2300 },
        { x: 2024, y: 1200 },
      ],
    };
  }

  return {
    received: [
      { x: "Jan", y: 0 },
      { x: "Feb", y: 20 },
      { x: "Mar", y: 35 },
      { x: "Apr", y: 45 },
      { x: "May", y: 35 },
      { x: "Jun", y: 55 },
      { x: "Jul", y: 65 },
      { x: "Aug", y: 50 },
      { x: "Sep", y: 65 },
      { x: "Oct", y: 75 },
      { x: "Nov", y: 60 },
      { x: "Dec", y: 75 },
    ],
    due: [
      { x: "Jan", y: 15 },
      { x: "Feb", y: 9 },
      { x: "Mar", y: 17 },
      { x: "Apr", y: 32 },
      { x: "May", y: 25 },
      { x: "Jun", y: 68 },
      { x: "Jul", y: 80 },
      { x: "Aug", y: 68 },
      { x: "Sep", y: 84 },
      { x: "Oct", y: 94 },
      { x: "Nov", y: 74 },
      { x: "Dec", y: 62 },
    ],
  };
}

export async function getWeeksProfitData(timeFrame?: string) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "last week") {
    return {
      sales: [
        { x: "Sat", y: 33 },
        { x: "Sun", y: 44 },
        { x: "Mon", y: 31 },
        { x: "Tue", y: 57 },
        { x: "Wed", y: 12 },
        { x: "Thu", y: 33 },
        { x: "Fri", y: 55 },
      ],
      revenue: [
        { x: "Sat", y: 10 },
        { x: "Sun", y: 20 },
        { x: "Mon", y: 17 },
        { x: "Tue", y: 7 },
        { x: "Wed", y: 10 },
        { x: "Thu", y: 23 },
        { x: "Fri", y: 13 },
      ],
    };
  }

  return {
    sales: [
      { x: "Sat", y: 44 },
      { x: "Sun", y: 55 },
      { x: "Mon", y: 41 },
      { x: "Tue", y: 67 },
      { x: "Wed", y: 22 },
      { x: "Thu", y: 43 },
      { x: "Fri", y: 65 },
    ],
    revenue: [
      { x: "Sat", y: 13 },
      { x: "Sun", y: 23 },
      { x: "Mon", y: 20 },
      { x: "Tue", y: 8 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 27 },
      { x: "Fri", y: 15 },
    ],
  };
}