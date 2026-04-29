"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiBox } from "react-icons/fi";

type Role = null | "USER" | "ADMIN";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!studentNumber || !password) {
      setModal("학번과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setModal(data.message || "로그인에 실패했습니다.");
        return;
      }

      const serverRole = data.role;

      if (serverRole === "USER" && role === "ADMIN") {
        setModal("관리자 권한이 없습니다. 관리자 등록이 필요합니다.");
        return;
      }

      if (role === "ADMIN") {
        router.push("/admindashboard");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setModal("서버 연결 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-dvw h-dvh">
      {/* ===== 왼쪽: 로그인 영역 ===== */}
      <div
        className="
        flex flex-col items-center
        w-[540px] min-w-[540px] h-dvh bg-[#f8f8f8]
        overflow-y-auto
        max-md:w-full max-md:min-w-0
      "
      >
        {/* 내부 컨텐츠 */}
        <div className="w-full max-w-[360px] py-10 px-6 flex flex-col h-full">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <FiBox className="w-[18px] h-[18px] text-white" />
            </div>
            SKHUBOX
          </div>

          {/* 제목 */}
          <p className="text-[15px] font-semibold text-brand mb-1">환영합니다</p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">로그인</h1>

          {/* ===== 역할 선택 ===== */}
          {role === null && (
            <>
              <p className="text-sm text-gray-400 mb-5">로그인 유형을 선택해 주세요</p>

              <div className="flex flex-col gap-3">
                {/* 학생 */}
                <button
                  className="
                    flex items-center gap-3.5 w-full
                    p-4 bg-white border border-gray-200 rounded-xl
                    text-left font-sans
                    hover:border-brand hover:shadow-[0_2px_10px_rgba(74,140,102,0.1)]
                    transition-all
                  "
                  onClick={() => setRole("USER")}
                >
                  <div className="w-10 h-10 bg-[#f0f7f2] rounded-lg flex items-center justify-center">🎓</div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[14px] font-bold text-gray-900">학생으로 로그인</span>
                    <span className="text-xs text-gray-400">사물함 신청 및 관리</span>
                  </div>
                </button>

                {/* 관리자 */}
                <button
                  className="
                    flex items-center gap-3.5 w-full
                    p-4 bg-white border border-gray-200 rounded-xl
                    text-left font-sans
                    hover:border-brand hover:shadow-[0_2px_10px_rgba(74,140,102,0.1)]
                    transition-all
                  "
                  onClick={() => setRole("ADMIN")}
                >
                  <div className="w-10 h-10 bg-[#f0f7f2] rounded-lg flex items-center justify-center">🔐</div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[14px] font-bold text-gray-900">관리자로 로그인</span>
                    <span className="text-xs text-gray-400">사물함 현황 관리</span>
                  </div>
                </button>
              </div>

              {/* 구분선 */}
              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[13px] text-gray-400">또는</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-[12px] text-gray-500">
                아직 계정이 없으신가요?{" "}
                <a href="/signup" className="font-bold text-brand hover:underline">
                  회원가입
                </a>
              </p>
            </>
          )}

          {/* ===== 로그인 폼 ===== */}
          {role !== null && (
            <>
              <p className="text-sm text-gray-400 mb-5">{role === "USER" ? "학생으로 로그인" : "관리자로 로그인"}</p>

              {/* 역할 표시 */}
              <div className="flex items-center justify-between bg-[#f0f7f2] border border-[#d4e8da] rounded-lg px-3 py-2 mb-5">
                <span className="text-sm font-semibold text-green-700">
                  {role === "USER" ? "🎓 학생" : "🔐 관리자"}
                </span>
                <button className="text-xs font-semibold text-brand hover:underline" onClick={() => setRole(null)}>
                  변경
                </button>
              </div>

              {/* 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">학번</label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="202111111"
                  className="w-full h-11 px-3 border text-[12px] border-gray-200 rounded-lg text-sm focus:border-brand outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:border-brand outline-none"
                />
              </div>

              {/* 비번 찾기 */}
              <div className="flex justify-end mb-5">
                <a href="/login/findpassword" className="text-xs text-brand hover:underline">
                  비밀번호 찾기
                </a>
              </div>

              {/* 로그인 버튼 (핵심 개선) */}
              <button
                className="
                  w-full h-[40px] rounded-xl
                  bg-gradient-to-br from-[#3a7d5c] to-[#5cb882]
                  text-white text-[15px] font-bold
                  hover:opacity-90 transition
                "
                onClick={handleLogin}
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>

              {/* 구분선 */}
              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[13px] text-gray-400">또는</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-[12px] text-gray-500">
                아직 계정이 없으신가요?{" "}
                <a href="/signup" className="font-bold text-brand hover:underline">
                  회원가입
                </a>
              </p>
            </>
          )}

          {/* 푸터 */}
          <p className="mt-auto pt-10 text-xs text-gray-300 text-center">
            ©2026 SKHUBOX 성공회대학교 사물함 예약 서비스
          </p>
        </div>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex-1 bg-white max-md:hidden" />
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
            <p className="text-sm mb-4">{modal}</p>
            <button className="px-4 py-2 bg-brand text-white rounded-lg" onClick={() => setModal("")}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
