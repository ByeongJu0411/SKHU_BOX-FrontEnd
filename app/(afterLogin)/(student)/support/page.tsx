"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import toast from "react-hot-toast";
import type { ComplaintApiItem, RequestItem, RequestStatus } from "./type";
import RequestList from "./_component/RequestList";
import NewRequestForm from "./_component/NewRequestForm";
import RequestDetailModal from "./_component/RequestDetailModal";
import type { LockerApiItem } from "../apply/config";

// 백엔드 status → 프론트 status 매핑
function mapApiStatus(apiStatus: string): RequestStatus {
  switch (apiStatus) {
    case "PENDING":
      return "접수대기";
    case "IN_PROGRESS":
      return "처리중";
    case "RESOLVED":
      return "처리완료";
    default:
      return "접수대기";
  }
}

// ISO 날짜 → 표시용 포맷
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// API 응답 → 프론트 타입 변환
function toRequestItem(api: ComplaintApiItem): RequestItem {
  return {
    id: api.id,
    lockerNumber: api.lockerNumber,
    content: api.content,
    answer: api.answer,
    status: mapApiStatus(api.status),
    createdAt: formatDate(api.createdAt),
  };
}

type TabType = "전체" | "접수대기" | "처리중" | "처리완료";

const tabs: { label: TabType }[] = [
  { label: "전체" },
  { label: "접수대기" },
  { label: "처리중" },
  { label: "처리완료" },
];

export default function SupportPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [showForm, setShowForm] = useState(false);
  const [myLockerNumber, setMyLockerNumber] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);

  // 민원 목록 조회
  const loadComplaints = async () => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints/my`);
      const data = await res.json();

      if (data.success) {
        setRequests(data.data.map(toRequestItem));
      }
      // 내 사물함 번호 조회
      const lockerRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/lockers`);
      const lockerData = await lockerRes.json();
      if (lockerData.success) {
        const myLocker = lockerData.data.find((l: LockerApiItem) => l.status === "ACTIVE");
        if (myLocker) setMyLockerNumber(myLocker.lockerNumber);
      }
    } catch {
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // 탭 필터링
  const filtered = (() => {
    if (activeTab === "전체") return requests;
    return requests.filter((r) => r.status === activeTab);
  })();

  // 탭별 카운트
  const counts: Record<TabType, number> = {
    전체: requests.length,
    접수대기: requests.filter((r) => r.status === "접수대기").length,
    처리중: requests.filter((r) => r.status === "처리중").length,
    처리완료: requests.filter((r) => r.status === "처리완료").length,
  };

  // 새 요청 접수
  const handleNewRequest = async (data: { lockerNumber: string; content: string }) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints`, {
        method: "POST",
        body: JSON.stringify({
          lockerNumber: data.lockerNumber,
          content: data.content,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("민원이 접수되었습니다");
        setShowForm(false);
        await loadComplaints();
      } else {
        toast.error(result.message || "민원 접수에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  const handleSelect = async (id: number) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints/${id}`);
      const data = await res.json();

      if (data.success) {
        setSelectedRequest(toRequestItem(data.data));
      } else {
        toast.error("민원 상세를 불러올 수 없습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("이 민원을 취소하시겠습니까?")) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("민원이 취소되었습니다");
        setSelectedRequest(null);
        await loadComplaints();
      } else {
        toast.error(data.message || "민원 취소에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">민원 내역을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">고객센터</h1>
          <p className="text-[13px] text-gray-400">사물함 관련 문의, 수리 요청, 자리 이동을 접수할 수 있습니다.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="
            flex items-center gap-1.5
            bg-brand-dark text-white text-[13px] font-bold
            px-5 py-2.5 rounded-[10px] border-none
            cursor-pointer font-sans whitespace-nowrap
            hover:bg-[#155a32] transition-colors
          "
        >
          새 요청 접수
        </button>
      </div>

      {/* 탭 필터 */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`
                flex items-center gap-1.5 text-[13px] font-semibold
                px-3.5 py-1.5 rounded-lg border-none cursor-pointer font-sans transition-colors
                ${isActive ? "text-brand border-b-2 border-brand" : "text-gray-400"}
              `}
            >
              {tab.label}
              <span
                className={`
                text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                ${isActive ? "bg-brand text-white" : "bg-gray-100 text-gray-400"}
              `}
              >
                {counts[tab.label]}
              </span>
            </button>
          );
        })}
      </div>

      {/* 리스트 + (폼) */}
      <div className="flex gap-4 items-start max-[900px]:flex-col">
        <RequestList requests={filtered} onSelect={handleSelect} />
        {showForm && (
          <NewRequestForm
            defaultLockerNumber={myLockerNumber}
            onSubmit={handleNewRequest}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>

      {/* 상세 모달 */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
