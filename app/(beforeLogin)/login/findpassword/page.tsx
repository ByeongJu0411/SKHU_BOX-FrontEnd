"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiBox } from "react-icons/fi";

type Phase = "email" | "verify";

export default function FindPasswordPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("email");
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [modal, setModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (phase !== "verify" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")} : ${String(s % 60).padStart(2, "0")}`;

  const handleCodeChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  // Phase 1: 비밀번호 재설정 요청
  const handleRequestReset = async () => {
    if (!studentNumber || !email) {
      setModal("학번과 이메일을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber, email }),
      });

      const data = await res.json();
      if (!data.success) {
        setModal(data.message || "이메일 발송에 실패했습니다.");
        return;
      }

      setTimeLeft(300);
      setCode(["", "", "", "", "", ""]);
      setPhase("verify");
    } catch {
      setModal("서버 연결 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 2: 인증코드 재발송
  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber, email }),
      });

      const data = await res.json();
      if (!data.success) {
        setModal(data.message || "재발송에 실패했습니다.");
        return;
      }

      setTimeLeft(300);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setModal("서버 연결 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 2: 인증코드 + 비밀번호 한번에 재설정
  const handleResetPassword = async () => {
    const token = code.join("");
    if (code.some((c) => c === "")) {
      setModal("인증코드 6자리를 모두 입력해주세요.");
      return;
    }
    if (!newPassword || !newPasswordConfirm) {
      setModal("비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setModal("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: token, newPassword }),
      });

      const data = await res.json();
      if (!data.success) {
        setModal(data.message || "비밀번호 변경에 실패했습니다.");
        return;
      }

      setModal("비밀번호가 변경되었습니다.");
    } catch {
      setModal("서버 연결 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    if (modal === "비밀번호가 변경되었습니다.") {
      router.push("/login");
      return;
    }
    setModal("");
  };

  const inputClass =
    "w-full h-[40px] min-h-[40px] shrink-0 px-4 border border-gray-200 rounded-[10px] text-sm text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors placeholder:text-gray-300";
  const btnClass =
    "w-full h-[44px] min-h-[44px] shrink-0 rounded-xl bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white text-[15px] font-bold font-sans border-none cursor-pointer hover:opacity-90 transition-opacity mt-2 disabled:opacity-50";

  return (
    <div className="flex w-dvw h-dvh">
      <div className="flex flex-col items-center w-[540px] min-w-[540px] h-dvh bg-[#f8f8f8] overflow-y-auto max-md:w-full max-md:min-w-0">
        <div className="w-full max-w-[360px] py-9 flex flex-col min-h-full max-md:px-6 max-md:min-h-auto">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <FiBox className="w-[18px] h-[18px] text-white" />
            </div>
            SKHUBOX
          </div>

          {/* ===== Phase 1: 학번 + 이메일 ===== */}
          {phase === "email" && (
            <>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight mb-1">비밀번호 찾기</h1>
              <p className="text-[13px] text-gray-400 mb-5 leading-relaxed">
                가입 시 등록한 학번과 학교 이메일을 입력해 주세요.
                <br />
                인증번호를 보내드립니다.
              </p>

              <div className="mb-3">
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">학번</label>
                <input
                  className={inputClass}
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="202111111"
                  onKeyDown={(e) => e.key === "Enter" && handleRequestReset()}
                />
              </div>

              <div className="mb-3">
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">학교 이메일</label>
                <input
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@office.skhu.ac.kr"
                  onKeyDown={(e) => e.key === "Enter" && handleRequestReset()}
                />
              </div>

              <button className={btnClass} onClick={handleRequestReset} disabled={isLoading}>
                {isLoading ? "발송 중..." : "인증번호 발송"}
              </button>

              <p className="text-center text-[13px] text-gray-500 mt-4">
                <a href="/login" className="font-bold text-brand no-underline hover:underline">
                  로그인으로 돌아가기
                </a>
              </p>
            </>
          )}

          {/* ===== Phase 2: 인증코드 + 새 비밀번호 ===== */}
          {phase === "verify" && (
            <>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight mb-1">비밀번호 재설정</h1>
              <p className="text-[13px] text-gray-400 mb-4 leading-relaxed">
                이메일로 전송된 인증코드와 새 비밀번호를 입력해 주세요.
              </p>

              {/* 이메일 안내 */}
              <div className="flex items-center gap-3 bg-[#f0f7f2] border border-[#d4e8da] rounded-xl px-4 py-3 mb-4">
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-[16px] h-[16px] fill-white" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <span className="text-[12px] text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800">{email}</span> 로 인증번호를 전송했습니다.
                </span>
              </div>

              {/* 인증코드 */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[13px] font-semibold text-gray-900">인증 코드</label>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-red-500">⏱ {formatTime(timeLeft)}</span>
                    <button
                      className="text-[12px] font-semibold text-brand bg-transparent border-none cursor-pointer font-sans hover:underline disabled:opacity-50"
                      onClick={handleResend}
                      disabled={isLoading}
                    >
                      재발송
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-[48px] h-[52px] border border-gray-200 rounded-xl text-[20px] font-bold text-center text-gray-900 bg-white outline-none font-sans focus:border-brand transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* 새 비밀번호 */}
              <div className="mb-3">
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">새로운 비밀번호</label>
                <input
                  type="password"
                  className={inputClass}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                />
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">새로운 비밀번호 확인</label>
                <input
                  type="password"
                  className={inputClass}
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                />
              </div>

              <button className={btnClass} onClick={handleResetPassword} disabled={isLoading}>
                {isLoading ? "변경 중..." : "비밀번호 변경"}
              </button>

              <p className="text-center text-[13px] text-gray-500 mt-3">
                <button
                  className="font-bold text-brand bg-transparent border-none cursor-pointer font-sans hover:underline"
                  onClick={() => setPhase("email")}
                >
                  이전 단계로 돌아가기
                </button>
              </p>
            </>
          )}

          <p className="mt-auto pt-8 text-[11px] text-gray-300">©2026 SKHUBOX 성공회대학교 사물함 예약 서비스</p>
        </div>
      </div>

      <div className="flex-1 bg-white max-md:hidden" />

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
            <p className="text-sm mb-4">{modal}</p>
            <button className="px-4 py-2 bg-brand text-white rounded-lg font-sans" onClick={handleModalClose}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
