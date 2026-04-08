"use client";

import { useState } from "react";
import type { ComplaintItem, ComplaintStatus } from "./type";
import ComplaintStats from "./_component/Complaintstats";
import ComplaintFilter from "./_component/Complaintfilter";
import ComplaintList from "./_component/Complaintlist";
import ComplaintDetail from "./_component/Complaintdetail";

const MOCK_COMPLAINTS: ComplaintItem[] = [
  {
    id: "C025",
    title: "사물함 잠금장치 고장",
    description: "비밀번호 잠금장치가 작동하지 않아 열 수 없습니다.",
    category: "고장",
    userName: "이병주",
    userDept: "소프트웨어공학과",
    userStudentId: "20211234",
    lockerId: "3A-05",
    building: "새천년관",
    location: "3층 A구역",
    createdAt: "2026.03.24",
    timeAgo: "1일 전",
    status: "대기중",
    content:
      "3A-05 사물함 비밀번호 잠금장치가 작동하지 않아 열 수가 없습니다. 어제부터 비밀번호를 정확히 입력해도 잠금이 풀리지 않는 상태입니다. 내부에 노트북 충전기와 교재가 있어서 빠른 확인 부탁드립니다.",
  },
  {
    id: "C022",
    title: "자리 이동 요청",
    description: "같은 층 B구역에서 A 이동 희망합니다.",
    category: "이동 요청",
    userName: "김지은",
    userDept: "IT융합자율학부",
    userStudentId: "20220876",
    lockerId: "2B-03",
    building: "새천년관",
    location: "2층 B구역",
    createdAt: "2026.03.21",
    timeAgo: "3일 전",
    status: "대기중",
    content:
      "현재 2B-03 사물함을 사용 중인데, 수업 동선상 A구역이 더 편해서 이동을 요청드립니다. 2A 구역에 빈 사물함이 있다면 변경 부탁드립니다.",
  },
  {
    id: "C018",
    title: "문 경첩 파손",
    description: "사물함 문이 제대로 닫히지 않습니다.",
    category: "파손",
    userName: "정하늘",
    userDept: "글로벌융합학부",
    userStudentId: "20241789",
    lockerId: "M2A-11",
    building: "새천년관",
    location: "2층 A구역",
    createdAt: "2026.03.18",
    timeAgo: "5일 전",
    status: "처리중",
    content: "사물함 문 경첩이 파손되어 문이 완전히 닫히지 않습니다. 물건이 떨어질 위험이 있어 빠른 수리 부탁드립니다.",
  },
  {
    id: "C023",
    title: "사물함 연장 신청 문의",
    description: "이동학기에도 같은 사물함을 이용할 수 있나요?",
    category: "문의",
    userName: "박서연",
    userDept: "소프트웨어공학과",
    userStudentId: "20230466",
    lockerId: "3A-04",
    building: "새천년관",
    location: "3층 A구역",
    createdAt: "2026.03.22",
    timeAgo: "2일 전",
    status: "확인중",
    content: "현재 3A-04 사물함을 사용 중인데, 다음 학기에도 같은 사물함을 계속 이용할 수 있는지 문의드립니다.",
  },
  {
    id: "C012",
    title: "사물함 내부 누수 발생",
    description: "사물함 내부 하단에 물이 새서 물건이 오염됩니다.",
    category: "누수",
    userName: "송민지",
    userDept: "영어학과",
    userStudentId: "20211567",
    lockerId: "3B-11",
    building: "새천년관",
    location: "3층 B구역",
    createdAt: "2026.03.15",
    timeAgo: "1주 전",
    status: "처리중",
    content: "사물함 내부 하단에 물이 새고 있습니다. 물건이 젖어 오염되고 있어 긴급 수리가 필요합니다.",
  },
  {
    id: "C008",
    title: "비밀번호 분실 대처 방법",
    description: "자물쇠 비밀번호를 잊어버렸어요.",
    category: "문의",
    userName: "최유정",
    userDept: "정보과학과",
    userStudentId: "20220345",
    lockerId: "1A-02",
    building: "정보과학관",
    location: "1층 A구역",
    createdAt: "2026.03.10",
    timeAgo: "2주 전",
    status: "완료",
    content: "자물쇠 비밀번호를 잊어버렸습니다. 초기화하거나 재설정하는 방법이 있을까요?",
  },
];

export default function ComplaintManagementPage() {
  const [selectedId, setSelectedId] = useState<string | null>("C025");
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [activeTab, setActiveTab] = useState<ComplaintStatus | "전체">("전체");

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || null;

  const handleStatusChange = (id: string, newStatus: ComplaintStatus) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  // 필터링
  const filtered = activeTab === "전체" ? complaints : complaints.filter((c) => c.status === activeTab);

  // 탭별 카운트
  const counts: Record<string, number> = {
    전체: complaints.length,
    대기중: complaints.filter((c) => c.status === "대기중").length,
    확인중: complaints.filter((c) => c.status === "확인중").length,
    처리중: complaints.filter((c) => c.status === "처리중").length,
    완료: complaints.filter((c) => c.status === "완료").length,
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">민원 관리</h1>
        <p className="text-[13px] text-gray-400">학생들의 수리 요청, 자리 이동, 문의를 확인하고 답변할 수 있습니다.</p>
      </div>

      {/* 통계 */}
      <ComplaintStats />

      {/* 필터 */}
      <ComplaintFilter activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      {/* 목록 + 상세 */}
      <div className="grid grid-cols-[minmax(300px,1fr)_minmax(400px,1.5fr)] gap-5 items-start max-[900px]:grid-cols-1">
        <ComplaintList complaints={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        {selectedComplaint && <ComplaintDetail complaint={selectedComplaint} onStatusChange={handleStatusChange} />}
      </div>
    </div>
  );
}
