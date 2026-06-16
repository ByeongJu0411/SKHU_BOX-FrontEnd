import type { StudentApiItem } from "../type";
import { formatDate } from "../type";

interface StudentDetailProps {
  student: StudentApiItem;
  onClose: () => void;
}

export default function StudentDetail({ student, onClose }: StudentDetailProps) {
  const res = student.activeReservation;

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-gray-50">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">{student.name}</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {student.studentNumber} · {student.department}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 border-none bg-[#f2f4f6] rounded-full cursor-pointer text-sm text-[#8b95a1] flex items-center justify-center hover:bg-[#e8ebed] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 기본 정보 */}
      <div className="px-6 py-4 border-b border-gray-50">
        <h4 className="text-[13px] font-bold text-gray-900 mb-3">기본 정보</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <span className="block text-[11px] text-gray-400 mb-0.5">이름</span>
            <span className="block text-[13px] font-semibold text-gray-900">{student.name}</span>
          </div>
          <div>
            <span className="block text-[11px] text-gray-400 mb-0.5">학번</span>
            <span className="block text-[13px] font-semibold text-gray-900">{student.studentNumber}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-[11px] text-gray-400 mb-0.5">이메일</span>
            <span className="block text-[13px] font-semibold text-gray-900 break-all">{student.email}</span>
          </div>
          <div>
            <span className="block text-[11px] text-gray-400 mb-0.5">학부</span>
            <span className="block text-[13px] font-semibold text-gray-900">{student.department}</span>
          </div>
          <div>
            <span className="block text-[11px] text-gray-400 mb-0.5">역할</span>
            {student.role === "ADMIN" ? (
              <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
                관리자
              </span>
            ) : (
              <span className="text-[12px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md inline-block">
                학생
              </span>
            )}
          </div>
          <div>
            <span className="block text-[11px] text-gray-400 mb-0.5">가입일</span>
            <span className="block text-[13px] font-semibold text-gray-900">{formatDate(student.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 사물함 정보 */}
      <div className="px-6 py-4">
        <h4 className="text-[13px] font-bold text-gray-900 mb-3">사물함 정보</h4>
        {res ? (
          <div className="flex items-center gap-5 bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="w-[60px] h-[60px] bg-white rounded-xl flex flex-col items-center justify-center gap-0.5 shrink-0 border border-green-200">
              <svg
                className="w-[16px] h-[16px] text-brand"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span className="text-[11px] font-extrabold text-brand">{res.lockerNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
              <div>
                <span className="block text-[11px] text-gray-400">건물</span>
                <span className="block text-[13px] font-semibold text-gray-900">{res.building}</span>
              </div>
              <div>
                <span className="block text-[11px] text-gray-400">상태</span>
                <span className="block text-[13px] font-semibold text-brand">
                  {res.status === "ACTIVE" ? "이용중" : res.status}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-gray-400">만료일</span>
                <span className="block text-[13px] font-semibold text-gray-900">{formatDate(res.expiredAt)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-[13px] text-gray-400">예약된 사물함이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
