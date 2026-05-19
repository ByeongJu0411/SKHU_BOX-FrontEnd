"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import toast from "react-hot-toast";

interface QueueSkipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QueueSkipModal({ isOpen, onClose }: QueueSkipModalProps) {
  const [lockerId, setLockerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSkip = async () => {
    if (!lockerId.trim()) {
      toast.error("사물함 ID를 입력해 주세요");
      return;
    }

    if (
      !confirm(
        `사물함 ID ${lockerId}의 대기열 1번 사용자를 스킵하시겠습니까?\n\n스킵하면 2번 사용자가 1번으로 올라갑니다.`,
      )
    )
      return;

    setIsLoading(true);

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/queue-mode/${lockerId}/skip`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("대기열 1번 사용자가 스킵되었습니다");
        setLockerId("");
        onClose();
      } else {
        toast.error(data.message || "스킵에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[400px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-black text-[#191f28]">대기열 스킵</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-[#f2f4f6] rounded-full cursor-pointer text-sm text-[#8b95a1] flex items-center justify-center hover:bg-[#e8ebed] transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-[13px] text-[#8b95a1] mb-5 leading-relaxed">
          특정 사물함의 대기열 1번 사용자를 스킵합니다.
          <br />
          스킵하면 2번 사용자가 1번으로 올라갑니다.
        </p>

        <div className="mb-5">
          <label className="block text-[13px] font-semibold text-[#191f28] mb-1.5">사물함 ID</label>
          <input
            type="number"
            value={lockerId}
            onChange={(e) => setLockerId(e.target.value)}
            placeholder="사물함 ID를 입력하세요 (숫자)"
            className="w-full h-[42px] px-4 border border-gray-200 rounded-[10px] text-sm text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSkip}
            disabled={isLoading || !lockerId.trim()}
            className={`flex-1 py-3 border-none rounded-xl text-[14px] font-bold font-sans transition-all
              ${
                isLoading || !lockerId.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#ffa726] text-white cursor-pointer hover:bg-[#f57c00]"
              }`}
          >
            {isLoading ? "처리 중..." : "스킵하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
