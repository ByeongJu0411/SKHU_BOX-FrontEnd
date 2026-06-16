"use client";

import { useState } from "react";

interface StudentSearchProps {
  onSearch: (query: { name: string; studentNumber: string }) => void;
}

export default function StudentSearch({ onSearch }: StudentSearchProps) {
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const handleSearch = () => {
    onSearch({ name: name.trim(), studentNumber: studentNumber.trim() });
  };

  const handleReset = () => {
    setName("");
    setStudentNumber("");
    onSearch({ name: "", studentNumber: "" });
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="이름으로 검색"
            className="w-full h-[38px] px-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[12px] font-semibold text-gray-500 mb-1.5">학번</label>
          <input
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="학번으로 검색"
            className="w-full h-[38px] px-3 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="h-[38px] px-4 bg-brand text-white text-[13px] font-bold border-none rounded-lg cursor-pointer font-sans hover:bg-brand-dark transition-colors"
          >
            검색
          </button>
          <button
            onClick={handleReset}
            className="h-[38px] px-4 bg-white text-gray-500 text-[13px] font-semibold border border-gray-200 rounded-lg cursor-pointer font-sans hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
