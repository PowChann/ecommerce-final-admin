import axios from "axios";

// Định nghĩa kiểu dữ liệu trả về cho upload single file
export interface UploadData {
  userId?: string; // Có thể có hoặc không tùy context
  url: string;
  key?: string;
  mimetype?: string;
  size?: number;
}

export interface UploadResponse {
  status?: string;
  message?: string;
  data: UploadData;
}

/**
 * Upload một ảnh duy nhất lên server (dùng cho các tính năng như Profile)
 * @param file - File object từ thẻ input (e.target.files[0])
 * @returns Promise<UploadResponse>
 */
export const uploadImageRequest = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  // 'image' là tên field mà backend thường nhận cho single file upload
  formData.append("image", file);

  const response = await axios.post<UploadResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload`, // Gửi đến endpoint upload chung
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return response.data;
};