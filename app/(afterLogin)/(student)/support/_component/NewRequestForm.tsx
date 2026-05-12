"use client";

import { useState } from "react";

interface NewRequestFormProps {
  defaultLockerNumber?: string;
  onSubmit: (data: { lockerNumber: string; content: string }) => void;
  onClose: () => void;
}

export default function NewRequestForm({ defaultLockerNumber = "", onSubmit, onClose }: NewRequestFormProps) {
  const [lockerNumber, setLockerNumber] = useState(defaultLockerNumber);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit({ lockerNumber, content });
    setLockerNumber("");
    setContent("");
  };

  return (
    <div
      className="
      w-[320px] min-w-[320px] bg-white rounded-xl p-5
      shadow-[0_1px_4px_rgba(0,0,0,0.04)]
      flex flex-col gap-4
      max-[900px]:w-full max-[900px]:min-w-0
    "
    >
      <h3 className="text-[15px] font-extrabold text-gray-900">새 요청 접수</h3>

      {/* 사물함 번호 */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">사물함 번호</label>
        <input
          value={lockerNumber}
          onChange={(e) => setLockerNumber(e.target.value)}
          placeholder="예: 정-A-048"
          className="w-full h-[38px] px-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300"
        />
      </div>

      {/* 상세 내용 */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">민원 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="현재 상황이나 요청 사항을 자세히 적어주세요."
          className="w-full h-32 p-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300 resize-none"
        />
      </div>

      {/* 접수 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className={`
          w-full py-2.5 border-none rounded-xl text-[14px] font-bold font-sans transition-all
          ${
            content.trim()
              ? "bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white cursor-pointer hover:opacity-90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        접수하기
      </button>
    </div>
  );
}
