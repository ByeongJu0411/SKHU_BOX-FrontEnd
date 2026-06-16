"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { buildings, type LockerApiItem } from "../config";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import toast from "react-hot-toast";
import QueueWaitingModal from "./QueueWaitingModal";

type LockerStatus = "available" | "selected" | "occupied" | "broken" | "mine" | "empty";

const statusConfig: Record<LockerStatus, { bg: string }> = {
  available: { bg: "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer" },
  selected: { bg: "bg-yellow-200 text-yellow-800 border-2 border-yellow-400 scale-105 cursor-pointer" },
  occupied: { bg: "bg-red-100 text-red-700" },
  broken: { bg: "bg-gray-100 text-gray-400" },
  mine: { bg: "bg-blue-100 text-blue-700" },
  empty: { bg: "bg-transparent" },
};

const legendItems = [
  { label: "사용 가능", dotColor: "bg-green-400" },
  { label: "선택됨", dotColor: "bg-yellow-400" },
  { label: "사용중", dotColor: "bg-red-400" },
  { label: "고장", dotColor: "bg-gray-300" },
  { label: "내 사물함", dotColor: "bg-blue-400" },
];

function mapApiStatus(apiStatus: string): LockerStatus {
  switch (apiStatus) {
    case "NORMAL":
      return "available";
    case "ACTIVE":
      return "occupied";
    case "IN_USE":
      return "occupied";
    case "RESERVED":
      return "occupied";
    case "BROKEN":
      return "broken";
    default:
      return "available";
  }
}

