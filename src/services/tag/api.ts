// tag/api.ts

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface TagResponse {
  data: Tag[];
  pagination: Pagination;
}

export interface TagPayload {
  name: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/tags`;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
};

// 1. Get Tags
export const getTagsApi = async (page = 1, limit = 10): Promise<TagResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Gửi kèm cookie
  });
  return handleResponse(response);
};

// 2. Create Tag
export const createTagApi = async (data: TagPayload): Promise<Tag> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

// 3. Update Tag
export const updateTagApi = async (id: string, data: TagPayload): Promise<Tag> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(response);
};

// 4. Delete Tag
export const deleteTagApi = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};