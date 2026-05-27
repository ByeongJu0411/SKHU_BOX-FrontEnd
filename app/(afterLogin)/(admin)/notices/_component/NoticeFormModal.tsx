"use client";

import { useState } from "react";

interface NoticeFormModalProps {
  mode: "create" | "edit";
  initialTitle?: string;
  initialContent?: string;
  initialPinned?: boolean;
  onSubmit: (data: { title: string; content: string; pinned: boolean }) => void;
  onClose: () => void;
}

export default function NoticeFormModal({
  mode,
  initialTitle = "",
  initialContent = "",
  initialPinned = false,
  onSubmit,
  onClose,
}: NoticeFormModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [pinned, setPinned] = useState(initialPinned);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, pinned });
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] mx-4 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f2f4f6]">
          <h2 className="text-[18px] font-black text-[#191f28]">{mode === "create" ? "새 공지 등록" : "공지 수정"}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-[#f2f4f6] rounded-full cursor-pointer text-sm text-[#8b95a1] flex items-center justify-center hover:bg-[#e8ebed] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 바디 */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#191f28] mb-1.5">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              className="w-full h-[42px] px-4 border border-gray-200 rounded-[10px] text-[14px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#191f28] mb-1.5">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지사항 내용을 입력하세요"
              className="w-full h-40 p-4 border border-gray-200 rounded-[10px] text-[14px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPinned(!pinned)}
              className={`
                relative w-[44px] h-[24px] rounded-full border-none cursor-pointer transition-colors duration-200
                ${pinned ? "bg-[#ffa726]" : "bg-[#e0e0e0]"}
              `}
            >
              <span
                className={`
                absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white
                shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all duration-200
                ${pinned ? "left-[22px]" : "left-[2px]"}
              `}
              />
            </button>
            <span className="text-[13px] font-semibold text-gray-700">
              상단 고정{" "}
              {pinned ? <span className="text-[#e67700]">ON</span> : <span className="text-gray-400">OFF</span>}
            </span>
          </div>
        </div>

        {/* 하단 */}
        <div className="px-6 py-4 border-t border-[#f2f4f6] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className={`
              px-5 py-2.5 border-none rounded-xl text-[14px] font-bold font-sans transition-all
              ${
                title.trim() && content.trim()
                  ? "bg-brand text-white cursor-pointer hover:bg-brand-dark"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {mode === "create" ? "등록" : "수정"}
          </button>
        </div>
      </div>
    </div>
  );
}
