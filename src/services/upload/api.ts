import axios from "axios";

// Định nghĩa kiểu dữ liệu trả về dựa trên JSON mẫu của bạn
export interface UploadData {
  userId: string;
  url: string;
  key: string;
  mimetype: string;
  size: number;
}

export interface UploadResponse {
  status: string;
  message: string;
  data: UploadData;
}

/**
 * Upload ảnh lên server
 * @param file - File object từ thẻ input (e.target.files[0])
 */
export const uploadImageRequest = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  // 'file' là tên field phổ biến mà backend thường nhận (như multer).
  // Nếu backend của bạn yêu cầu tên khác (vd: 'image'), hãy sửa dòng dưới:
  formData.append("image", file);

  const response = await axios.post<UploadResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Quan trọng: Gửi kèm cookie/session nếu API cần xác thực người dùng upload
      withCredentials: true, 
    }
  );

  return response.data;
};