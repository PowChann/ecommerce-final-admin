"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import toast from "react-hot-toast";

export function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/auth/sign-in", "/auth/sign-up"]; // Thêm các route công khai khác nếu có

  useEffect(() => {
    if (isLoading) {
      return; // Chờ cho đến khi trạng thái xác thực được tải
    }

    // Nếu là route công khai, cho phép truy cập mà không cần kiểm tra xác thực
    if (publicRoutes.includes(pathname)) {
      if (isAuthenticated && user?.role === "admin" && pathname === "/auth/sign-in") {
        router.replace("/"); // Nếu đã đăng nhập và là admin, chuyển hướng khỏi trang đăng nhập
      }
      return;
    }

    // Đối với các route được bảo vệ
    if (!isAuthenticated) {
      toast.error("Please log in to access this page.");
      router.replace("/auth/sign-in");
    } else if (user?.role !== "admin") {
      toast.error("You do not have permission to access this page.");
      router.replace("/"); // Chuyển hướng về trang chủ hoặc trang 403
    }
  }, [isAuthenticated, isLoading, user, router, pathname]);

  // Nếu đang tải hoặc đang trên route công khai, không chặn render children
  if (isLoading || publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Nếu không được xác thực hoặc không có quyền admin trên route được bảo vệ
  if (!isAuthenticated || user?.role !== "admin") {
    // Có thể hiển thị loading spinner hoặc skeleton ở đây
    return <p>Loading or redirecting...</p>; // Hoặc một trang lỗi tùy chỉnh
  }

  return <>{children}</>;
}
