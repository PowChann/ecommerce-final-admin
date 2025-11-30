// hooks/useAuthSession.ts
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuthSession = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Lấy data session từ better-auth
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.refresh(); // Refresh để UI cập nhật lại trạng thái chưa login
            router.push("/"); // (Tùy chọn) Đưa về trang chủ
          },
        },
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    session,
    isPending,
    isSigningOut,
    handleSignOut,
  };
};
