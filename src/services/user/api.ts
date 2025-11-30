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
