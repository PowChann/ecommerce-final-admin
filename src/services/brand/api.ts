// brand/api.ts

export interface Brand {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface BrandResponse {
  data: Brand[];
  pagination: Pagination;
}

export interface BrandPayload {
  name: string;
  image?: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/brands`;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
};

// 1. Get Brands (Có phân trang & lấy Cookie)
export const getBrandsApi = async (page = 1, limit = 10): Promise<BrandResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Quan trọng: Để gửi kèm Cookie
  });
  return handleResponse(response);
};

// 2. Create Brand
export const createBrandApi = async (data: BrandPayload): Promise<Brand> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

// 3. Update Brand
export const updateBrandApi = async (id: string, data: BrandPayload): Promise<Brand> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

// 4. Delete Brand
export const deleteBrandApi = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};