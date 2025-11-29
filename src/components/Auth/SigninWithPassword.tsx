"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "../form-elements/InputGroup";
import { Checkbox } from "../form-elements/checkbox";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
// KHÔNG dùng useAuthSession ở đây vì nó chứa logic chặn trang của Admin
// import { useAuthSession } from "@/lib/useAuthSession";

export default function SigninWithPassword() {
  // 1. Dùng trực tiếp hook của better-auth để lấy session mà không bị chặn quyền
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  // 2. Logic redirect: Nếu đã đăng nhập rồi thì đá về trang chủ
  if (isPending) {
    return (
      <div className="flex justify-center p-10">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
      </div>
    );
  }

  if (session) {
    // Nếu lỡ có session user thường lọt vào đây, hook bảo vệ ở trang chủ sẽ đá ra lại.
    router.replace("/");
    return null;
  }

  // 3. CÁC HÀM XỬ LÝ SỰ KIỆN
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: async () => {
          // --- KIỂM TRA QUYỀN ADMIN TẠI ĐÂY ---
          // API signIn thường không trả về role ngay lập tức trong ctx.data.user
          // Chúng ta cần gọi getSession để lấy thông tin đầy đủ (bao gồm role)
          const { data: sessionData } = await authClient.getSession();

          // Ép kiểu as any để tránh lỗi TS nếu type chưa cập nhật, hoặc check an toàn
          if (!sessionData || (sessionData.user as any).role !== "admin") {
            toast.error("Truy cập bị từ chối: Tài khoản này không phải Admin!");

            // Đăng xuất ngay lập tức để hủy session vừa tạo
            await authClient.signOut();

            setLoading(false);
            return; // Dừng lại, không chuyển hướng
          }

          toast.success("Login successful!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Login failed. Please try again.");
          setLoading(false);
        },
      },
    );
  };

  // 4. RENDER GIAO DIỆN
  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          disabled={loading}
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
