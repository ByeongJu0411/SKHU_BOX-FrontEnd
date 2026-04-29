"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiBox } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupStep2() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // sessionStorage에서 step1 데이터 가져오기
  const [signupData, setSignupData] = useState<{
    name: string;
    studentId: string;
    department: string;
    role: string;
    email: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("signupData");
    if (stored) {
      setSignupData(JSON.parse(stored));
    } else {
      // step1을 거치지 않고 직접 접근한 경우
      router.push("/signup/step1");
    }
  }, [router]);

  // 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")} : ${String(s % 60).padStart(2, "0")}`;

  const handleCodeChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    setError(""); // 입력 시 에러 제거
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  // 인증 확인 → 검증 API → 회원가입 API → step3
  const handleVerify = async () => {
    const codeStr = code.join("");
    if (codeStr.length !== 6) {
      setError("6자리 인증 코드를 모두 입력해 주세요.");
      return;
    }

    if (!signupData) return;

    setIsLoading(true);
    setError("");

    try {
      // 1단계: 인증 코드 검증 API
      const verifyRes = await fetch(`${API_URL}/api/auth/email/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          code: codeStr,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setError(verifyData.message || "인증 코드가 올바르지 않습니다.");
        setIsLoading(false);
        return;
      }

      // 2단계: 회원가입 API
      const signupRes = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentNumber: signupData.studentId,
          name: signupData.name,
          email: signupData.email,
          department: signupData.department,
          password: signupData.password,
        }),
      });

      const signupResult = await signupRes.json();

      if (signupResult.success) {
        // 회원가입 성공 → step3로 이동
        sessionStorage.setItem("user", JSON.stringify(signupResult.user));
        router.push(
          `/signup/step3?name=${signupData.name}&studentId=${signupData.studentId}&department=${signupData.department}&email=${signupData.email}`,
        );
      } else {
        setError(signupResult.message || "회원가입에 실패했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 재발송
  const handleResend = async () => {
    if (!signupData) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData.email }),
      });

      const data = await res.json();

      if (data.success) {
        setTimeLeft(300);
        setCode(["", "", "", "", "", ""]);
        setError("");
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || "재발송에 실패했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    }
  };

  if (!signupData) return null;

  return (
    <div className="flex w-dvw h-dvh">
      <div className="flex flex-col items-center w-[540px] min-w-[540px] h-dvh bg-[#f8f8f8] overflow-y-auto max-md:w-full max-md:min-w-0">
        <div className="w-full max-w-[360px] py-9 flex flex-col min-h-full max-md:px-6 max-md:min-h-auto">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <FiBox className="w-[18px] h-[18px] text-white" />
            </div>
            SKHUBOX
          </div>

          {/* 스텝 배지 */}
          <div className="inline-flex items-center gap-1.5 w-fit text-[13px] font-semibold text-brand bg-green-50 border border-green-200 rounded-[20px] px-3 py-1 mb-4">
            <span className="w-2 h-2 bg-brand rounded-full" />
            STEP 2 / 3
          </div>

          <h1 className="text-[28px] font-black text-gray-900 tracking-tight mb-1.5">인증번호 입력</h1>
          <p className="text-[13px] text-gray-400 mb-6">학교 이메일로 전송된 6자리 인증코드를 입력해주세요.</p>

          {/* 이메일 안내 박스 */}
          <div className="flex items-start gap-3.5 bg-[#f0f7f2] border border-[#d4e8da] rounded-[14px] p-[18px] mb-7">
            <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center shrink-0">
              <svg className="w-[18px] h-[18px] fill-white" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-gray-900">{signupData.email} 로</span>
              <span className="text-[13px] text-gray-500 leading-relaxed">
                인증 번호를 전송했습니다.
                <br />
                메일함을 확인해 주세요.
              </span>
            </div>
          </div>

          {/* 인증코드 6칸 */}
          <div className="mb-2">
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">인증 코드</label>
            <div className="flex gap-2.5">
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
                  className={`
                    w-[52px] h-[60px] border rounded-xl
                    text-[22px] font-bold text-center text-gray-900
                    bg-white outline-none font-sans transition-colors
                    ${error ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-brand"}
                  `}
                />
              ))}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-[12px] text-red-500 mb-2">{error}</p>}

          {/* 타이머 + 재발송 */}
          <div className="flex items-center justify-between mb-7">
            <span className={`text-sm font-bold ${timeLeft <= 60 ? "text-red-500" : "text-red-500"}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
            <button
              className="text-sm font-semibold text-brand bg-transparent border-none cursor-pointer font-sans hover:underline"
              onClick={handleResend}
            >
              인증코드 재발송
            </button>
          </div>

          {/* 인증 확인 버튼 */}
          <button
            onClick={handleVerify}
            disabled={isLoading || timeLeft <= 0}
            className={`
              w-full h-[46px] min-h-[46px] shrink-0 rounded-xl
              text-white text-[15px] font-bold font-sans border-none
              transition-all mt-2
              ${
                isLoading || timeLeft <= 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] cursor-pointer hover:opacity-90"
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                인증 확인 중...
              </span>
            ) : timeLeft <= 0 ? (
              "시간이 만료되었습니다. 재발송해 주세요."
            ) : (
              "인증 확인"
            )}
          </button>

          {/* 이전 단계 */}
          <p className="text-center text-[13px] text-gray-500 mt-4">
            <button
              className="font-bold text-brand bg-transparent border-none cursor-pointer font-sans hover:underline"
              onClick={() => router.push("/signup/step1")}
            >
              이전 단계로 돌아가기
            </button>
          </p>

          <p className="mt-auto pt-8 text-[11px] text-gray-300">©2026 SKHUBOX 성공회대학교 사물함 예약 서비스</p>
        </div>
      </div>
      <div className="flex-1 bg-white max-md:hidden" />
    </div>
  );
}
