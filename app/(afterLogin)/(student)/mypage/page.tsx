"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import ChangePasswordModal from "../../_component/ChangePasswordModal";
import TermsModal from "./_component/TermsModal";

export default function MyPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [lockerDetail, setLockerDetail] = useState<{
    building: string;
    locationDetail: string;
  } | null>(null);

  const [locker, setLocker] = useState<{
    lockerNumber: string;
    status: string;
    expiredAt: string;
    lockerId: number;
  } | null>(null);

  const [history, setHistory] = useState<
    {
      reservationId: number;
      lockerId: number;
      lockerNumber: string;
      building: string;
      status: string;
      reservedAt: string;
      expiredAt: string;
      endAt: string;
    }[]
  >([]);

  const [user, setUser] = useState<{
    name: string;
    studentNumber: string;
    department: string;
    email: string;
    createdAt: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 내 예약 조회
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers/my-reservation`);
        const data = await res.json();
        if (data.success && data.data) {
          setLocker(data.data);

          // 전체 사물함에서 내 사물함 상세 정보 찾기
          const lockersRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers`);
          const lockersData = await lockersRes.json();
          if (lockersData.success) {
            const mine = lockersData.data.find((l: { id: number }) => l.id === data.data.lockerId);
            if (mine) setLockerDetail({ building: mine.building, locationDetail: mine.locationDetail });
          }
        }
        // 이용내역 조회
        const historyRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers/my-history`);
        const historyData = await historyRes.json();
        if (historyData.success) setHistory(historyData.data);

        // 내 정보 조회
        const userRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`);
        const userData = await userRes.json();
        if (userData.success) setUser(userData.data);
      } catch {
        // 예약 없음
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

  // 사용 기간 계산
  const getLockerProgress = () => {
    if (!locker?.expiredAt) return { usedDays: 0, totalDays: 0, percent: 0, startDate: "-", endDate: "-", dDay: "-" };

    const now = new Date();
    const expiredAt = new Date(locker.expiredAt);

    // 학기 기준 50일로 가정 (백엔드에서 시작일을 안 주니까)
    const totalDays = 50;
    const startDate = new Date(expiredAt);
    startDate.setDate(startDate.getDate() - totalDays);

    const usedDays = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const remainDays = Math.max(0, Math.floor((expiredAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const percent = Math.min(100, Math.round((usedDays / totalDays) * 100));

    const fmt = (d: Date) =>
      `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

    return {
      usedDays,
      totalDays,
      percent,
      startDate: fmt(startDate),
      endDate: fmt(expiredAt),
      dDay: `D - ${remainDays}`,
    };
  };

  const progress = getLockerProgress();

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
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

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
                </div>
              </div>
            ) : locker ? (
              <>
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
                    <span className="text-base font-extrabold text-brand tracking-wider">{locker.lockerId}</span>
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <span className="block text-[11px] text-gray-400">건물</span>
                      <span className="block text-[15px] font-bold text-gray-900">{lockerDetail?.building || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-gray-400">위치</span>
                      <span className="block text-[15px] font-bold text-gray-900">
                        {lockerDetail?.locationDetail || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-gray-400">상태</span>
                      <span className="block text-[15px] font-bold text-brand">
                        {locker.status === "ACTIVE" ? "이용중" : locker.status}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-gray-400">남은 기간</span>
                      <span className="block text-[15px] font-bold text-gray-900">{progress.dDay}</span>
                    </div>
                  </div>
                </div>

                {/* 사용 기간 프로그레스 바 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-gray-400">사용 기간</span>
                    <span className="text-[13px] font-bold text-brand">
                      {progress.usedDays}일 / {progress.totalDays}일
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-700"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-gray-300">{progress.startDate}</span>
                    <span className="text-[11px] text-gray-300">{progress.endDate}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[13px] text-gray-300 text-center py-6">예약된 사물함이 없습니다.</p>
            )}
          </div>

          {/* 내 이용내역 */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">내 이용내역</h3>
            {history.length === 0 ? (
              <p className="text-[13px] text-gray-300 text-center py-6">이용 내역이 없습니다.</p>
            ) : (
              <div className="flex flex-col">
                {history.map((item) => {
                  const isActive = item.status === "ACTIVE";
                  return (
                    <div
                      key={item.reservationId}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-2 h-2 rounded-full mt-[6px] shrink-0 ${isActive ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <div>
                          <span className="block text-[13px] font-semibold text-gray-900">
                            {item.building} {item.lockerNumber} {isActive ? "배정" : "반납"}
                          </span>
                          <span className="block text-[11px] text-gray-300 mt-0.5">
                            {formatDate(item.reservedAt)} ~ {formatDate(item.endAt || item.expiredAt)}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[12px] font-bold shrink-0 ${isActive ? "text-brand" : "text-gray-400"}`}>
                        {isActive ? "이용중" : "종료"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===== 우측 ===== */}
        <div className="flex flex-col gap-5">
          {/* 개인정보 */}
          <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">개인정보</h3>
            {user ? (
              <div className="flex flex-col">
                {[
                  { icon: "👤", label: "이름", value: user.name },
                  { icon: "🎓", label: "학번", value: user.studentNumber },
                  { icon: "🏫", label: "학부", value: user.department },
                  { icon: "📧", label: "이메일", value: user.email },
                  { icon: "📅", label: "가입일", value: formatDate(user.createdAt) },
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
            ) : (
              <p className="text-[13px] text-gray-300 text-center py-6">정보를 불러올 수 없습니다.</p>
            )}
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
