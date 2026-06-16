"use client";

import { useEffect } from "react";
import Image from "next/image";

interface QueueWaitingModalProps {
  isOpen: boolean;
  rank: number;
  onClose: () => void;
}

export default function QueueWaitingModal({ isOpen, rank, onClose }: QueueWaitingModalProps) {
  // 500 이하로 떨어지면 자동 닫힘 (부모에서 처리하지만 안전장치)
  useEffect(() => {
    if (isOpen && rank <= 500) {
      onClose();
    }
  }, [isOpen, rank, onClose]);

  if (!isOpen || rank <= 500) return null;

  // 대기 순번 (501번째 = 대기 1번)
  const waitingNumber = rank - 500;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center text-center px-6 max-w-[400px]">
        {/* 말풍선 */}
        <div className="bg-brand text-white text-[14px] font-bold px-5 py-2.5 rounded-full mb-6">
          기다려주셔서 감사합니다
        </div>

        {/* 캐릭터 이미지 */}
        <div className="relative w-[200px] h-[200px] mb-8">
          <Image src="/queue-character.png" alt="대기열 캐릭터" fill className="object-contain" priority />
        </div>

        {/* 대기 안내 */}
        <p className="text-[15px] text-[#4e5968] mb-2">사물함 신청 대기 중이에요</p>

        {/* 대기 번호 */}
        <div className="mb-3">
          <span className="text-[48px] font-black text-[#191f28] tracking-tight">{waitingNumber.toLocaleString()}</span>
          <span className="text-[24px] font-bold text-[#4e5968] ml-1">번째</span>
        </div>

        {/* 전체 순위 */}
        <p className="text-[13px] text-[#8b95a1] mb-5">
          전체 대기열 {rank.toLocaleString()}번 · 500번 이하 진입 시 예약 가능
        </p>

        {/* 프로그레스 바 */}
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
      </div>
    </div>
  );
}
