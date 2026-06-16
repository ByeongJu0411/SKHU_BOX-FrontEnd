"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import ChangePasswordModal from "../../_component/ChangePasswordModal";

interface AdminUser {
  name: string;
  studentNumber: string;
  department: string;
  email: string;
  createdAt: string;
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function AdminMyPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`);
        const data = await res.json();
        if (data.success) setAdmin(data.data);
      } catch {
        //
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">내 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-[22px] font-black text-[#191f28] tracking-tight">마이페이지</h1>

      <div className="flex flex-col gap-4 w-full max-w-[600px] mx-auto">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {admin ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1e23] text-[#6bc48f] text-1xl font-bold flex items-center justify-center shrink-0">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <span className="block text-base font-extrabold text-[#191f28]">{admin.name}</span>
                  <span className="block text-[12px] text-[#8b95a1] mt-0.5">{admin.department}</span>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-[#f2f4f6]">
                {[
                  {
                    icon: (
                      <svg
                        className="w-[18px] h-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 8h20" />
                      </svg>
                    ),
                    label: "학번",
                    value: admin.studentNumber,
                  },
                  {
                    icon: (
                      <svg
                        className="w-[18px] h-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    label: "이메일",
                    value: admin.email,
                  },
                  {
                    icon: (
                      <svg
                        className="w-[18px] h-[18px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    ),
                    label: "등록일",
                    value: formatDate(admin.createdAt),
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[#b0b8c1]">{row.icon}</span>
                      <span className="text-[14px] text-[#8b95a1]">{row.label}</span>
                    </div>
                    <span className="text-[14px] font-semibold text-[#191f28]">{row.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[13px] text-gray-300 text-center py-6">정보를 불러올 수 없습니다.</p>
          )}
        </div>

        {/* 계정관리 */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[12px] font-bold text-[#191f28] mb-2">계정관리</h3>
          <div className="flex flex-col divide-y divide-[#f2f4f6]">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-3 py-3.5 bg-transparent border-none cursor-pointer font-sans text-left hover:bg-[#f8f9fa] rounded-lg px-1 transition-colors"
            >
              <svg
                className="w-[18px] h-[18px] text-[#b0b8c1]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span className="text-[14px] text-[#4e5968]">비밀번호 변경</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-3.5 bg-transparent border-none cursor-pointer font-sans text-left hover:bg-[#f8f9fa] rounded-lg px-1 transition-colors"
            >
              <svg
                className="w-[18px] h-[18px] text-[#b0b8c1]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-[14px] text-[#4e5968]">로그아웃</span>
            </button>

            <button
              onClick={() => {
                if (!confirm("정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.")) return;
                document.cookie = "role=; path=/; max-age=0";
                router.push("/");
              }}
              className="flex items-center gap-3 py-2.5 bg-transparent border-none cursor-pointer font-sans text-left hover:bg-[#fff5f5] rounded-lg px-1 transition-colors"
            >
              <svg
                className="w-[18px] h-[18px] text-[#f04452]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span className="text-[14px] text-[#f04452]">계정 탈퇴</span>
            </button>
          </div>
        </div>
      </div>
      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}
