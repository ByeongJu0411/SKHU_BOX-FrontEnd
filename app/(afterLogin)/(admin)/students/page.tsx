"use client";

import { useState } from "react";
import type { StudentItem } from "./type";
import StudentStats from "./_component/StudentStats";
import StudentFilter from "./_component/StudentFilter";
import StudentTable from "./_component/StudentTable";
import StudentDetail from "./_component/StudentDetail";

const MOCK_STUDENTS: StudentItem[] = [
  {
    id: "1",
    name: "이병주",
    email: "20211234@office.skhu.ac.kr",
    studentId: "20211234",
    dept: "소프트웨어공학과",
    grade: 4,
    lockerId: "3A-05",
    building: "새천년관",
    location: "3층 A구역",
    status: "이용중",
    startDate: "03.02",
    endDate: "06.30",
    dDay: "D-97",
    complaintCount: 2,
  },
  {
    id: "2",
    name: "김도현",
    email: "20220134@office.skhu.ac.kr",
    studentId: "20220134",
    dept: "IT융합자율학부",
    grade: 3,
    lockerId: "3A-02",
    building: "새천년관",
    location: "3층 A구역",
    status: "이용중",
    startDate: "03.02",
    endDate: "06.30",
    dDay: "D-97",
    complaintCount: 0,
  },
  {
    id: "3",
    name: "박서연",
    email: "20230456@office.skhu.ac.kr",
    studentId: "20230456",
    dept: "소프트웨어공학과",
    grade: 2,
    lockerId: "3A-04",
    building: "새천년관",
    location: "3층 A구역",
    status: "만료임박",
    startDate: "03.02",
    endDate: "04.01",
    dDay: "D-7 임박",
    complaintCount: 1,
  },
  {
    id: "4",
    name: "정하늘",
    email: "20240789@office.skhu.ac.kr",
    studentId: "20240789",
    dept: "글로벌융합학부",
    grade: 1,
    lockerId: "M2A-11",
    building: "새천년관",
    location: "2층 A구역",
    status: "이용중",
    startDate: "03.05",
    endDate: "06.30",
    dDay: "D-97",
    complaintCount: 1,
  },
  {
    id: "5",
    name: "송민지",
    email: "20211567@office.skhu.ac.kr",
    studentId: "20211567",
    dept: "영어학과",
    grade: 4,
    lockerId: "2B-11",
    building: "새천년관",
    location: "2층 B구역",
    status: "이용중",
    startDate: "03.01",
    endDate: "06.30",
    dDay: "D-97",
    complaintCount: 0,
  },
  {
    id: "6",
    name: "최유진",
    email: "20231092@office.skhu.ac.kr",
    studentId: "20231092",
    dept: "정보과학과",
    grade: 2,
    lockerId: "—",
    building: "—",
    location: "—",
    status: "이용중",
    startDate: "—",
    endDate: "—",
    dDay: "—",
    complaintCount: 0,
  },
  {
    id: "7",
    name: "한지민",
    email: "20210876@office.skhu.ac.kr",
    studentId: "20210876",
    dept: "IT융합자율학부",
    grade: 4,
    lockerId: "1A-03",
    building: "정보과학관",
    location: "1층 A구역",
    status: "만료임박",
    startDate: "03.01",
    endDate: "04.02",
    dDay: "D-8 임박",
    complaintCount: 0,
  },
  {
    id: "8",
    name: "윤서준",
    email: "20220543@office.skhu.ac.kr",
    studentId: "20220543",
    dept: "IT융합자율학부",
    grade: 3,
    lockerId: "2A-07",
    building: "새천년관",
    location: "2층 A구역",
    status: "이용중",
    startDate: "03.03",
    endDate: "06.30",
    dDay: "D-97",
    complaintCount: 0,
  },
];

const PAGE_SIZE = 8;

export default function StudentManagementPage() {
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(["1"]));
  const [activeTab, setActiveTab] = useState<"전체" | "만료임박">("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const selectedStudent = MOCK_STUDENTS.find((s) => s.id === selectedId) || null;

  // 사물함 보유 학생만 (미보유 제외)
  const withLocker = MOCK_STUDENTS.filter((s) => s.lockerId !== "—");

  // 탭 필터
  const filtered = activeTab === "전체" ? withLocker : withLocker.filter((s) => s.dDay.includes("임박"));

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const counts = {
    전체: withLocker.length,
    만료임박: withLocker.filter((s) => s.dDay.includes("임박")).length,
  };

  const stats = {
    total: MOCK_STUDENTS.length,
    withLocker: withLocker.length,
    expiringSoon: withLocker.filter((s) => s.dDay.includes("임박")).length,
  };

  const handleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCheckAll = () => {
    if (checkedIds.size === paginated.length) setCheckedIds(new Set());
    else setCheckedIds(new Set(paginated.map((s) => s.id)));
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">학생 관리</h1>
        <p className="text-[13px] text-gray-400">사물함을 보유한 학생들의 이용 현황을 관리합니다.</p>
      </div>

      {/* 통계 */}
      <StudentStats total={stats.total} withLocker={stats.withLocker} expiringSoon={stats.expiringSoon} />

      {/* 필터 */}
      <StudentFilter activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      {/* 테이블 + 디테일 */}
      <div className="flex gap-5 items-start max-[1000px]:flex-col">
        <div className="flex-1 min-w-0 flex flex-col">
          <StudentTable
            students={paginated}
            selectedId={selectedId}
            checkedIds={checkedIds}
            onSelect={setSelectedId}
            onCheck={handleCheck}
            onCheckAll={handleCheckAll}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {selectedStudent && <StudentDetail student={selectedStudent} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  );
}
