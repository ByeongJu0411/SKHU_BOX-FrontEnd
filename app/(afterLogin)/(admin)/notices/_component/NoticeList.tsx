import type { NoticeItem } from "../type";
import { formatDate } from "../type";

interface NoticeListProps {
  notices: NoticeItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onEdit: (notice: NoticeItem) => void;
  onDelete: (id: number) => void;
}

export default function NoticeList({ notices, selectedId, onSelect, onEdit, onDelete }: NoticeListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* 테이블 헤더 */}
      <div className="grid grid-cols-[auto_1fr_100px_80px_100px] gap-4 px-6 py-3 border-b border-gray-100 text-[12px] font-semibold text-gray-400 max-[700px]:hidden">
        <span className="w-[40px]">상태</span>
        <span>제목</span>
        <span>작성일</span>
        <span className="text-center">고정</span>
        <span className="text-right">관리</span>
      </div>

      {notices.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <span className="text-[40px] block mb-3">📋</span>
          <p className="text-[14px] text-gray-400">등록된 공지사항이 없습니다.</p>
          <p className="text-[12px] text-gray-300 mt-1">새 공지를 등록해 보세요.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`
                grid grid-cols-[auto_1fr_100px_80px_100px] gap-4 items-center px-6 py-4
                border-b border-gray-50 last:border-b-0 transition-colors
                max-[700px]:grid-cols-1 max-[700px]:gap-2
                ${notice.pinned ? "bg-[#fffdf5]" : "hover:bg-gray-50"}
              `}
            >
              {/* 상태 */}
              <div className="w-[40px]">
                {notice.pinned ? (
                  <span className="text-[11px] font-bold text-[#e67700] bg-[#fff3e0] px-2 py-0.5 rounded-md">고정</span>
                ) : (
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">일반</span>
                )}
              </div>

              {/* 제목 + 내용 미리보기 */}
              <div
                className="flex flex-col gap-0.5 min-w-0 cursor-pointer"
                onClick={() => onSelect(selectedId === notice.id ? null : notice.id)}
              >
                <span className="text-[14px] font-bold text-gray-900 truncate">{notice.title}</span>
                <span className="text-[12px] text-gray-400 truncate">{notice.content}</span>
              </div>

              {/* 작성일 */}
              <span className="text-[12px] text-gray-400 max-[700px]:text-[11px]">{formatDate(notice.createdAt)}</span>

              {/* 고정 여부 */}
              <div className="text-center max-[700px]:text-left">
                {notice.pinned ? (
                  <span className="text-[14px]">📌</span>
                ) : (
                  <span className="text-[14px] text-gray-200">—</span>
                )}
              </div>

              {/* 관리 버튼 */}
              <div className="flex items-center gap-1.5 justify-end max-[700px]:justify-start">
                <button
                  onClick={() => onEdit(notice)}
                  className="text-[11px] font-semibold text-brand bg-green-50 border border-green-200 px-2.5 py-1 rounded-md cursor-pointer font-sans hover:bg-green-100 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(notice.id)}
                  className="text-[11px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md cursor-pointer font-sans hover:bg-red-100 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
