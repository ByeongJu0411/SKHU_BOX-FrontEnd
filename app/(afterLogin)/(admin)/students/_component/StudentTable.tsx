import type { StudentApiItem } from "../type";
import { formatDate } from "../type";

interface StudentTableProps {
  students: StudentApiItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function StudentTable({ students, selectedId, onSelect }: StudentTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100">
        <span className="text-sm font-extrabold text-gray-900">학생 목록</span>
        <span className="text-[11px] text-gray-400">총 {students.length}명</span>
      </div>

      {/* 테이블 헤더 */}
      <div className="grid grid-cols-[1fr_1fr_1.2fr_1fr_0.8fr_0.8fr] gap-3 px-6 py-2.5 border-b border-gray-50 text-[11px] font-semibold text-gray-400 max-[800px]:hidden">
        <span>이름</span>
        <span>학번</span>
        <span>학부</span>
        <span>사물함</span>
        <span>역할</span>
        <span>가입일</span>
      </div>

      {/* 목록 */}
      <div className="max-h-[480px] overflow-y-auto">
        {students.length === 0 ? (
          <p className="text-[13px] text-gray-300 text-center py-10">검색 결과가 없습니다.</p>
        ) : (
          students.map((s) => {
            const isSelected = selectedId === s.userId;
            return (
              <div
                key={s.userId}
                onClick={() => onSelect(s.userId)}
                className={`
                  grid grid-cols-[1fr_1fr_1.2fr_1fr_0.8fr_0.8fr] gap-3 items-center px-6 py-3.5
                  border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors
                  max-[800px]:grid-cols-2 max-[800px]:gap-1.5
                  ${isSelected ? "bg-[#f0f7f2] border-l-[3px] border-l-brand" : "hover:bg-gray-50 border-l-[3px] border-l-transparent"}
                `}
              >
                <span className="text-[13px] font-bold text-gray-900">{s.name}</span>
                <span className="text-[13px] text-gray-500">{s.studentNumber}</span>
                <span className="text-[12px] text-gray-400 truncate">{s.department}</span>
                <span className="text-[12px] text-gray-500">
                  {s.activeReservation ? (
                    <span className="text-brand font-semibold">{s.activeReservation.lockerNumber}</span>
                  ) : (
                    <span className="text-gray-300">없음</span>
                  )}
                </span>
                <span>
                  {s.role === "ADMIN" ? (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      관리자
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">학생</span>
                  )}
                </span>
                <span className="text-[11px] text-gray-300">{formatDate(s.createdAt)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
