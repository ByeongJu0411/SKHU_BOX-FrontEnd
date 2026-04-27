"use client";

import { useState } from "react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");

  if (!isOpen) return null;

  const isMatch = newPw === confirm && newPw.length > 0;

  const handleSubmit = () => {
    if (!current || !newPw || !isMatch) return;
    alert("비밀번호가 변경되었습니다.");
    setCurrent("");
    setNewPw("");
    setConfirm("");
    onClose();
  };

  const inputClass =
    "w-full h-[42px] px-4 border border-gray-200 rounded-[10px] text-sm text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[420px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.15)] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-black text-gray-900">비밀번호 변경</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-gray-100 rounded-full cursor-pointer text-sm text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-[13px] text-gray-400 mb-6">현재 비밀번호를 확인한 후 새 비밀번호를 설정합니다.</p>

        {/* 폼 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">현재 비밀번호</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="현재 비밀번호 입력"
              className={inputClass}
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">새 비밀번호</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호 입력"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="새 비밀번호 재입력"
              className={inputClass}
            />
            {confirm.length > 0 && (
              <p className={`text-[11px] mt-1.5 ${isMatch ? "text-brand" : "text-red-500"}`}>
                {isMatch ? "✓ 비밀번호가 일치합니다." : "✕ 비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!current || !newPw || !isMatch}
            className={`flex-1 py-3 border-none rounded-xl text-[14px] font-bold font-sans transition-all
              ${
                current && newPw && isMatch
                  ? "bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white cursor-pointer hover:opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
