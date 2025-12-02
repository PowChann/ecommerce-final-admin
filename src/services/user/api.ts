// service/api/user/api.ts
import { authClient } from "@/lib/authClient";

// 1. Update Profile (Name, Image)
export const updateUserRequest = async (data: {
  name?: string;
  image?: string;
}) => {
  const { data: res, error } = await authClient.updateUser({
    name: data.name,
    image: data.image,
  });
  if (error) throw new Error(error.message);
  return res;
};

export const changePasswordRequest = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const { data: res, error } = await authClient.changePassword({
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    revokeOtherSessions: true,
  });
  if (error) throw new Error(error.message);
  return res;
};

//User Management

// --- Types Definitions (Dựa trên tài liệu) ---

// --- Type Definitions ---

// 1. Định nghĩa Role khớp với cấu hình Better Auth của bạn
// Nếu sau này bạn thêm role "editor" hay "moderator", hãy thêm vào đây: "user" | "admin" | "editor"
export type Role = "user" | "admin";

export interface CreateUserParams {
  email: string;
  password: string;
  name: string;
  role?: Role | Role[]; // Sử dụng type Role thay vì string
  data?: Record<string, any>;
}

export interface ListUsersQuery {
  searchValue?: string;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterValue?: string | number | boolean;
  filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
}

export interface UpdateUserParams {
  userId: string;
  data: Record<string, any>;
}

export interface BanUserParams {
  userId: string;
  banReason?: string;
  banExpiresIn?: number; // Số giây
}

// --- API Implementation ---

export const userManagement = {
  /**
   * Tạo người dùng mới
   */
  createUser: async (params: CreateUserParams) => {
    return await authClient.admin.createUser({
      email: params.email,
      password: params.password,
      name: params.name,
      // Ép kiểu về Role | Role[] để thỏa mãn TypeScript
      role: (params.role || "user") as Role | Role[],
      data: params.data,
    });
  },

  /**
   * Lấy danh sách người dùng (Hỗ trợ phân trang, tìm kiếm, lọc)
   */
  listUsers: async (query: ListUsersQuery = {}) => {
    const defaultLimit = 10;

    // Merge query với các giá trị mặc định
    const finalQuery = {
      limit: defaultLimit,
      ...query,
    };

    return await authClient.admin.listUsers({
      query: finalQuery,
    });
  },

  /**
   * Cập nhật thông tin người dùng (Tên, custom fields...)
   */
  updateUser: async ({ userId, data }: UpdateUserParams) => {
    return await authClient.admin.updateUser({
      userId,
      data,
    });
  },

  /**
   * Đổi mật khẩu người dùng
   */
  setUserPassword: async (userId: string, newPassword: string) => {
    return await authClient.admin.setUserPassword({
      userId,
      newPassword,
    });
  },

  /**
   * Phân quyền (Set Role)
   */
  setUserRole: async (userId: string, role: Role | Role[]) => {
    return await authClient.admin.setRole({
      userId,
      role: role,
    });
  },

  /**
   * Cấm người dùng (Ban)
   */
  banUser: async ({ userId, banReason, banExpiresIn }: BanUserParams) => {
    return await authClient.admin.banUser({
      userId,
      banReason,
      banExpiresIn,
    });
  },

  /**
   * Bỏ cấm người dùng (Unban)
   */
  unbanUser: async (userId: string) => {
    return await authClient.admin.unbanUser({
      userId,
    });
  },

  /**
   * Xóa vĩnh viễn người dùng (Hard delete)
   */
  removeUser: async (userId: string) => {
    return await authClient.admin.removeUser({
      userId,
    });
  },
};
