"use client";

import { useState } from "react";
import { buildings } from "@/app/(afterLogin)/(student)/apply/config";

interface LockerAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { building: string; floor: number; locationDetail: string; lockerNumber: string }) => void;
}

const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
} as const;

const inputClass =
  "w-full h-[42px] px-4 border border-gray-200 rounded-[10px] text-sm text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300";

const selectClass = `${inputClass} appearance-none cursor-pointer pr-10`;

export default function LockerAddModal({ isOpen, onClose, onSubmit }: LockerAddModalProps) {
  // 건물/층/구역은 학생 신청 페이지의 그리드 설정(buildings)과 동일한 값을 써야
  // 새로 추가한 사물함이 신청 페이지 그리드에도 정확히 매칭된다.
  const [buildingIdx, setBuildingIdx] = useState(0);
  const [floorIdx, setFloorIdx] = useState(0);
  const [zoneIdx, setZoneIdx] = useState(0);
  const [lockerNumber, setLockerNumber] = useState("");

  if (!isOpen) return null;

  const selectedBuilding = buildings[buildingIdx];
  const selectedFloor = selectedBuilding.floors[floorIdx];
  const selectedZone = selectedFloor.zones[zoneIdx];

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBuildingIdx(Number(e.target.value));
    setFloorIdx(0);
    setZoneIdx(0);
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFloorIdx(Number(e.target.value));
    setZoneIdx(0);
  };

  const handleSubmit = () => {
    if (!lockerNumber.trim()) return;
    onSubmit({
      building: selectedBuilding.name,
      floor: selectedFloor.number,
      locationDetail: selectedZone.name,
      lockerNumber: lockerNumber.trim(),
    });
    setBuildingIdx(0);
    setFloorIdx(0);
    setZoneIdx(0);
    setLockerNumber("");
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.15)] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900">사물함 추가</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-gray-100 rounded-full cursor-pointer text-sm text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">건물</label>
            <select className={selectClass} value={buildingIdx} onChange={handleBuildingChange} style={selectArrow}>
              {buildings.map((b, idx) => (
                <option key={b.id} value={idx}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">층</label>
            <select className={selectClass} value={floorIdx} onChange={handleFloorChange} style={selectArrow}>
              {selectedBuilding.floors.map((f, idx) => (
                <option key={f.number} value={idx}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">구역 (위치 상세)</label>
            <select
              className={selectClass}
              value={zoneIdx}
              onChange={(e) => setZoneIdx(Number(e.target.value))}
              style={selectArrow}
            >
              {selectedFloor.zones.map((z, idx) => (
                <option key={z.name} value={idx}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">사물함 번호</label>
            <input
              className={inputClass}
              value={lockerNumber}
              onChange={(e) => setLockerNumber(e.target.value)}
              placeholder="3A-11"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-[14px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 border-none rounded-xl bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white text-[14px] font-bold cursor-pointer font-sans hover:opacity-90 transition-opacity"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
