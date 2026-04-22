"use client";

import { useState } from "react";
import type { RequestItem, RequestCategory, RequestStatus } from "./type";
import RequestList from "./_component/RequestList";
import NewRequestForm from "./_component/NewRequestForm";
import RequestDetailModal from "./_component/RequestDetailModal";

type TabType = "전체" | RequestCategory | "완료";

const MOCK_REQUESTS: RequestItem[] = [
  {
    id: "C325",
    title: "사물함 잠금장치 고장",
    description: "3A-05 사물함 비밀번호 잠금장치가 작동하지 않아 열 수가 없습니다. 확인 부탁드립니다.",
    category: "수리 요청",
    lockerId: "3A-05",
    building: "새천년관",
    location: "3층 A구역",
    createdAt: "2026.03.24",
    status: "접수대기",
    content:
      "사물함 비밀번호 잠금장치가 풀리지 않아 열 수가 없습니다. 어제부터 비밀번호를 정확히 입력해도 잠금이 풀리지 않는 상태입니다. 내부에 노트북 충전기와 교재가 있어서 빠른 확인 부탁드립니다.",
  },
  {
    id: "C312",
    title: "사물함 문 경첩 파손",
    description: "사물함 문이 제대로 닫히지 않고 경첩 부분이 느슨합니다.",
    category: "수리 요청",
    lockerId: "3A-07",
    building: "새천년관",
    location: "3층 A구역",
    createdAt: "2026.03.12",
    status: "처리중",
    content: "사물함 문이 제대로 닫히지 않고 경첩 부분이 느슨합니다. 물건이 떨어질 위험이 있어 수리 부탁드립니다.",
  },
  {
    id: "C308",
    title: "자리 이동 요청",
    description: "같은 층 B구역으로 자리 이동을 희망합니다. 수업 동선 때문에 B구역이 더 편합니다.",
    category: "자리 이동",
    lockerId: "3A-04",
    building: "새천년관",
    location: "3층 A구역",
    createdAt: "2026.03.08",
    status: "접수대기",
    content: "같은 층 B구역으로 자리 이동을 희망합니다. 수업 동선 때문에 B구역이 더 편합니다.",
  },
  {
    id: "C303",
    title: "개인 물품 분실 신고",
    description: "사물함 주변에서 에어팟을 분실했습니다. 습득을 확인 부탁드립니다.",
    category: "문의",
    lockerId: "3A-02",
    building: "새천년관",
    location: "3층 A구역",
    createdAt: "2026.02.28",
    status: "처리완료",
    content: "사물함 주변에서 에어팟을 분실했습니다. 습득을 확인 부탁드립니다.",
  },
];

const tabs: { label: TabType }[] = [
  { label: "전체" },
  { label: "수리 요청" },
  { label: "자리 이동" },
  { label: "문의" },
  { label: "완료" },
];

export default function SupportPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedRequest = requests.find((r) => r.id === selectedId) || null;

  // 탭 필터링
  const filtered = (() => {
    if (activeTab === "전체") return requests;
    if (activeTab === "완료") return requests.filter((r) => r.status === "처리완료");
    return requests.filter((r) => r.category === activeTab);
  })();

  // 탭별 카운트
  const counts: Record<TabType, number> = {
    전체: requests.length,
    "수리 요청": requests.filter((r) => r.category === "수리 요청").length,
    "자리 이동": requests.filter((r) => r.category === "자리 이동").length,
    문의: requests.filter((r) => r.category === "문의").length,
    완료: requests.filter((r) => r.status === "처리완료").length,
  };

  // 새 요청 접수
  const handleNewRequest = (data: { category: RequestCategory; lockerId: string; title: string; content: string }) => {
    const newReq: RequestItem = {
      id: `C${String(Date.now()).slice(-3)}`,
      title: data.title,
      description: data.content.slice(0, 60),
      category: data.category,
      lockerId: data.lockerId,
      building: "새천년관",
      location: "3층 A구역",
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      status: "접수대기",
      content: data.content,
    };
    setRequests((prev) => [newReq, ...prev]);
    setShowForm(false);
  };

  // 요청 취소
  const handleCancel = (id: string) => {
    if (!confirm("이 요청을 취소하시겠습니까?")) return;
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setSelectedId(null);
  };

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
        <RequestList requests={filtered} onSelect={setSelectedId} />
        {showForm && <NewRequestForm onSubmit={handleNewRequest} onClose={() => setShowForm(false)} />}
      </div>

      {/* 상세 모달 */}
      {selectedRequest && (
        <RequestDetailModal request={selectedRequest} onClose={() => setSelectedId(null)} onCancel={handleCancel} />
      )}
    </div>
  );
}