export default function LockerSelectPage() {
  const [allLockers, setAllLockers] = useState<LockerApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBuildingIdx, setSelectedBuildingIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  // 대기열 상태
  const [queueEnabled, setQueueEnabled] = useState(false);
  const [myRank, setMyRank] = useState(0);
  const [showQueueModal, setShowQueueModal] = useState(false);

  const currentBuilding = buildings[selectedBuildingIdx];
  const currentFloor = currentBuilding.floors[selectedFloorIdx];
  const currentZone = currentFloor.zones[selectedZoneIdx];

  // 사물함 목록 조회
  const loadLockers = async () => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers`);
      const data = await res.json();
      if (data.success) {
        setAllLockers(data.data);
      } else {
        setError(data.message || "사물함 정보를 불러올 수 없습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 대기열 모드 확인 + 내 순위 조회
  const checkQueue = useCallback(async () => {
    try {
      // 대기열 모드 확인
      const modeRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/queue-mode`);
      const modeData = await modeRes.json();

      if (modeData.success && modeData.data.enabled) {
        setQueueEnabled(true);

        // 내 순위 조회
        const rankRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers/queue/my-rank`);
        const rankData = await rankRes.json();

        if (rankData.success) {
          const rank = rankData.data.rank || rankData.data;
          setMyRank(rank);

          // 500번 초과면 대기열 모달 표시
          if (rank > 500) {
            setShowQueueModal(true);
          } else {
            setShowQueueModal(false);
          }
        }
      } else {
        setQueueEnabled(false);
        setShowQueueModal(false);
      }
    } catch {
      // 대기열 확인 실패 시 무시 (일반 모드로 동작)
    }
  }, []);

  // 페이지 로드 시 사물함 + 대기열 조회
  useEffect(() => {
    loadLockers();
    checkQueue();
  }, [checkQueue]);

  // 대기열 모달이 열려있을 때 3초마다 순위 폴링
  useEffect(() => {
    if (!showQueueModal) return;

    const interval = setInterval(async () => {
      try {
        const rankRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers/queue/my-rank`);
        const rankData = await rankRes.json();

        if (rankData.success) {
          const rank = rankData.data.rank || rankData.data;
          setMyRank(rank);

          // 500 이하로 떨어지면 모달 닫기 + 사물함 새로고침
          if (rank <= 500) {
            setShowQueueModal(false);
            toast.success("대기가 완료되었습니다! 사물함을 선택해 주세요.");
            await loadLockers();
          }
        }
      } catch {
        // 폴링 실패 시 무시
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showQueueModal]);

  // 사물함 예약
  const handleReserve = async () => {
    if (!selectedLocker) return;

    const locker = lockers.find((l) => l.id === selectedLocker);
    if (!locker || !locker.apiId) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers/reserve`, {
        method: "POST",
        body: JSON.stringify({ lockerId: locker.apiId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`${selectedLocker} 사물함이 예약되었습니다`);
        setSelectedLocker(null);
        await loadLockers();
      } else {
        // L009: 다른 사람이 이미 예약 시도 중
        if (data.code === "L009") {
          toast.error("다른 사람이 이미 예약을 시도 중입니다. 잠시 후 다시 시도해 주세요.");
        } else {
          toast.error(data.message || "예약에 실패했습니다");
        }
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  // 현재 구역 사물함 필터링 + 그리드 매핑
  const lockers = useMemo(() => {
    const zoneLockers = allLockers.filter(
      (l) =>
        l.building === currentBuilding.name && l.floor === currentFloor.number && l.locationDetail === currentZone.name,
    );

    const gridSize = currentZone.rows * currentZone.cols;

    return Array.from({ length: gridSize }, (_, i) => {
      const apiLocker = zoneLockers[i];

      if (apiLocker) {
        return {
          id: apiLocker.lockerNumber,
          num: apiLocker.lockerNumber,
          apiId: apiLocker.id,
          status: mapApiStatus(apiLocker.status),
        };
      }

      return {
        id: `empty-${i}`,
        num: "",
        apiId: null as number | null,
        status: "empty" as LockerStatus,
      };
    });
  }, [allLockers, currentBuilding.name, currentFloor.number, currentZone]);

  // 건물별 잔여석
  const buildingAvailableCounts = useMemo(() => {
    return buildings.map((b) => {
      return allLockers.filter((l) => l.building === b.name && l.status === "NORMAL").length;
    });
  }, [allLockers]);

  // 층별 잔여석
  const floorAvailableCounts = useMemo(() => {
    return currentBuilding.floors.map((floor) => {
      return allLockers.filter(
        (l) => l.building === currentBuilding.name && l.floor === floor.number && l.status === "NORMAL",
      ).length;
    });
  }, [allLockers, currentBuilding]);

  const handleBuildingChange = (idx: number) => {
    setSelectedBuildingIdx(idx);
    setSelectedFloorIdx(0);
    setSelectedZoneIdx(0);
    setSelectedLocker(null);
  };

  const handleFloorChange = (idx: number) => {
    setSelectedFloorIdx(idx);
    setSelectedZoneIdx(0);
    setSelectedLocker(null);
  };

  const handleZoneChange = (idx: number) => {
    setSelectedZoneIdx(idx);
    setSelectedLocker(null);
  };

  const handleLockerClick = (id: string, status: LockerStatus) => {
    if (status === "available") {
      setSelectedLocker(selectedLocker === id ? null : id);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">사물함 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[40px]">⚠️</span>
          <span className="text-[14px] text-[#4e5968]">{error}</span>
          <button
            onClick={() => {
              setError("");
              setIsLoading(true);
              loadLockers();
            }}
            className="mt-2 px-4 py-2 bg-brand text-white text-[13px] font-bold rounded-lg cursor-pointer border-none hover:opacity-90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">사물함 신청</h1>
        <p className="text-[13px] text-gray-400">원하는 층과 구역을 선택한 뒤, 사물함을 골라주세요</p>

        {/* 대기열 모드 ON 안내 배너 */}
        {queueEnabled && myRank <= 500 && (
          <div className="flex items-center gap-2.5 mt-3 px-4 py-3 bg-[#fff8e1] border border-[#ffd43b]/30 rounded-xl">
            <span className="text-base">⚡</span>
            <span className="text-[13px] text-[#e67700] font-semibold">
              대기열 모드 운영 중 · 현재 {myRank}번째 · 동시 접근 시 선착순 예약
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-start max-[900px]:flex-col">
        {/* ===== 좌측: 건물 + 층 선택 ===== */}
        <div className="w-[260px] min-w-[260px] flex flex-col gap-2.5 max-[900px]:w-full max-[900px]:min-w-0">
          {buildings.map((b, idx) => {
            const isActive = selectedBuildingIdx === idx;
            return (
              <button
                key={b.id}
                onClick={() => handleBuildingChange(idx)}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-xl
                  border-2 text-left cursor-pointer font-sans transition-all duration-200
                  ${
                    isActive
                      ? "bg-white border-brand shadow-[0_2px_12px_rgba(74,140,102,0.1)]"
                      : "bg-white border-transparent shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-gray-200"
                  }
                `}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-green-50" : "bg-gray-50"}`}
                >
                  <svg
                    className={`w-5 h-5 ${isActive ? "text-brand" : "text-gray-400"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className={`block text-sm font-extrabold ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                    {b.name}
                  </span>
                  <span className="block text-[11px] text-gray-400">
                    {b.floors.length}개 층 {b.floors.reduce((a, f) => a + f.zones.length, 0)}개 구역
                  </span>
                </div>
                <div className="text-right">
                  <span className={`block text-lg font-black ${isActive ? "text-brand" : "text-gray-400"}`}>
                    {buildingAvailableCounts[idx]}
                  </span>
                  <span className="block text-[10px] text-gray-300">잔여석</span>
                </div>
              </button>
            );
          })}

          <div className="border-t border-gray-100 pt-2.5 mt-1">
            {currentBuilding.floors.map((floor, idx) => {
              const isSelected = selectedFloorIdx === idx;
              return (
                <button
                  key={floor.number}
                  onClick={() => handleFloorChange(idx)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl mb-1
                    border-2 text-left cursor-pointer font-sans transition-all duration-200
                    ${isSelected ? "bg-white border-brand/50 shadow-sm" : "bg-white border-transparent hover:bg-gray-50"}
                  `}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-black ${isSelected ? "bg-brand text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {floor.number}F
                  </div>
                  <div className="flex-1">
                    <span className={`block text-[13px] font-bold ${isSelected ? "text-gray-900" : "text-gray-500"}`}>
                      {floor.label}
                    </span>
                    <span className="block text-[11px] text-gray-300">
                      {floor.zones.map((z) => z.name).join(" / ")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`block text-sm font-black ${isSelected ? "text-brand" : "text-gray-400"}`}>
                      {floorAvailableCounts[idx]}
                    </span>
                    <span className="block text-[10px] text-gray-300">잔여석</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== 우측: 사물함 그리드 ===== */}
        <div className="flex-1 min-w-0 bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">사물함 선택</h2>

          <div className="flex gap-2 mb-3 flex-wrap">
            {currentFloor.zones.map((zone, idx) => {
              const isActive = selectedZoneIdx === idx;
              const avail = allLockers.filter(
                (l) =>
                  l.building === currentBuilding.name &&
                  l.floor === currentFloor.number &&
                  l.locationDetail === zone.name &&
                  l.status === "NORMAL",
              ).length;

              return (
                <button
                  key={zone.name}
                  onClick={() => handleZoneChange(idx)}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg
                    text-[13px] font-semibold border cursor-pointer font-sans transition-colors duration-150
                    ${
                      isActive
                        ? "bg-brand text-white border-brand"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  {zone.name}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-gray-100 text-gray-400"}`}
                  >
                    {avail}석
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3.5 mb-3 flex-wrap">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <div className={`w-2.5 h-2.5 rounded-sm ${item.dotColor}`} />
                {item.label}
              </div>
            ))}
          </div>

          <p className="text-[12px] text-gray-400 mb-2.5">
            {currentFloor.label} {currentZone.name} · 총 {lockers.filter((l) => l.status !== "empty").length}칸
          </p>

          {/* 사물함 그리드 */}
          <div className="overflow-x-auto overflow-y-auto max-h-[420px] mb-4">
            <div className="grid gap-1 w-fit p-1" style={{ gridTemplateColumns: `repeat(${currentZone.cols}, 68px)` }}>
              {lockers.map((locker) => {
                if (locker.status === "empty") {
                  return <div key={locker.id} className="w-[68px] h-[68px]" />;
                }

                const isSelected = selectedLocker === locker.id;
                const displayStatus = isSelected ? "selected" : locker.status;
                const cfg = statusConfig[displayStatus];
                const isClickable = locker.status === "available" || isSelected;

                return (
                  <button
                    key={locker.id}
                    onClick={() => handleLockerClick(locker.id, locker.status)}
                    disabled={!isClickable}
                    className={`
                      w-[68px] h-[68px] rounded-md flex flex-col items-center justify-center
                      border-none font-sans transition-all duration-150
                      ${cfg.bg} ${!isClickable ? "cursor-not-allowed" : ""}
                    `}
                  >
                    <span className="text-[10px] font-bold leading-tight">{locker.num}</span>
                    {isSelected && <span className="text-[8px] font-semibold leading-none">선택</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 하단 */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-gray-400">선택한 사물함</span>
              {selectedLocker ? (
                <>
                  <span className="text-sm font-bold text-brand bg-green-50 px-3 py-1 rounded-lg">
                    {selectedLocker}
                  </span>
                  <span className="text-[12px] text-gray-400">
                    {currentBuilding.name} {currentFloor.label} {currentZone.name}
                  </span>
                </>
              ) : (
                <span className="text-[13px] text-gray-300">사물함을 선택해 주세요</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLocker(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-500 bg-white cursor-pointer font-sans hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReserve}
                disabled={!selectedLocker}
                className={`
                  px-5 py-2 border-none rounded-lg text-[13px] font-bold font-sans transition-all duration-200
                  ${
                    selectedLocker
                      ? "bg-brand text-white cursor-pointer hover:bg-brand-dark"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                이 사물함 신청하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 대기열 모달 */}
      <QueueWaitingModal isOpen={showQueueModal} rank={myRank} onClose={() => setShowQueueModal(false)} />
    </div>
  );
}
