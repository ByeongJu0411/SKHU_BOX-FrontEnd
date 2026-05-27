"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import toast from "react-hot-toast";
import type { NoticeItem } from "./type";
import NoticeStats from "./_component/NoticeStats";
import NoticeList from "./_component/NoticeList";
import NoticeDetail from "./_component/NoticeDetail";
import NoticeFormModal from "./_component/NoticeFormModal";

type ModalMode = null | "create" | "edit";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<NoticeItem | null>(null);

  const selectedNotice = notices.find((n) => n.id === selectedId) || null;

  // 공지사항 목록 조회
  const loadNotices = async () => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/notices`);
      const data = await res.json();
      if (data.success) setNotices(data.data);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // 공지사항 등록
  const handleCreate = async (formData: { title: string; content: string; pinned: boolean }) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("공지사항이 등록되었습니다");
        setModalMode(null);
        await loadNotices();
      } else {
        toast.error(data.message || "등록에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  // 공지사항 수정
  const handleEdit = async (formData: { title: string; content: string; pinned: boolean }) => {
    if (!editTarget) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices/${editTarget.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("공지사항이 수정되었습니다");
        setModalMode(null);
        setEditTarget(null);
        await loadNotices();
      } else {
        toast.error(data.message || "수정에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  // 공지사항 삭제
  const handleDelete = async (id: number) => {
    if (!confirm("이 공지사항을 삭제하시겠습니까?")) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("공지사항이 삭제되었습니다");
        if (selectedId === id) setSelectedId(null);
        await loadNotices();
      } else {
        toast.error(data.message || "삭제에 실패했습니다");
      }
    } catch {
      toast.error("서버 연결에 실패했습니다");
    }
  };

  // 수정 모드 진입
  const openEdit = (notice: NoticeItem) => {
    setEditTarget(notice);
    setModalMode("edit");
  };

  // 등록 모드 진입
  const openCreate = () => {
    setEditTarget(null);
    setModalMode("create");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">공지사항을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">공지사항</h1>
          <p className="text-[13px] text-gray-400">학생들에게 전달할 공지사항을 관리합니다.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-brand-dark text-white text-[13px] font-bold px-5 py-2.5 rounded-[10px] border-none cursor-pointer font-sans whitespace-nowrap hover:bg-[#155a32] transition-colors"
        >
          + 새 공지 등록
        </button>
      </div>

      <NoticeStats notices={notices} />

      <NoticeList
        notices={notices}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setModalMode(null);
        }}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {selectedNotice && modalMode === null && (
        <NoticeDetail
          notice={selectedNotice}
          onClose={() => setSelectedId(null)}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {modalMode && (
        <NoticeFormModal
          mode={modalMode}
          initialTitle={editTarget?.title}
          initialContent={editTarget?.content}
          initialPinned={editTarget?.pinned}
          onSubmit={modalMode === "create" ? handleCreate : handleEdit}
          onClose={() => {
            setModalMode(null);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}
