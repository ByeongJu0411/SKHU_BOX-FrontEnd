import type { ComplaintItem, ComplaintStatus } from "../type";

interface ComplaintListProps {
  complaints: ComplaintItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const statusBadge: Record<ComplaintStatus, { style: string; label: string }> = {
  확인중: { style: "bg-yellow-500 text-white", label: "확인중" },
  처리중: { style: "bg-blue-500 text-white", label: "처리중" },
  완료: { style: "bg-green-600 text-white", label: "완료" },
};

export default function ComplaintList({ complaints, selectedId, onSelect }: ComplaintListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
        <span className="text-sm font-extrabold text-gray-900">민원 목록</span>
        <span className="text-[11px] text-gray-400">총 {complaints.length}건</span>
      </div>

      <div className="overflow-y-auto max-h-[520px]">
        {complaints.length === 0 ? (
          <p className="text-[13px] text-gray-300 text-center py-10">민원이 없습니다.</p>
        ) : (
          complaints.map((c) => {
            const badge = statusBadge[c.status];
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
                <span className="text-base mt-0.5 shrink-0">📋</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[13px] font-bold text-gray-900 leading-tight">
                      민원 #{c.id}
                      <span className="text-gray-300 font-normal ml-1.5">{c.lockerNumber}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${badge.style}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-1.5 line-clamp-1">{c.content}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                    <span>{c.studentNumber}</span>
                    <span>·</span>
                    <span>{c.createdAt}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
