"use client";

import { useState } from "react";
import type { RequestCategory } from "../type";

interface NewRequestFormProps {
  onSubmit: (data: { category: RequestCategory; lockerId: string; title: string; content: string }) => void;
  onClose: () => void;
}

const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
} as const;

export default function NewRequestForm({ onSubmit, onClose }: NewRequestFormProps) {
  const [category, setCategory] = useState<RequestCategory>("수리 요청");
  const [lockerId, setLockerId] = useState("3A-05");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ category, lockerId, title, content });
    setTitle("");
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

      {/* 요청 유형 + 사물함 번호 */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">요청</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as RequestCategory)}
            className="w-full h-[38px] px-3 pr-8 border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-900 bg-white appearance-none outline-none font-sans focus:border-brand transition-colors cursor-pointer"
            style={selectArrow}
          >
            <option>수리 요청</option>
            <option>자리 이동</option>
            <option>문의</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">사물함 번호</label>
          <input
            value={lockerId}
            onChange={(e) => setLockerId(e.target.value)}
            className="w-full h-[38px] px-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors"
          />
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="요청 제목을 입력해 주세요."
          className="w-full h-[38px] px-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300"
        />
      </div>

      {/* 상세 내용 */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">상세 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="현재 상황이나 요청 사항을 자세히 적어주세요."
          className="w-full h-28 p-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300 resize-none"
        />
      </div>

      {/* 접수 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full py-2.5 border-none rounded-xl bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white text-[14px] font-bold font-sans cursor-pointer hover:opacity-90 transition-opacity"
      >
        접수하기
      </button>
    </div>
  );
}
