"use client";

import { useState } from "react";
import type { LockerApiItem, LockerStatus } from "./type";
import { getDisplayStatus, formatDate } from "./type";

interface LockerDetailProps {
  locker: LockerApiItem;
  onClose: () => void;
  onStatusChange: (lockerId: number, status: LockerStatus) => void;
  onAssign: (lockerId: number, studentNumber: string) => void;
  onForceReturn: (lockerId: number) => void;
}

const statusLabels = {
  available: "사용 가능",
  inUse: "사용중",
  broken: "고장",
  disabled: "비활성",
} as const;

const statusBgColors = {
  available: "bg-brand",
  inUse: "bg-red-500",
  broken: "bg-gray-400",
  disabled: "bg-orange-500",
} as const;

const statusBtnStyles: Record<LockerStatus, string> = {
  NORMAL: "bg-green-50 border-brand text-green-800",
  BROKEN: "bg-gray-100 border-gray-400 text-gray-600",
  DISABLED: "bg-orange-50 border-orange-500 text-orange-800",
};

const statusButtons: { key: LockerStatus; label: string }[] = [
  { key: "NORMAL", label: "사용 가능" },
  { key: "BROKEN", label: "고장" },
  { key: "DISABLED", label: "비활성" },
];

export default function LockerDetail({ locker, onClose, onStatusChange, onAssign, onForceReturn }: LockerDetailProps) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");

  const displayStatus = getDisplayStatus(locker);
  const user = locker.currentUser;

  const infoRows = [
    { label: "건물", value: locker.building },
    { label: "위치", value: `${locker.floor}층 ${locker.locationDetail}` },
    ...(user
      ? [
          { label: "사용자", value: `${user.name} · ${user.studentNumber}` },
          { label: "학부", value: user.department },
          {
            label: "이용 기간",
            value: `${formatDate(user.reservedAt)} ~ ${formatDate(user.expiredAt)} (D-${user.daysLeft})`,
          },
        ]
      : []),
  ];

  const handleStatusClick = (status: LockerStatus) => {
    if (status === locker.status) return;
    if (user && !confirm("사용중인 사물함입니다. 상태를 변경하면 강제 반납됩니다. 계속할까요?")) return;
    onStatusChange(locker.lockerId, status);
  };

  const handleAssignSubmit = () => {
    if (!studentNumber.trim()) return;
    onAssign(locker.lockerId, studentNumber.trim());
    setStudentNumber("");
    setIsAssigning(false);
  };

  const handleForceReturnClick = () => {
    if (!confirm("이 사물함을 강제 반납 처리하시겠습니까?")) return;
    onForceReturn(locker.lockerId);
  };

  return (
    <div
      className="
      w-[300px] min-w-[300px] bg-white rounded-2xl p-[22px]
      shadow-[0_1px_4px_rgba(0,0,0,0.04)]
      flex flex-col gap-[18px]
      sticky top-6
      max-[1000px]:static max-[1000px]:w-full max-[1000px]:min-w-0
    "
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold text-gray-900">사물함 상세</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 border-none bg-gray-100 rounded-full cursor-pointer text-xs text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 사물함 배지 */}
      <div
        className={`
        flex flex-col items-center justify-center gap-1.5
        py-7 px-5 rounded-2xl text-white
        ${statusBgColors[displayStatus]}
      `}
      >
        <svg
          className="w-8 h-8 stroke-white/70"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span className="text-2xl font-black tracking-widest">{locker.lockerNumber}</span>
        <span className="text-xs font-semibold bg-white/20 px-3 py-0.5 rounded-md">{statusLabels[displayStatus]}</span>
      </div>

      {/* 정보 테이블 */}
      <div className="flex flex-col divide-y divide-gray-50">
        {infoRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5">
            <span className="text-[13px] text-gray-400">{row.label}</span>
            <span className="text-[13px] font-semibold text-gray-900 text-right">{row.value}</span>
          </div>
        ))}
      </div>

      {/* 상태 변경 */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-bold text-gray-900">상태 변경</span>
        <div className="flex gap-1.5">
          {statusButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleStatusClick(key)}
              className={`
                flex-1 py-2 border rounded-lg
                text-xs font-semibold cursor-pointer font-sans
                transition-all duration-150
                ${
                  locker.status === key
                    ? statusBtnStyles[key]
                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 사용자 변경 */}
      {isAssigning && (
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold text-gray-900">학번으로 사용자 지정</span>
          <input
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAssignSubmit()}
            placeholder="20211234"
            className="w-full h-[38px] px-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300"
          />
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-2">
        {isAssigning ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsAssigning(false)}
              className="flex-1 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-[10px] text-[13px] font-semibold font-sans cursor-pointer hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleAssignSubmit}
              className="flex-1 py-2.5 border-none rounded-[10px] bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white text-[13px] font-bold font-sans cursor-pointer hover:opacity-90 transition-opacity"
            >
              지정하기
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAssigning(true)}
            className="w-full py-2.5 bg-white text-gray-900 border border-gray-200 rounded-[10px] text-[13px] font-semibold font-sans cursor-pointer hover:bg-gray-50 transition-colors"
          >
            사용자 변경
          </button>
        )}
        {user && (
          <button
            onClick={handleForceReturnClick}
            className="w-full py-2.5 bg-white text-red-500 border border-red-500 rounded-[10px] text-[13px] font-semibold font-sans cursor-pointer hover:bg-red-50 transition-colors"
          >
            강제 반납
          </button>
        )}
      </div>
    </div>
  );
}
