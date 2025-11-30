// category/api.ts
export interface Category {
  id: string;
  name: string;
  createdAt: string; // ISO Date string
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CategoryResponse {
  data: Category[];
  pagination: Pagination;
}

export interface CategoryPayload {
  name: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
};

// CẬP NHẬT: Thêm tham số page và limit
export const getCategoriesApi = async (
  page = 1,
  limit = 10,
): Promise<CategoryResponse> => {
  // Tạo query string
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const createCategoryApi = async (
  data: CategoryPayload,
): Promise<Category> => {
  
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

export const updateCategoryApi = async (
  id: string,
  data: CategoryPayload,
): Promise<Category> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

export const deleteCategoryApi = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};
