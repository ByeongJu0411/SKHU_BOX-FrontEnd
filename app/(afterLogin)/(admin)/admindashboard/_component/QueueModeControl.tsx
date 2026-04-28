"use client";

import { useState } from "react";

/*
 * ✅ 대기열 모드 컨트롤
 *
 * 학기 초: 대기열 모드 ON → 다중 서버 + 대기열 시스템 활성화
 *         → 학생에게 대기 순번 표시, 차례가 오면 일정 시간 내 예약 필요
 *
 * 학기 중: 대기열 모드 OFF → 단일 서버, 바로 신청 가능
 *
 * 백엔드 API:
 *   GET  /api/admin/settings/queue-mode → { enabled: boolean }
 *   PUT  /api/admin/settings/queue-mode → { enabled: boolean }
 */

export default function QueueModeControl() {
  // TODO: 실제로는 API에서 초기 상태를 가져와야 함
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    const next = !enabled;

    // 위험 동작이므로 확인
    const message = next
      ? "대기열 모드를 활성화하시겠습니까?\n\n다중 서버가 가동되고, 학생들은 대기열을 통해 사물함을 신청하게 됩니다."
      : "대기열 모드를 비활성화하시겠습니까?\n\n단일 서버로 전환되고, 학생들은 바로 사물함을 신청할 수 있습니다.";

    if (!confirm(message)) return;

    setIsLoading(true);

    try {
      // TODO: 실제 API 호출
      // await fetch("/api/admin/settings/queue-mode", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ enabled: next }),
      // });

      // MVP: 0.5초 딜레이로 API 호출 시뮬레이션
      await new Promise((r) => setTimeout(r, 500));
      setEnabled(next);
    } catch {
      alert("설정 변경에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
      flex items-center justify-between
      px-5 py-3.5 rounded-2xl border
      transition-colors duration-300
      ${enabled ? "bg-[#fff8e1] border-[#ffd43b]/30" : "bg-white border-[#f2f4f6]"}
    `}
    >
      {/* 좌측: 상태 정보 */}
      <div className="flex items-center gap-3.5">
        {/* 상태 아이콘 */}
        <div
          className={`
          w-9 h-9 rounded-xl flex items-center justify-center shrink-0
          transition-colors duration-300
          ${enabled ? "bg-[#ffd43b]/30" : "bg-[#f2f4f6]"}
        `}
        >
          <svg
            className={`w-[18px] h-[18px] transition-colors duration-300 ${enabled ? "text-[#e67700]" : "text-[#b0b8c1]"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-[#191f28]">대기열 모드</span>
            <span
              className={`
              text-[11px] font-bold px-2 py-0.5 rounded-md
              transition-colors duration-300
              ${enabled ? "bg-[#ffd43b]/30 text-[#e67700]" : "bg-[#f2f4f6] text-[#b0b8c1]"}
            `}
            >
              {enabled ? "ON" : "OFF"}
            </span>
          </div>
          <span className="text-[12px] text-[#8b95a1] mt-0.5 block">
            {enabled ? "다중 서버 운영 중 · 학생 대기열 활성화" : "단일 서버 운영 중 · 바로 신청 가능"}
          </span>
        </div>
      </div>

      {/* 우측: 토글 스위치 */}
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          relative w-[52px] h-[28px] rounded-full border-none
          cursor-pointer transition-colors duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${enabled ? "bg-[#ffa726]" : "bg-[#e0e0e0]"}
        `}
      >
        <span
          className={`
          absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.15)]
          transition-all duration-300
          ${enabled ? "left-[27px]" : "left-[3px]"}
        `}
        >
          {/* 로딩 시 스피너 */}
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-3 h-3 border-2 border-[#b0b8c1] border-t-transparent rounded-full animate-spin" />
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
