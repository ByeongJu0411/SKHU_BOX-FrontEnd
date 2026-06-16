"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import type { AdminItem, AdminApiItem } from "./type";
import { toAdminItem } from "./type";
import AdminTable from "./_component/AdminTable";
import AdminRegisterModal from "./_component/AdminRegisterModal";

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCount = admins.filter((a) => a.isActive).length;
  const inactiveCount = admins.filter((a) => !a.isActive).length;

  useEffect(() => {
    const loadAdmins = async () => {
      setIsLoading(true);
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/admins`);
        const data = await res.json();

        if (data.success) {
          setAdmins((data.data as AdminApiItem[]).map(toAdminItem));
        }
      } catch {
        //
      } finally {
        setIsLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const handleRegister = (data: { name: string; studentId: string; dept: string; email: string }) => {
    const newAdmin: AdminItem = {
      id: String(Date.now()),
      name: data.name,
      studentId: data.studentId,
      dept: data.dept,
      email: data.email,
      joinDate: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      isActive: true,
    };
    setAdmins((prev) => [...prev, newAdmin]);
  };

  if (isLoading && admins.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#e8ebed]" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#191f28] animate-spin" />
          </div>
          <span className="text-[14px] font-medium text-[#4e5968]">관리자 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between max-md:flex-col max-md:gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1.5">관리자 관리</h1>
          <p className="text-[13px] text-gray-400">
            학생회 관리자를 등록·관리합니다. 학기 변경 시 새 관리자를 추가하거나 기존 관리자를 비활성화할 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            flex items-center gap-1.5
            bg-brand-dark text-white text-[13px] font-bold
            px-5 py-2.5 rounded-[10px] border-none
            cursor-pointer font-sans whitespace-nowrap
            hover:bg-[#155a32] transition-colors
          "
        >
          + 관리자 등록
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3.5 max-[700px]:grid-cols-1">
        <div className="bg-white rounded-2xl p-[18px] flex flex-col gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-base">
            👥
          </span>
          <span className="text-[26px] font-black text-gray-900 tracking-tight">{admins.length}</span>
          <span className="text-[11px] text-gray-400 font-medium">전체 관리자</span>
        </div>
        <div className="bg-white rounded-2xl p-[18px] flex flex-col gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <span className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-base">
            ✓
          </span>
          <span className="text-[26px] font-black text-gray-900 tracking-tight">{activeCount}</span>
          <span className="text-[11px] text-gray-400 font-medium">활성 관리자</span>
        </div>
        <div className="bg-white rounded-2xl p-[18px] flex flex-col gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <span className="w-9 h-9 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-base">
            ⏸
          </span>
          <span className="text-[26px] font-black text-gray-900 tracking-tight">{inactiveCount}</span>
          <span className="text-[11px] text-gray-400 font-medium">비활성 관리자</span>
        </div>
      </div>

      {/* 테이블 */}
      <AdminTable admins={admins} />

      {/* 등록 모달 */}
      <AdminRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRegister={handleRegister} />
    </div>
  );
}
