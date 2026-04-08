import type { ComplaintItem, ComplaintStatus } from "../type";

interface ComplaintListProps {
  complaints: ComplaintItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusBadge: Record<ComplaintStatus, { style: string; label: string }> = {
  대기중: { style: "bg-red-500 text-white", label: "대기" },
  확인중: { style: "bg-yellow-500 text-white", label: "확인중" },
  처리중: { style: "bg-blue-500 text-white", label: "처리중" },
  완료: { style: "bg-green-600 text-white", label: "완료" },
};

const categoryIcons: Record<string, string> = {
  고장: "🔧",
  "이동 요청": "↔",
  파손: "🚪",
  문의: "❓",
  누수: "💧",
  분실: "🔑",
};

export default function ComplaintList({ complaints, selectedId, onSelect }: ComplaintListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
        <span className="text-sm font-extrabold text-gray-900">민원 목록</span>
        <span className="text-[11px] text-gray-400">총 {complaints.length}건</span>
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto max-h-[520px]">
        {complaints.map((c) => {
          const badge = statusBadge[c.status];
          const icon = categoryIcons[c.category] || "📋";
          const isSelected = selectedId === c.id;

          return (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`
                flex items-start gap-3 px-5 py-4
                border-b border-gray-50 cursor-pointer
                transition-colors duration-100
                ${isSelected ? "bg-[#f0f7f2] border-l-[3px] border-l-brand" : "hover:bg-gray-50 border-l-[3px] border-l-transparent"}
              `}
            >
              {/* 카테고리 아이콘 */}
              <span className="text-base mt-0.5 shrink-0">{icon}</span>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[13px] font-bold text-gray-900 leading-tight">
                    {c.title}
                    <span className="text-gray-300 font-normal ml-1">#{c.id}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${badge.style}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-1.5 line-clamp-1">{c.description}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                  <span>{c.userName}</span>
                  <span>·</span>
                  <span>{c.timeAgo}</span>
                  <span>·</span>
                  <span>
                    📍 {c.building} {c.lockerId}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
