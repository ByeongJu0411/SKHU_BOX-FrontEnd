"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiBox } from "react-icons/fi";

interface MenuItem {
  label: string;
  href: string;
  badge?: number;
  icon: React.ReactNode;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const studentMenus: MenuGroup[] = [
  {
    title: "MENU",
    items: [
      {
        label: "대시보드",
        href: "/dashboard",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        label: "사물함 신청",
        href: "/apply",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        ),
      },
      {
        label: "이용 현황",
        href: "/status",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      {
        label: "고객센터",
        href: "/support",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        ),
      },
      {
        label: "마이페이지",
        href: "/mypage",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
      },
    ],
  },
];

const adminMenus: MenuGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "대시보드",
        href: "/admindashboard",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "사물함 관리",
        href: "/lockers",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        ),
      },
      {
        label: "민원 관리",
        href: "/complaints",
        badge: 3,
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        ),
      },
      {
        label: "학생 관리",
        href: "/students",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        label: "학생회 관리",
        href: "/admins",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        label: "데이터/통계",
        href: "/analytics",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
      {
        label: "설정",
        href: "/settings",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
          </svg>
        ),
      },
    ],
  },
];

interface SidebarProps {
  role: "student" | "admin";
  userName?: string;
  userDept?: string;
}

export default function Sidebar({ role, userName = "사용자", userDept = "IT융합자율학부" }: SidebarProps) {
  const pathname = usePathname();
  const menus = role === "student" ? studentMenus : adminMenus;
  const allItems = menus.flatMap((g) => g.items);
  const dark = role === "admin";

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admindashboard") {
      return pathname === href || pathname.endsWith(href.replace("/", ""));
    }
    return pathname.includes(href);
  };

  /*
   * ✅ 다크/라이트 테마 전환
   * CSS module에서는 .sidebar.dark 로 오버라이드했지만
   * Tailwind에서는 삼항연산자로 클래스를 통째로 바꿔
   */

  return (
    <>
      {/* ===== 모바일 상단 로고 바 ===== */}
      <header
        className={`
        hidden max-md:flex items-center
        fixed top-0 inset-x-0 h-14 px-5 z-50
        border-b
        ${dark ? "bg-[#1a1e23] border-[#2a2e33]" : "bg-white border-gray-100"}
      `}
      >
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-lg bg-brand flex items-center justify-center">
            <FiBox className="w-[15px] h-[15px] text-white" />
          </div>
          <span className={`text-base font-extrabold ${dark ? "text-gray-100" : "text-gray-900"}`}>SKHUBox</span>
        </div>
      </header>

      {/* ===== 데스크탑 사이드바 ===== */}
      <aside
        className={`
        w-[220px] min-w-[220px] h-dvh
        flex flex-col py-7
        fixed left-0 top-0 z-50
        border-r
        max-md:hidden
        ${
          dark
            ? "bg-[#1a1e23] border-[#2a2e33]" /* 관리자: 다크 배경 */
            : "bg-white border-gray-100" /* 학생: 라이트 배경 */
        }
      `}
      >
        {/* 로고 + ADMIN 배지 */}
        <div className="px-6 mb-7">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-brand flex items-center justify-center shrink-0">
              <FiBox className="w-[18px] h-[18px] text-white" />
            </div>
            <span className={`text-lg font-extrabold tracking-wide ${dark ? "text-gray-100" : "text-gray-900"}`}>
              SKHUBox
            </span>
          </div>
          {dark && (
            <span
              className="
              inline-flex items-center mt-2.5
              text-[11px] font-bold text-brand-light
              bg-brand/15 px-2.5 py-0.5 rounded-md tracking-wider
            "
            >
              ADMIN
            </span>
          )}
        </div>

        {/* 메뉴 그룹 */}
        <nav className="flex-1 flex flex-col gap-6">
          {menus.map((group) => (
            <div key={group.title} className="flex flex-col">
              <span
                className={`
                text-[11px] font-bold tracking-widest px-6 mb-2
                ${dark ? "text-gray-600" : "text-gray-400"}
              `}
              >
                {group.title}
              </span>
              <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-2.5 px-6 py-2.5
                          text-sm font-medium no-underline
                          border-l-[3px] transition-all duration-150
                          ${
                            active
                              ? dark
                                ? "text-[#6bc48f] bg-brand/10 border-l-brand font-bold"
                                : "text-brand bg-[#f0f7f2] border-l-brand font-bold"
                              : dark
                                ? "text-gray-500 border-l-transparent hover:text-gray-300 hover:bg-white/[0.04]"
                                : "text-gray-500 border-l-transparent hover:text-gray-900 hover:bg-[#f8f9f8]"
                          }
                        `}
                      >
                        <span className="w-5 h-5 flex items-center justify-center shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className="
                            text-[11px] font-bold text-white bg-red-500
                            w-5 h-5 rounded-full
                            flex items-center justify-center shrink-0
                          "
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* 유저 정보 */}
        <div
          className={`
          flex items-center gap-3 px-6 pt-5 mt-auto
          border-t
          ${dark ? "border-[#2a2e33]" : "border-gray-100"}
        `}
        >
          <div
            className={`
            w-[38px] h-[38px] rounded-full
            text-[15px] font-bold
            flex items-center justify-center shrink-0
            ${dark ? "bg-brand/20 text-[#6bc48f]" : "bg-green-50 text-brand"}
          `}
          >
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className={`text-sm font-bold ${dark ? "text-gray-200" : "text-gray-900"}`}>{userName}</span>
            <span className={`text-[11px] truncate ${dark ? "text-gray-600" : "text-gray-400"}`}>{userDept}</span>
          </div>
        </div>
      </aside>

      {/* ===== 모바일 하단 탭바 ===== */}
      <nav
        className={`
        hidden max-md:flex items-center justify-around
        fixed bottom-0 inset-x-0 h-16 px-1 z-50
        border-t pb-[env(safe-area-inset-bottom)]
        ${dark ? "bg-[#1a1e23] border-[#2a2e33]" : "bg-white border-gray-100"}
      `}
      >
        {allItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1
                flex-1 py-2 no-underline transition-colors duration-150
                ${active ? (dark ? "text-[#6bc48f]" : "text-brand") : dark ? "text-gray-600" : "text-gray-400"}
              `}
            >
              <span className="w-[22px] h-[22px] flex items-center justify-center [&>svg]:w-[22px] [&>svg]:h-[22px]">
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
