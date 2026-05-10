import { NextRequest, NextResponse } from "next/server";

/*
 * ✅ 미들웨어 — 인증 보호
 *
 * role 쿠키가 없으면 로그인 페이지로 리다이렉트.
 * role 쿠키가 있으면 역할에 맞는 페이지만 접근 가능.
 *
 * 학생(role=student): /dashboard, /apply, /status, /support, /mypage
 * 관리자(role=admin): /admindashboard, /lockers, /complaints, /students, /adminmanage, /analytics, /settings, /admin/mypage
 */

// 로그인 없이 접근 가능한 경로
const publicPaths = ["/", "/login", "/signup", "/login/findpassword"];

// 관리자 전용 경로
const adminPaths = [
  "/admindashboard",
  "/lockers",
  "/complaints",
  "/students",
  "/adminmanage",
  "/analytics",
  "/settings",
];

// 학생 전용 경로
const studentPaths = ["/dashboard", "/apply", "/status", "/support", "/mypage"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일, API, _next 등은 무시
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // .ico, .png 등
  ) {
    return NextResponse.next();
  }

  // public 경로는 통과
  const isPublic = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  if (isPublic) return NextResponse.next();

  // 쿠키에서 role 확인
  const role = request.cookies.get("role")?.value;

  // 로그인 안 됨 → /login으로 리다이렉트
  if (!role) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 관리자 경로에 학생이 접근 시도
  const isAdminPath = adminPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  if (isAdminPath && role !== "admin") {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 학생 경로에 관리자가 접근 시도
  const isStudentPath = studentPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  if (isStudentPath && role !== "student") {
    const adminUrl = new URL("/admindashboard", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
