import type { NoticeItem } from "../type";
import { formatDate } from "../type";

interface NoticeDetailProps {
  notice: NoticeItem;
  onClose: () => void;
  onEdit: (notice: NoticeItem) => void;
  onDelete: (id: number) => void;
}

export default function NoticeDetail({ notice, onClose, onEdit, onDelete }: NoticeDetailProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {notice.pinned && (
              <span className="text-[11px] font-bold text-[#e67700] bg-[#fff3e0] px-2 py-0.5 rounded-md">고정</span>
            )}
            <span className="text-[12px] text-gray-400">{formatDate(notice.createdAt)}</span>
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">{notice.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 border-none bg-[#f2f4f6] rounded-full cursor-pointer text-sm text-[#8b95a1] flex items-center justify-center hover:bg-[#e8ebed] transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button
          onClick={() => onEdit(notice)}
          className="text-[13px] font-semibold text-brand bg-green-50 border border-green-200 px-4 py-2 rounded-lg cursor-pointer font-sans hover:bg-green-100 transition-colors"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(notice.id)}
          className="text-[13px] font-semibold text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg cursor-pointer font-sans hover:bg-red-100 transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
