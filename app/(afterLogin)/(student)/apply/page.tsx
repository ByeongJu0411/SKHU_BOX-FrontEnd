"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Step {
  title: string;
  pendingDesc: string;
  completeDesc: string;
}

const steps: Step[] = [
  { title: "학부 정보 확인", pendingDesc: "학부 정보를 불러오는 중...", completeDesc: "IT융합자율학부 202111111" },
  {
    title: "이용 가능한 건물 매칭",
    pendingDesc: "건물 정보를 불러오는 중...",
    completeDesc: "학부별 배정 건물 조회 완료",
  },
  {
    title: "잔여 사물함 현황 로딩",
    pendingDesc: "건물별 층/구역 데이터를 불러오는 중...",
    completeDesc: "사물함 정보 조회 완료",
  },
  { title: "준비 완료", pendingDesc: "사물함 선택 페이지로 이동", completeDesc: "사물함 선택 페이지로 이동" },
];

const statusMessages = [
  "사용자의 학부를 확인하고 있습니다...",
  "건물 정보를 가져오고 있습니다...",
  "사물함 현황을 불러오고 있습니다...",
  "모든 분석이 완료되었습니다 !",
];

export default function ApplyLoadingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showBuilding, setShowBuilding] = useState(false);

  // 각 단계 3초 간격으로 진행
  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // 3단계 완료 시 건물 카드 표시
  useEffect(() => {
    if (currentStep >= 3) {
      const timer = setTimeout(() => setShowBuilding(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // 모든 단계 완료 후 2초 뒤 자동 이동
  useEffect(() => {
    if (currentStep >= steps.length) {
      const timer = setTimeout(() => {
        router.push("/apply/select");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)] w-full max-w-[600px] mx-auto px-6">
      {/* 건물 아이콘 */}
      <div
        className="w-[72px] h-[72px] bg-green-50 rounded-2xl flex items-center justify-center mb-5"
        style={{ transform: currentStep >= steps.length ? "scale(0.95)" : "scale(1)" }}
      >
        <svg
          className="w-9 h-9 text-brand"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 6h.01M12 10h.01M12 14h.01" />
        </svg>
      </div>

      {/* 배정 건물 카드 — 3단계 완료 후 페이드인 */}
      <div
        className={`
        overflow-hidden transition-all duration-700 ease-out mb-6
        ${showBuilding ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}
      `}
      >
        <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-gray-900">새천년관</span>
            <span className="text-[12px] text-gray-400">4개 층 잔여 24석</span>
          </div>
          <span className="ml-auto text-[13px] font-bold text-brand">배정 완료</span>
        </div>
      </div>

      {/* 타이틀 */}
      <h1 className="text-xl font-black text-gray-900 tracking-tight mb-1 text-center">배정 건물을 확인하고 있어요</h1>
      <p className="text-[13px] text-gray-400 text-center mb-10 leading-relaxed">
        사용자님의 학부 정보를 기반으로
        <br />
        이용 가능한 건물과 사물함을 분석하고 있습니다.
      </p>

      {/* 단계 리스트 */}
      <div className="w-full max-w-[340px] flex flex-col gap-0 mb-6">
        {steps.map((step, i) => {
          const isComplete = currentStep > i;
          const isCurrent = currentStep === i;
          const isPending = currentStep < i;

          return (
            <div key={i} className="flex items-start gap-4">
              {/* 아이콘 + 연결선 */}
              <div className="flex flex-col items-center">
                {/* 원형 아이콘 */}
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center shrink-0
                  transition-all duration-500 ease-out
                  ${
                    isComplete
                      ? "bg-brand text-white"
                      : isCurrent
                        ? "bg-brand text-white shadow-[0_0_0_4px_rgba(74,140,102,0.15)]"
                        : "bg-gray-100 text-gray-300"
                  }
                `}
                >
                  {isComplete ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  )}
                </div>

                {/* 연결선 (마지막 제외) */}
                {i < steps.length - 1 && (
                  <div
                    className={`
                    w-0.5 h-6 transition-colors duration-500
                    ${isComplete ? "bg-brand" : "bg-gray-200"}
                  `}
                  />
                )}
              </div>

              {/* 텍스트 */}
              <div className="pt-0.5 pb-2.5">
                <span
                  className={`
                  block text-sm font-bold transition-colors duration-500
                  ${isComplete || isCurrent ? "text-gray-900" : "text-gray-300"}
                `}
                >
                  {step.title}
                </span>
                <span
                  className={`
                  block text-[12px] mt-0.5 transition-colors duration-500
                  ${isComplete ? "text-gray-400" : isCurrent ? "text-brand" : "text-gray-300"}
                `}
                >
                  {isComplete ? step.completeDesc : step.pendingDesc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full max-w-[340px] mb-3">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-[2800ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 상태 메시지 */}
      <p className="text-[13px] text-gray-400 text-center transition-opacity duration-500">
        {statusMessages[Math.min(currentStep, statusMessages.length - 1)]}
      </p>
    </div>
  );
}
