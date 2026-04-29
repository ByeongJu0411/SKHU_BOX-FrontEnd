"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiBox } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupStep1() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    studentId: "",
    department: "IT융합자율학부",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 유효성 검사
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "이름을 입력해 주세요.";
    if (!form.studentId.trim()) newErrors.studentId = "학번을 입력해 주세요.";
    if (!form.email.trim()) newErrors.email = "이메일을 입력해 주세요.";

    if (!form.password) {
      newErrors.password = "비밀번호를 입력해 주세요.";
    } else if (form.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해 주세요.";
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계 클릭
  const handleNext = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const fullEmail = `${form.email}`;

      // 이메일 인증 코드 발송 API 호출
      const res = await fetch(`${API_URL}/api/auth/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail }),
      });

      const data = await res.json();

      if (data.success) {
        // step1 데이터를 sessionStorage에 저장 (step2에서 사용)
        sessionStorage.setItem(
          "signupData",
          JSON.stringify({
            name: form.name,
            studentId: form.studentId,
            department: form.department,
            email: fullEmail,
            password: form.password,
          }),
        );
        router.push("/signup/step2");
      } else {
        setErrors({ email: data.message || "인증 코드 발송에 실패했습니다." });
      }
    } catch {
      setErrors({ email: "서버 연결에 실패했습니다. 다시 시도해 주세요." });
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 일치 여부
  const passwordMatch =
    form.password.length > 0 && form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const passwordMismatch = form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;

  // 공통 클래스
  const inputClass = (field: string) => `
    w-full h-[42px] px-4 border rounded-[10px]
    text-sm text-gray-900 bg-white outline-none font-sans
    transition-colors placeholder:text-gray-300
    min-h-[42px] shrink-0
    ${errors[field] ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-brand"}
  `;

  const selectClass = `
    w-full h-[42px] px-4 border border-gray-200 rounded-[10px]
    text-sm text-gray-900 bg-white outline-none font-sans
    focus:border-brand transition-colors cursor-pointer
    appearance-none bg-no-repeat bg-[right_10px_center]
    min-h-[42px] shrink-0
  `;

  const selectArrow = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  };

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
            STEP 1 / 3
          </div>

          <h1 className="text-[28px] font-black text-gray-900 tracking-tight mb-1.5">기본 정보 입력</h1>
          <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
            개인 정보와 로그인에 사용할 비밀번호를 입력해 주세요.
          </p>

          {/* 이름 / 학번 */}
          <div className="flex gap-3">
            <div className="flex-1 mb-3.5">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">이름</label>
              <input
                name="name"
                className={inputClass("name")}
                value={form.name}
                onChange={handleChange}
                placeholder="홍길동"
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div className="flex-1 mb-3.5">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">학번</label>
              <input
                name="studentId"
                className={inputClass("studentId")}
                value={form.studentId}
                onChange={handleChange}
                placeholder="202111111"
              />
              {errors.studentId && <p className="text-[11px] text-red-500 mt-1">{errors.studentId}</p>}
            </div>
          </div>

          {/* 학부 / 역할 */}
          <div className="flex gap-3">
            <div className="flex-1 mb-3.5">
              <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">학부</label>
              <select
                name="department"
                className={selectClass}
                value={form.department}
                onChange={handleChange}
                style={selectArrow}
              >
                <option>인문융합콘텐츠학부</option>
                <option>경영학부</option>
                <option>사회융합학부</option>
                <option>미디어콘텐츠융합학부</option>
                <option>미래융합학부</option>
                <option>소프트웨어융합학부</option>
                <option>국제학부</option>
                <option>인문융합자율학부</option>
                <option>사회융합자율학부</option>
                <option>IT융합자율학부</option>
                <option>미디어콘텐츠융합자율학부</option>
              </select>
            </div>
          </div>

          {/* 학교 이메일 */}
          <div className="mb-3.5">
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">학교 이메일</label>
            <div className="relative">
              <input
                name="email"
                className={inputClass("email")}
                value={form.email}
                onChange={handleChange}
                placeholder="@office.skhu.ac.kr"
              />
            </div>
            {errors.email ? (
              <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">해당 이메일로 인증번호가 전송됩니다.</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="mb-3.5">
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">비밀번호</label>
            <input
              name="password"
              type="password"
              className={inputClass("password")}
              value={form.password}
              onChange={handleChange}
              placeholder="8자 이상"
            />
            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-3.5">
            <label className="block text-[13px] font-semibold text-gray-900 mb-1.5">비밀번호 확인</label>
            <input
              name="passwordConfirm"
              type="password"
              className={inputClass("passwordConfirm")}
              value={form.passwordConfirm}
              onChange={handleChange}
            />
            {errors.passwordConfirm && <p className="text-[11px] text-red-500 mt-1">{errors.passwordConfirm}</p>}
            {passwordMatch && <p className="text-[11px] text-brand mt-1">비밀번호가 일치합니다.</p>}
            {passwordMismatch && !errors.passwordConfirm && (
              <p className="text-[11px] text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {/* 다음 단계 버튼 */}
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`
              w-full h-[46px] min-h-[46px] shrink-0 rounded-xl
              text-white text-[15px] font-bold font-sans border-none
              transition-all mt-2
              ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#3a7d5c] to-[#5cb882] cursor-pointer hover:opacity-90"
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                인증 코드 발송 중...
              </span>
            ) : (
              "다음 단계"
            )}
          </button>

          <p className="text-center text-[13px] text-gray-500 mt-4">
            이미 계정이 있으신가요?{" "}
            <a href="/login" className="font-bold text-brand no-underline hover:underline">
              로그인
            </a>
          </p>

          <p className="mt-auto pt-8 text-[11px] text-gray-300">©2026 SKHUBOX 성공회대학교 사물함 예약 서비스</p>
        </div>
      </div>
      <div className="flex-1 bg-white max-md:hidden" />
    </div>
  );
}
