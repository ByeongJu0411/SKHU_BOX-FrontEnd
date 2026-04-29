"use client";

import { useState } from "react";
import NotificationsModal from "./NotificationsModal";

interface Notice {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export default function Notifications({ notices }: { notices: Notice[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-extrabold text-gray-900">알림 및 공지</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-gray-400 bg-transparent border-none cursor-pointer font-sans hover:text-brand transition-colors"
          >
            전체보기
          </button>
        </div>

        {notices.length === 0 ? (
          <p className="text-sm text-gray-400">공지사항이 없습니다.</p>
        ) : (
          <ul className="list-none m-0 p-0 flex flex-col">
            {notices.slice(0, 3).map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-2.5 py-2.5 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="w-2 h-2 bg-brand rounded-full mt-[5px] shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[13px] font-semibold text-gray-900 truncate">{n.title}</span>
                    <span className="text-[11px] text-gray-300">{n.createdAt}</span>
                  </div>
                </div>
                {n.pinned && (
                  <span className="text-[11px] font-bold text-white px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 bg-brand">
                    공지
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <NotificationsModal isOpen={showModal} onClose={() => setShowModal(false)} notices={notices} />
    </>
  );
}
