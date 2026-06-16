"use client";

import { useState } from "react";
import { buildings } from "@/app/(afterLogin)/(student)/apply/config";

interface LockerFilterProps {
  stats: { available: number; inUse: number; broken: number; disabled: number };
  onFilterChange: (filter: { building: string; floor: string; search: string }) => void;
}

const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
} as const;

const selectClass = `
  h-[38px] px-3 pr-8 border border-gray-200 rounded-[10px]
  text-[13px] font-semibold text-gray-900 bg-white
  appearance-none outline-none font-sans
  focus:border-brand transition-colors cursor-pointer
`;

// 건물을 선택하지 않았을 때는 전체 건물의 층 번호를 모아서 보여준다
const allFloorNumbers = Array.from(new Set(buildings.flatMap((b) => b.floors.map((f) => f.number)))).sort(
  (a, b) => a - b
);

export default function LockerFilter({ stats, onFilterChange }: LockerFilterProps) {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [search, setSearch] = useState("");

  const floorOptions = building
    ? buildings.find((b) => b.name === building)?.floors.map((f) => f.number) ?? []
    : allFloorNumbers;

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextBuilding = e.target.value;
    setBuilding(nextBuilding);
    setFloor("");
    onFilterChange({ building: nextBuilding, floor: "", search });
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFloor(e.target.value);
    onFilterChange({ building, floor: e.target.value, search });
  };

  const handleSearch = () => onFilterChange({ building, floor, search });

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* 필터 드롭다운 + 검색 */}
      <div className="flex gap-2 items-center flex-wrap">
        <select className={selectClass} style={selectArrow} value={building} onChange={handleBuildingChange}>
          <option value="">전체 건물</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        <select className={selectClass} style={selectArrow} value={floor} onChange={handleFloorChange}>
          <option value="">전체 층</option>
          {floorOptions.map((f) => (
            <option key={f} value={f}>
              {f}층
            </option>
          ))}
        </select>

        {/* 검색 — relative로 아이콘 겹치기 */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px]">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="사물함 번호 또는 학생 이름을 검색..."
            className="
              h-[38px] w-[260px] pl-9 pr-3
              border border-gray-200 rounded-[10px]
              text-[13px] text-gray-900 bg-white
              outline-none font-sans
              focus:border-brand transition-colors
              placeholder:text-gray-300
              max-md:w-full
            "
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-[38px] px-4 bg-brand text-white text-[13px] font-bold border-none rounded-[10px] cursor-pointer font-sans hover:bg-brand-dark transition-colors"
        >
          검색
        </button>
      </div>

      {/* 통계 도트 */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="w-2 h-2 rounded-full bg-brand" />
        <span className="text-xs font-semibold text-gray-500 mr-2">가능 {stats.available}</span>
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs font-semibold text-gray-500 mr-2">사용중 {stats.inUse}</span>
        <span className="w-2 h-2 rounded-full bg-orange-500" />
        <span className="text-xs font-semibold text-gray-500 mr-2">고장 {stats.broken}</span>
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <span className="text-xs font-semibold text-gray-500">비활성 {stats.disabled}</span>
      </div>
    </div>
  );
}
