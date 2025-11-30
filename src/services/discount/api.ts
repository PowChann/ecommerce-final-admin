// discount/api.ts

export interface Discount {
  id: string;
  code: string;
  value: number;
  usageLimit: number;
  timesUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface DiscountResponse {
  data: Discount[];
  pagination: Pagination;
}

export interface DiscountPayload {
  code: string;
  value: number;
  usageLimit: number;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/discounts`;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
};

// 1. Get Discounts
export const getDiscountsApi = async (
  page = 1,
  limit = 10,
): Promise<DiscountResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Quan trọng
  });
  return handleResponse(response);
};

// 2. Create Discount
export const createDiscountApi = async (
  data: DiscountPayload,
): Promise<Discount> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

// 3. Update Discount
export const updateDiscountApi = async (
  id: string,
  data: DiscountPayload,
): Promise<Discount> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

// 4. Delete Discount
export const deleteDiscountApi = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};
