"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import toast from "react-hot-toast";
import type { LockerApiItem, LockerStatus } from "./_component/type";
import { getDisplayStatus } from "./_component/type";
import LockerFilter from "./_component/LockerFilter";
import LockerTable from "./_component/LockerTable";
import LockerDetail from "./_component/LockerDetail";
import LockerAddModal from "./_component/LockerAddModal";

type Filter = { building: string; floor: string; search: string };

export default function LockerManagementPage() {
  const [lockers, setLockers] = useState<LockerApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>({ building: "", floor: "", search: "" });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedLocker = lockers.find((l) => l.lockerId === selectedId) || null;

  const loadLockers = async (f: Filter = filter) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.building) params.set("building", f.building);
      if (f.floor) params.set("floor", f.floor);
      if (f.search) params.set("search", f.search);

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers${queryStr}`);
      const data = await res.json();

      if (data.success) {
        setLockers(data.data);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLockers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (f: Filter) => {
    setFilter(f);
    setCheckedIds(new Set());
    loadLockers(f);
  };

  const handleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCheckAll = () => {
    if (checkedIds.size === lockers.length) setCheckedIds(new Set());
    else setCheckedIds(new Set(lockers.map((l) => l.lockerId)));
  };

  // 사물함 추가
  const handleAdd = async (data: { building: string; floor: number; locationDetail: string; lockerNumber: string }) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("사물함이 추가되었습니다");
        setIsAddModalOpen(false);
        await loadLockers();
      } else {
        toast.error(result.message || "사물함 추가에 실패했습니다");
      }
    } catch {
      toast.error("사물함 추가에 실패했습니다");
    }
  };

  // 단일 사물함 상태 변경
  const handleStatusChange = async (lockerId: number, status: LockerStatus) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers/${lockerId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("상태가 변경되었습니다");
        await loadLockers();
      } else {
        toast.error(data.message || "상태 변경에 실패했습니다");
      }
    } catch {
      toast.error("상태 변경에 실패했습니다");
    }
  };

  // 사용자 변경 (기존 예약은 자동 반납)
  const handleAssign = async (lockerId: number, studentNumber: string) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers/${lockerId}/assign`, {
        method: "POST",
        body: JSON.stringify({ studentNumber }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("사용자가 변경되었습니다");
        await loadLockers();
      } else {
        toast.error(data.message || "사용자 변경에 실패했습니다");
      }
    } catch {
      toast.error("사용자 변경에 실패했습니다");
    }
  };

  // 단일 강제 반납
  const handleForceReturn = async (lockerId: number) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers/${lockerId}/force-return`,
        { method: "POST" }
      );
      const data = await res.json();

      if (data.success) {
        toast.success("강제 반납되었습니다");
        await loadLockers();
      } else {
        toast.error(data.message || "강제 반납에 실패했습니다");
      }
    } catch {
      toast.error("강제 반납에 실패했습니다");
    }
  };

  // 일괄 상태 변경
  const handleBulkStatus = async (status: LockerStatus) => {
    if (checkedIds.size === 0) return;
    if (!confirm(`선택한 ${checkedIds.size}개 사물함의 상태를 변경하시겠습니까?`)) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers/bulk/status`, {
        method: "PATCH",
        body: JSON.stringify({ lockerIds: Array.from(checkedIds), status }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("상태가 변경되었습니다");
        setCheckedIds(new Set());
        await loadLockers();
      } else {
        toast.error(data.message || "상태 변경에 실패했습니다");
      }
    } catch {
      toast.error("상태 변경에 실패했습니다");
    }
  };

  // 일괄 강제 반납
  const handleBulkForceReturn = async () => {
    if (checkedIds.size === 0) return;
    if (!confirm(`선택한 ${checkedIds.size}개 사물함을 강제 반납 처리하시겠습니까?`)) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/lockers/bulk/force-return`, {
        method: "POST",
        body: JSON.stringify({ lockerIds: Array.from(checkedIds), status: "NORMAL" }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("강제 반납되었습니다");
        setCheckedIds(new Set());
        await loadLockers();
      } else {
        toast.error(data.message || "강제 반납에 실패했습니다");
      }
    } catch {
      toast.error("강제 반납에 실패했습니다");
    }
  };

  const stats = {
    available: lockers.filter((l) => getDisplayStatus(l) === "available").length,
    inUse: lockers.filter((l) => getDisplayStatus(l) === "inUse").length,
    broken: lockers.filter((l) => getDisplayStatus(l) === "broken").length,
    disabled: lockers.filter((l) => getDisplayStatus(l) === "disabled").length,
  };

  if (isLoading && lockers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">사물함 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">사물함 관리</h1>
          <p className="text-[13px] text-gray-400">
            새천년관·정보과학관의 사물함 상태를 관리하고, 사용자를 조회·변경할 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="
          flex items-center gap-1.5
          bg-brand-dark text-white text-[13px] font-bold
          px-5 py-2.5 rounded-[10px] border-none
          cursor-pointer font-sans whitespace-nowrap
          hover:bg-[#155a32] transition-colors
        "
        >
          + 사물함 추가
        </button>
      </div>

      {/* 필터 */}
      <LockerFilter stats={stats} onFilterChange={handleFilterChange} />

      {/* 테이블 + 디테일 패널 */}
      <div className="flex gap-5 items-start max-[1000px]:flex-col">
        {/* 왼쪽: 테이블 + 하단 바 */}
        <div className="flex-1 min-w-0 flex flex-col">
          <LockerTable
            lockers={lockers}
            selectedId={selectedId}
            checkedIds={checkedIds}
            onSelect={setSelectedId}
            onCheck={handleCheck}
            onCheckAll={handleCheckAll}
          />

          {/* 하단 일괄 작업 바 */}
          <div
            className="
            flex items-center justify-between flex-wrap gap-2
            bg-white rounded-b-2xl border-t border-gray-100
            px-5 py-3
          "
          >
            <span className="text-[13px] font-semibold text-gray-500">{checkedIds.size}개 선택됨</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBulkStatus("NORMAL")}
                disabled={checkedIds.size === 0}
                className="text-xs font-semibold px-3.5 py-1.5 border rounded-lg bg-transparent cursor-pointer font-sans whitespace-nowrap transition-colors text-gray-500 border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ✓ 일괄 활성화
              </button>
              <button
                onClick={() => handleBulkStatus("BROKEN")}
                disabled={checkedIds.size === 0}
                className="text-xs font-semibold px-3.5 py-1.5 border rounded-lg bg-transparent cursor-pointer font-sans whitespace-nowrap transition-colors text-gray-500 border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🔧 일괄 고장 처리
              </button>
              <button
                onClick={() => handleBulkStatus("DISABLED")}
                disabled={checkedIds.size === 0}
                className="text-xs font-semibold px-3.5 py-1.5 border rounded-lg bg-transparent cursor-pointer font-sans whitespace-nowrap transition-colors text-gray-500 border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🚫 일괄 비활성화
              </button>
              <button
                onClick={handleBulkForceReturn}
                disabled={checkedIds.size === 0}
                className="text-xs font-semibold px-3.5 py-1.5 border rounded-lg bg-transparent cursor-pointer font-sans whitespace-nowrap transition-colors text-red-500 border-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ✕ 일괄 강제 반납
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 디테일 패널 */}
        {selectedLocker && (
          <LockerDetail
            locker={selectedLocker}
            onClose={() => setSelectedId(null)}
            onStatusChange={handleStatusChange}
            onAssign={handleAssign}
            onForceReturn={handleForceReturn}
          />
        )}
      </div>

      {/* 추가 모달 */}
      <LockerAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAdd} />
    </div>
  );
}
