import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/signup", "/login/findpassword"];
const adminPaths = [
  "/admindashboard",
  "/lockers",
  "/complaints",
  "/students",
  "/adminmanage",
  "/analytics",
  "/settings",
];
const studentPaths = ["/dashboard", "/apply", "/status", "/support", "/mypage"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const isPublic = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  if (isPublic) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value;

  // 토큰 둘 다 없으면 로그인으로
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // accessToken 없고 refreshToken만 있으면 갱신 시도
  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();

      if (data.success) {
        const response = NextResponse.next();
        response.cookies.set("accessToken", data.data.accessToken, { path: "/", sameSite: "lax" });
        response.cookies.set("refreshToken", data.data.refreshToken, { path: "/", sameSite: "lax" });
        return response;
      }
    } catch {
      // 갱신 실패
    }

    // 갱신 실패 → 쿠키 정리 후 로그인으로
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("role");
    return response;
  }

  // 역할 기반 접근 제어
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdminPath = adminPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isStudentPath = studentPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  if (isStudentPath && role !== "student") {
    return NextResponse.redirect(new URL("/admindashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
