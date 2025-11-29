import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookie = request.headers.get("cookie") ?? "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
    headers: {
      cookie,
    },
  });

  const session = await res.json();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products", "/", "/orders", "/users", "/payments", "/categories", "/brands", "/tags", "/discounts", "/reviews"],
};
