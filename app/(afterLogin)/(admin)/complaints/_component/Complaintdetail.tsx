"use client";

import { useState } from "react";
import type { ComplaintItem, ComplaintStatus } from "../type";

interface ComplaintDetailProps {
  complaint: ComplaintItem;
  onStatusChange: (id: number, status: ComplaintStatus, answer: string) => void;
}

const statusBadge: Record<ComplaintStatus, { style: string; label: string }> = {
  대기중: { style: "bg-red-500 text-white", label: "대기중" },
  확인중: { style: "bg-yellow-500 text-white", label: "확인중" },
  처리중: { style: "bg-blue-500 text-white", label: "처리중" },
  완료: { style: "bg-green-600 text-white", label: "완료" },
};

const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
} as const;

export default function ComplaintDetail({ complaint, onStatusChange }: ComplaintDetailProps) {
  const [reply, setReply] = useState(complaint.answer || "");
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const badge = statusBadge[complaint.status];

  const handleSubmit = () => {
    onStatusChange(complaint.id, status, reply);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-5 border-b border-gray-50">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-lg font-extrabold text-gray-900">민원 #{complaint.id}</h2>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${badge.style}`}>{badge.label}</span>
        </div>
        <p className="text-[12px] text-gray-400">{complaint.createdAt}</p>
      </div>

      {/* 정보 */}
      <div className="px-6 py-4 border-b border-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-[11px] text-gray-400 mb-0.5">학번</span>
            <span className="block text-[13px] font-semibold text-gray-900">{complaint.studentNumber}</span>
          </div>
          <div>
            <span className="block text-[11px] text-gray-400 mb-0.5">사물함</span>
            <span className="block text-[13px] font-semibold text-gray-900">{complaint.lockerNumber || "-"}</span>
          </div>
        </div>
      </div>

      {/* 요청 내용 */}
      <div className="px-6 py-4 border-b border-gray-50">
        <h4 className="text-[13px] font-bold text-gray-900 mb-2">📋 요청 내용</h4>
        <p className="text-[13px] text-gray-600 leading-relaxed">{complaint.content}</p>
      </div>

      {/* 기존 답변 (있을 경우) */}
      {complaint.answer && (
        <div className="px-6 py-4 border-b border-gray-50">
          <h4 className="text-[13px] font-bold text-gray-900 mb-2">💬 기존 답변</h4>
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <p className="text-[13px] text-gray-600 leading-relaxed">{complaint.answer}</p>
          </div>
        </div>
      )}

      {/* 답변 작성 */}
      <div className="px-6 py-4 border-b border-gray-50">
        <h4 className="text-[13px] font-bold text-gray-900 mb-2">답변 작성</h4>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="학생에게 전달할 답변을 작성하세요. 처리 상황이나 안내 사항을 포함해 주세요."
          className="w-full h-24 p-3 border border-gray-200 rounded-xl text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300 resize-none"
        />
      </div>

      {/* 하단: 상태 변경 + 전송 */}
      <div className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-gray-500">상태 변경:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
            className="h-[34px] px-3 pr-8 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 bg-white appearance-none outline-none font-sans focus:border-brand transition-colors cursor-pointer"
            style={selectArrow}
          >
            <option value="대기중">대기중</option>
            <option value="확인중">확인중</option>
            <option value="처리중">처리중</option>
            <option value="완료">완료</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="text-[13px] font-bold text-white px-5 py-2 border-none rounded-lg bg-brand cursor-pointer font-sans hover:bg-brand-dark transition-colors"
        >
          ▶ 답변 전송
        </button>
      </div>
    </div>
  );
}
