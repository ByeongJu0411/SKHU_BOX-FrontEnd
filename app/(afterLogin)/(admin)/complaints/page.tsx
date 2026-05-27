"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import toast from "react-hot-toast";
import type { ComplaintApiItem, ComplaintItem, ComplaintStatus } from "./type";
import ComplaintStats from "./_component/Complaintstats";
import ComplaintFilter from "./_component/Complaintfilter";
import ComplaintList from "./_component/Complaintlist";
import ComplaintDetail from "./_component/Complaintdetail";

// 백엔드 status → 프론트 status 매핑
function mapApiStatus(apiStatus: string): ComplaintStatus {
  switch (apiStatus) {
    case "PENDING":
    case "대기중":
      return "대기중";
    case "CONFIRMED":
    case "확인중":
      return "확인중";
    case "IN_PROGRESS":
    case "처리중":
      return "처리중";
    case "RESOLVED":
    case "완료":
      return "완료";
    default:
      return "대기중";
  }
}

// 프론트 status → 백엔드 status 매핑
function toApiStatus(status: ComplaintStatus): string {
  return status; // 이미 한글이니까 그대로 전송
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function toComplaintItem(api: ComplaintApiItem): ComplaintItem {
  return {
    id: api.id,
    studentNumber: api.studentNumber,
    lockerNumber: api.lockerNumber,
    content: api.content,
    answer: api.answer,
    status: mapApiStatus(api.status),
    createdAt: formatDate(api.createdAt),
  };
}

type TabType = ComplaintStatus | "전체";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || null;

  // 전체 민원 조회
  const loadComplaints = async () => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/complaints`);
      const data = await res.json();
      if (data.success) {
        console.log(
          "백엔드 원본:",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.data.map((c: any) => ({ id: c.id, status: c.status })),
        );
        setComplaints(data.data.map(toComplaintItem));
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // 민원 답변 및 상태 변경
  const handleStatusChange = async (id: number, status: ComplaintStatus, answer: string) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/complaints/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: toApiStatus(status),
          answer: answer || "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("민원이 업데이트되었습니다");
        // 목록 재조회 후 선택 해제 → 재선택으로 강제 리렌더
        await loadComplaints();
        setSelectedId(null);
        setTimeout(() => setSelectedId(id), 0);
      } else {
        toast.error(data.message || "업데이트에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  // 탭 필터링
  const filtered = activeTab === "전체" ? complaints : complaints.filter((c) => c.status === activeTab);

  // 탭별 카운트
  const counts: Record<string, number> = {
    전체: complaints.length,
    대기중: complaints.filter((c) => c.status === "대기중").length,
    확인중: complaints.filter((c) => c.status === "확인중").length,
    처리중: complaints.filter((c) => c.status === "처리중").length,
    완료: complaints.filter((c) => c.status === "완료").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">민원 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">민원 관리</h1>
        <p className="text-[13px] text-gray-400">학생들의 수리 요청, 자리 이동, 문의를 확인하고 답변할 수 있습니다.</p>
      </div>

      <ComplaintStats counts={counts} />

      <ComplaintFilter activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      <div className="grid grid-cols-[minmax(300px,1fr)_minmax(400px,1.5fr)] gap-5 items-start max-[900px]:grid-cols-1">
        <ComplaintList complaints={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        {selectedComplaint && (
          <ComplaintDetail
            key={`${selectedComplaint.id}-${selectedComplaint.status}-${selectedComplaint.answer}`}
            complaint={selectedComplaint}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
