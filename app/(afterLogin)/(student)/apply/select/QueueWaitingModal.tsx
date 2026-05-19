"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import Image from "next/image";

interface QueueWaitingModalProps {
  isOpen: boolean;
  position: number; // 대기 순번
  lockerId: number; // 사물함 API id
  lockerNumber: string; // 사물함 번호 (표시용)
  onSuccess: () => void; // 예약 성공 시
  onClose: () => void;
}

export default function QueueWaitingModal({
  isOpen,
  position,
  lockerId,
  lockerNumber,
  onSuccess,
  onClose,
}: QueueWaitingModalProps) {
  const [currentPosition] = useState(position);
  const [status, setStatus] = useState<"waiting" | "success" | "failed">("waiting");

  // 3초마다 예약 재시도 (대기열이 줄어들면 자동으로 예약됨)
  useEffect(() => {
    if (!isOpen || status !== "waiting") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers/reserve`, {
          method: "POST",
          body: JSON.stringify({ lockerId }),
        });

        const data = await res.json();

        if (data.success) {
          // 예약 성공
          setStatus("success");
          clearInterval(interval);
          setTimeout(() => onSuccess(), 1500);
        } else if (data.data?.position) {
          // 아직 대기중 — 순번 업데이트
        }
      } catch {
        // 네트워크 에러 시 계속 재시도
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, status, lockerId, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center text-center px-6 max-w-[400px]">
        {status === "waiting" && (
          <>
            {/* 말풍선 */}
            <div className="bg-brand text-white text-[14px] font-bold px-5 py-2.5 rounded-full mb-6">
              기다려주셔서 감사합니다
            </div>

            {/* 캐릭터 이미지 */}
            <div className="relative w-[200px] h-[200px] mb-8">
              <Image src="/queue-character.png" alt="대기열 캐릭터" fill className="object-contain" priority />
            </div>

            {/* 대기 안내 */}
            <p className="text-[15px] text-[#4e5968] mb-2">
              <span className="font-bold text-[#191f28]">{lockerNumber}</span> 사물함 대기 중이에요
            </p>

            {/* 대기 번호 */}
            <div className="mb-6">
              <span className="text-[48px] font-black text-[#191f28] tracking-tight">{currentPosition}</span>
              <span className="text-[24px] font-bold text-[#4e5968] ml-1">번째</span>
            </div>

            {/* 프로그레스 바 (움직이는 애니메이션) */}
            <div className="w-full max-w-[280px] h-1.5 bg-[#e8ebed] rounded-full overflow-hidden mb-5">
              <div className="h-full bg-brand rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>

            {/* 안내 문구 */}
            <p className="text-[13px] text-[#b0b8c1]">다시 접속하면 대기시간이 늘어날 수 있어요.</p>

            {/* 취소 버튼 */}
            <button
              onClick={onClose}
              className="mt-8 text-[13px] font-semibold text-[#8b95a1] bg-transparent border-none cursor-pointer font-sans hover:text-[#4e5968] transition-colors"
            >
              대기 취소하기
            </button>
          </>
        )}

        {status === "success" && (
          <>
            {/* 성공 아이콘 */}
            <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="text-[22px] font-black text-[#191f28] mb-2">예약이 완료되었습니다!</h2>
            <p className="text-[14px] text-[#8b95a1]">
              <span className="font-bold text-brand">{lockerNumber}</span> 사물함이 배정되었습니다
            </p>
          </>
        )}
      </div>
    </div>
  );
}
