"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChangePasswordModal from "../../_component/ChangePasswordModal";
import TermsModal from "./_component/TermsModal";

export default function MyPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Mock 데이터
  const user = {
    name: "사용자",
    studentId: "202111111",
    dept: "IT융합자율학부",
    email: "test@office.skhu.ac.kr",
    joinDate: "2025.06.01",
  };

  const locker = {
    id: "3A-05",
    building: "새천년관",
    location: "3층 A구역",
    status: "정상",
    dDay: "D - 97",
    startDate: "2026.03.02",
    endDate: "2026.06.30",
    usedDays: 20,
    totalDays: 120,
  };

  const usageHistory = [
    { text: "새천년관 3층 A구역 3A-05 배정", date: "2026.03.01", status: "이용중", statusColor: "text-brand" },
    { text: "새천년관 2층 B구역 2B-10 반납", date: "2025.12.14", status: "종료", statusColor: "text-gray-400" },
    { text: "수리 요청 #0312 접수", date: "2025.11.24", status: "종료", statusColor: "text-gray-400" },
    { text: "새천년관 2층 B구역 2B-10 배정", date: "2025.08.20", status: "종료", statusColor: "text-gray-400" },
  ];

  const historyDotColors = ["bg-green-500", "bg-red-400", "bg-orange-400", "bg-green-500"];

  const usagePercent = Math.round((locker.usedDays / locker.totalDays) * 100);

  const handleLogout = () => {
    document.cookie = "role=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <h1 className="text-2xl font-black text-gray-900 tracking-tight">마이페이지</h1>

      <div className="grid grid-cols-[1fr_340px] gap-5 items-start max-[900px]:grid-cols-1">
        {/* ===== 좌측 ===== */}
        <div className="flex flex-col gap-5">
          {/* 내 사물함 */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">내 사물함</h3>

            <div className="flex items-center gap-6 mb-5 max-md:flex-col max-md:items-start">
              {/* 사물함 배지 */}
              <div className="w-[90px] h-[90px] bg-green-50 rounded-[14px] flex flex-col items-center justify-center gap-1.5 shrink-0">
                <svg
                  className="w-[22px] h-[22px] text-brand"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span className="text-base font-extrabold text-brand tracking-wider">{locker.id}</span>
              </div>

              {/* 정보 */}
              <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <span className="block text-[11px] text-gray-400">건물</span>
                  <span className="block text-[15px] font-bold text-gray-900">{locker.building}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-400">위치</span>
                  <span className="block text-[15px] font-bold text-gray-900">{locker.location}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-400">상태</span>
                  <span className="block text-[15px] font-bold text-brand">{locker.status}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-400">남은 기간</span>
                  <span className="block text-[15px] font-bold text-gray-900">{locker.dDay}</span>
                </div>
              </div>
            </div>

            {/* 사용 기간 프로그레스 바 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-gray-400">사용 기간</span>
                <span className="text-[13px] font-bold text-brand">
                  {locker.usedDays}일 / {locker.totalDays}일
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-700"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-gray-300">{locker.startDate}</span>
                <span className="text-[11px] text-gray-300">{locker.endDate}</span>
              </div>
            </div>
          </div>

          {/* 내 이용내역 */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">내 이용내역</h3>
            <div className="flex flex-col">
              {usageHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-[6px] shrink-0 ${historyDotColors[i]}`} />
                    <div>
                      <span className="block text-[13px] font-semibold text-gray-900">{item.text}</span>
                      <span className="block text-[11px] text-gray-300 mt-0.5">{item.date}</span>
                    </div>
                  </div>
                  <span className={`text-[12px] font-bold shrink-0 ${item.statusColor}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== 우측 ===== */}
        <div className="flex flex-col gap-5">
          {/* 개인정보 */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">개인정보</h3>
            <div className="flex flex-col">
              {[
                { icon: "👤", label: "이름", value: user.name },
                { icon: "🎓", label: "학번", value: user.studentId },
                { icon: "🏫", label: "학부", value: user.dept },
                { icon: "📧", label: "이메일", value: user.email },
                { icon: "🔒", label: "비밀번호", value: "••••••" },
                { icon: "📅", label: "가입일", value: user.joinDate },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[14px] w-5 text-center">{row.icon}</span>
                    <span className="text-[13px] text-gray-400">{row.label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 계정관리 */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-[15px] font-extrabold text-gray-900 mb-3">계정관리</h3>
            <div className="flex flex-col">
              {[
                { icon: "🔑", label: "비밀번호 변경", onClick: () => setShowPasswordModal(true) },
                { icon: "📄", label: "이용약관", onClick: () => setShowTermsModal(true) },
                { icon: "🚪", label: "로그아웃", onClick: handleLogout },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="
                    flex items-center gap-2.5 py-3
                    border-b border-gray-50 last:border-b-0
                    text-left bg-transparent border-x-0 border-t-0
                    cursor-pointer font-sans
                    hover:bg-gray-50 transition-colors rounded-lg px-1
                  "
                >
                  <span className="text-[14px] w-5 text-center">{item.icon}</span>
                  <span className="text-[13px] text-gray-500 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}
