import type { StudentItem } from "../type";

interface StudentDetailProps {
  student: StudentItem;
  onClose: () => void;
}

export default function StudentDetail({ student, onClose }: StudentDetailProps) {
  const isExpiring = student.dDay.includes("임박");

  return (
    <div
      className="
      w-[270px] min-w-[270px] bg-white rounded-xl p-4
      shadow-[0_1px_4px_rgba(0,0,0,0.04)]
      flex flex-col gap-4
      sticky top-6
      max-h-[calc(100dvh-240px)] overflow-y-auto
      max-[1000px]:static max-[1000px]:w-full max-[1000px]:min-w-0
    "
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-extrabold text-gray-900">학생 상세</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 bg-gray-100 rounded-full text-[10px] text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 프로필 */}
      <div className="flex flex-col items-center text-center gap-1.5 py-1">
        <div className="w-14 h-14 rounded-full bg-green-50 text-brand text-xl font-bold flex items-center justify-center">
          {student.name.charAt(0)}
        </div>
        <div>
          <span className="block text-[15px] font-extrabold text-gray-900">{student.name}</span>
          <span className="block text-[11px] text-gray-400">
            {student.dept} · {student.grade}학년
          </span>
        </div>
      </div>

      {/* 정보 리스트 */}
      <div className="flex flex-col divide-y divide-gray-50">
        {[
          { icon: "📋", label: "학번", value: student.studentId },
          { icon: "📧", label: "이메일", value: student.email },
          { icon: "💬", label: "민원 접수", value: `${student.complaintCount}건` },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">{row.icon}</span>
              <span className="text-[12px] text-gray-400">{row.label}</span>
            </div>
            <span className="text-[12px] font-semibold text-gray-900">{row.value}</span>
          </div>
        ))}
      </div>

      {/* 사물함 카드 */}
      <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-brand/20 flex items-center justify-center">
            <span className="text-xs font-bold text-brand">🔒</span>
          </div>
          <div>
            <span className="block text-[13px] font-bold text-gray-900">{student.lockerId}</span>
            <span className="block text-[10px] text-gray-400">
              {student.building} {student.location}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-[11px] font-semibold text-gray-900">
            {student.startDate} ~ {student.endDate}
          </span>
          <span className={`block text-[10px] font-semibold ${isExpiring ? "text-red-500" : "text-gray-400"}`}>
            {student.dDay}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-1.5">
        <button
          className="
          w-full py-2 bg-white text-gray-900
          border border-gray-200 rounded-md
          text-[12px] font-semibold cursor-pointer
          hover:bg-gray-50 transition-colors
        "
        >
          사물함 변경
        </button>
        <button
          className="
          w-full py-2 bg-white text-red-500
          border border-red-500 rounded-md
          text-[12px] font-semibold cursor-pointer
          hover:bg-red-50 transition-colors
        "
        >
          강제 반납
        </button>
      </div>
    </div>
  );
}
