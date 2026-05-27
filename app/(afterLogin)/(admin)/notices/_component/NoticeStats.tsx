import type { NoticeItem } from "../type";

interface NoticeStatsProps {
  notices: NoticeItem[];
}

export default function NoticeStats({ notices }: NoticeStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3.5 max-[600px]:grid-cols-1">
      <div className="bg-white rounded-2xl p-[18px] flex flex-col gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <span className="text-[26px] font-black text-gray-900">{notices.length}</span>
        <span className="text-[11px] text-gray-400 font-medium">전체 공지</span>
      </div>
      <div className="bg-white rounded-2xl p-[18px] flex flex-col gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <span className="text-[26px] font-black text-[#e67700]">{notices.filter((n) => n.pinned).length}</span>
        <span className="text-[11px] text-gray-400 font-medium">고정 공지</span>
      </div>
      <div className="bg-white rounded-2xl p-[18px] flex flex-col gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <span className="text-[26px] font-black text-gray-900">{notices.filter((n) => !n.pinned).length}</span>
        <span className="text-[11px] text-gray-400 font-medium">일반 공지</span>
      </div>
    </div>
  );
}
