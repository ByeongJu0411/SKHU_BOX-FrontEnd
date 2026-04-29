"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiBox } from "react-icons/fi";

export default function SignupStep3() {
  const router = useRouter();
  const params = useSearchParams();

  const name = params.get("name");
  const studentId = params.get("studentId");
  const department = params.get("department");
  const email = params.get("email");

  // ✅ render에서 push 금지 → 여기로 이동
  useEffect(() => {
    if (!name || !studentId || !department || !email) {
      router.replace("/signup/step1");
    }
  }, [name, studentId, department, email, router]);

  if (!name || !studentId || !department || !email) return null;

  const userInfo = [
    { label: "이름", value: name },
    { label: "학번", value: studentId },
    { label: "학부", value: department },
    { label: "이메일", value: email },
  ];

  return (
    <div className="flex w-dvw h-dvh">
      {/* ✅ 여기부터 디자인 그대로 */}
      <div className="flex flex-col items-center w-[540px] min-w-[540px] h-dvh bg-[#f8f8f8] overflow-y-auto max-md:w-full max-md:min-w-0">
        <div className="w-full max-w-[360px] py-9 flex flex-col min-h-full max-md:px-6 max-md:min-h-auto">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <FiBox className="w-[18px] h-[18px] text-white" />
            </div>
            SKHUBOX
          </div>

          {/* 완료 섹션 */}
          <div className="flex flex-col items-center text-center pt-10">
            {/* 체크 아이콘 */}
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-[#6bc48f] rounded-full flex items-center justify-center mb-8">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="text-[28px] font-black text-gray-900 mb-3">가입이 완료되었습니다!</h1>

            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              {name}님, 환영합니다.
              <br />
              지금 바로 사물함을 신청해 보세요.
            </p>

            {/* 정보 테이블 */}
            <div className="w-full max-w-[340px] border border-gray-200 rounded-xl overflow-hidden mb-10 divide-y divide-gray-100">
              {userInfo.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <button
            className="w-full h-[46px] min-h-[46px] shrink-0 rounded-xl bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] text-white text-[15px] font-bold font-sans border-none cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => router.push("/login")}
          >
            로그인 하러 가기
          </button>

          <p className="mt-auto pt-8 text-[11px] text-gray-300">©2026 SKHUBOX 성공회대학교 사물함 예약 서비스</p>
        </div>
      </div>

      <div className="flex-1 bg-white max-md:hidden" />
    </div>
  );
}
