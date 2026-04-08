import type { StudentItem } from "../type";

interface StudentTableProps {
  students: StudentItem[];
  selectedId: string | null;
  checkedIds: Set<string>;
  onSelect: (id: string) => void;
  onCheck: (id: string) => void;
  onCheckAll: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function StudentTable({
  students,
  selectedId,
  onSelect,
  currentPage,
  totalPages,
  onPageChange,
}: StudentTableProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="bg-white rounded-2xl overflow-x-auto max-h-[calc(100dvh-340px)] overflow-y-auto shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">학생</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">학번</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">사물함</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">상태</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">만료일</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-400 whitespace-nowrap">관리</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const isSelected = selectedId === s.id;
              const isExpiring = s.dDay.includes("임박");

              return (
                <tr
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  className={`cursor-pointer transition-colors duration-100 border-b border-gray-50
                    ${isSelected ? "bg-[#f0f7f2]" : "hover:bg-[#fafbfa]"}`}
                >
                  {/* 학생 */}
                  <td className="py-3.5 px-4 min-w-[160px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-brand text-xs font-bold flex items-center justify-center shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-[13px] font-bold text-gray-900">{s.name}</span>
                        <span className="block text-[11px] text-gray-300">{s.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* 학번 */}
                  <td className="py-3.5 px-4 text-[13px] font-medium text-gray-900 whitespace-nowrap">{s.studentId}</td>

                  {/* 사물함 */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="block text-[13px] font-semibold text-brand">{s.lockerId}</span>
                    <span className="block text-[11px] text-gray-300">
                      {s.building} {s.location}
                    </span>
                  </td>

                  {/* 상태 */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap
                      ${isExpiring ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}
                    >
                      {s.status}
                    </span>
                  </td>

                  {/* 만료일 */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="block text-[13px] text-gray-900">{s.endDate}</span>
                    <span
                      className={`block text-[11px] ${isExpiring ? "text-red-500 font-semibold" : "text-gray-300"}`}
                    >
                      {s.dDay}
                    </span>
                  </td>

                  {/* 관리 */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      className="w-[30px] h-[30px] border-none bg-transparent rounded-md cursor-pointer text-[13px] hover:bg-red-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1 mt-auto pt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg border text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center
              ${
                currentPage === page
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
}
