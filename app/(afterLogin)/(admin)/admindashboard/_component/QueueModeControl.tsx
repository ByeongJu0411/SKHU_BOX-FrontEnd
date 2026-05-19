"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import toast from "react-hot-toast";
import QueueSkipModal from "./QueueSkipModal";

export default function QueueModeControl() {
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showSkipModal, setShowSkipModal] = useState(false);

  // 페이지 로드 시 현재 대기열 모드 상태 조회
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/queue-mode`);
        const data = await res.json();
        if (data.success) {
          setEnabled(data.data.enabled);
        }
      } catch {
        //
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, []);

  // 대기열 모드 ON/OFF 전환
  const handleToggle = async () => {
    const next = !enabled;

    const message = next
      ? "대기열 모드를 활성화하시겠습니까?\n\n다중 서버가 가동되고, 학생들은 대기열을 통해 사물함을 신청하게 됩니다."
      : "대기열 모드를 비활성화하시겠습니까?\n\n단일 서버로 전환되고, 학생들은 바로 사물함을 신청할 수 있습니다.";

    if (!confirm(message)) return;

    setIsLoading(true);

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/queue-mode`, {
        method: "PATCH",
        body: JSON.stringify({ enabled: next }),
      });

      const data = await res.json();

      if (data.success) {
        setEnabled(data.data.enabled);
        toast.success(data.data.enabled ? "대기열 모드가 활성화되었습니다" : "대기열 모드가 비활성화되었습니다");
      } else {
        toast.error(data.message || "설정 변경에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return null;

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

      {/* 우측: 스킵 버튼 + 토글 스위치 */}
      <div className="flex items-center gap-3">
        {/* 대기열 ON일 때만 스킵 버튼 표시 */}
        {enabled && (
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-[12px] font-semibold text-[#e67700] bg-[#ffd43b]/20 border border-[#ffd43b]/40 px-3 py-1.5 rounded-lg cursor-pointer font-sans hover:bg-[#ffd43b]/30 transition-colors whitespace-nowrap"
          >
            대기열 스킵
          </button>
        )}

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
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-[#b0b8c1] border-t-transparent rounded-full animate-spin" />
              </span>
            )}
          </span>
        </button>
      </div>

      {/* 스킵 모달 */}
      <QueueSkipModal isOpen={showSkipModal} onClose={() => setShowSkipModal(false)} />
    </div>
  );
}
