"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import type { StudentApiItem } from "./type";
import StudentStats from "./_component/StudentStats";
import StudentSearch from "./_component/StudentFilter";
import StudentTable from "./_component/StudentTable";
import StudentDetail from "./_component/StudentDetail";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedStudent = students.find((s) => s.userId === selectedId) || null;

  // 학생 목록 조회
  const loadStudents = async (query?: { name: string; studentNumber: string }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query?.name) params.set("name", query.name);
      if (query?.studentNumber) params.set("studentNumber", query.studentNumber);

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users${queryStr}`);
      const data = await res.json();

      if (data.success) {
        setStudents(data.data);
        setSelectedId(null);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  if (isLoading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">학생 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">학생 관리</h1>
        <p className="text-[13px] text-gray-400">전체 학생 목록과 사물함 이용 현황을 확인할 수 있습니다.</p>
      </div>

      <StudentStats students={students} />

      <StudentSearch onSearch={loadStudents} />

      <div className="grid grid-cols-[1fr_380px] gap-5 items-start max-[1000px]:grid-cols-1">
        <StudentTable students={students} selectedId={selectedId} onSelect={setSelectedId} />
        {selectedStudent && <StudentDetail student={selectedStudent} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  );
}
