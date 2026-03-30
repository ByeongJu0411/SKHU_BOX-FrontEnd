"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";
import { FiBox } from "react-icons/fi";

type Role = null | "student" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <div className={styles.formInner}>
          {/* 로고 */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <FiBox className={styles.logoIcon} />
            </div>
            SKHUBOX
          </div>

          {/* 환영 메시지 */}
          <p className={styles.welcome}>환영합니다</p>
          <h1 className={styles.title}>로그인</h1>

          {/* ===== 역할 미선택: 역할 선택 버튼 ===== */}
          {role === null && (
            <>
              <p className={styles.subtitle}>로그인 유형을 선택해 주세요</p>

              <div className={styles.roleButtons}>
                <button className={styles.roleBtn} onClick={() => setRole("student")}>
                  <div className={styles.roleBtnIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
                    </svg>
                  </div>
                  <div className={styles.roleBtnText}>
                    <span className={styles.roleBtnTitle}>학생으로 로그인</span>
                    <span className={styles.roleBtnDesc}>사물함 신청 및 관리</span>
                  </div>
                  <span className={styles.roleBtnArrow}>→</span>
                </button>

                <button className={styles.roleBtn} onClick={() => setRole("admin")}>
                  <div className={styles.roleBtnIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className={styles.roleBtnText}>
                    <span className={styles.roleBtnTitle}>관리자로 로그인</span>
                    <span className={styles.roleBtnDesc}>사물함 현황 관리</span>
                  </div>
                  <span className={styles.roleBtnArrow}>→</span>
                </button>
              </div>

              {/* 구분선 */}
              <div className={styles.divider}>
                <span className={styles.dividerText}>또는</span>
              </div>

              {/* 회원가입 */}
              <p className={styles.signupText}>
                아직 계정이 없으신가요?{" "}
                <a href="/signup" className={styles.signupLink}>
                  회원가입
                </a>
              </p>
            </>
          )}

          {/* ===== 역할 선택 후: 로그인 폼 ===== */}
          {role !== null && (
            <>
              <p className={styles.subtitle}>{role === "student" ? "학번" : "관리자 ID"}으로 로그인하세요</p>

              {/* 역할 선택 표시 + 변경 */}
              <div className={styles.selectedRole}>
                <span className={styles.selectedRoleLabel}>{role === "student" ? "🎓 학생" : "🔐 관리자"}</span>
                <button className={styles.changeRoleBtn} onClick={() => setRole(null)}>
                  변경
                </button>
              </div>

              {/* 입력 폼 */}
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="studentId">
                  {role === "student" ? "학번" : "관리자 ID"}
                </label>
                <input
                  id="studentId"
                  className={styles.input}
                  type="text"
                  placeholder={role === "student" ? "202111111" : "admin"}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">
                  비밀번호
                </label>
                <input id="password" className={styles.input} type="password" />
              </div>

              {/* 비밀번호 찾기 */}
              <div className={styles.forgotRow}>
                <a href="/login/findpassword" className={styles.forgotLink}>
                  비밀번호 찾기
                </a>
              </div>

              {/* 로그인 버튼 */}
              <button
                className={styles.loginBtn}
                onClick={() => {
                  document.cookie = `role=${role}; path=/`;
                  router.push(role === "admin" ? "/admindashboard" : "/dashboard");
                }}
              >
                로그인
              </button>

              {/* 구분선 */}
              <div className={styles.divider}>
                <span className={styles.dividerText}>또는</span>
              </div>

              {/* 회원가입 */}
              <p className={styles.signupText}>
                아직 계정이 없으신가요?{" "}
                <a href="/signup" className={styles.signupLink}>
                  회원가입
                </a>
              </p>
            </>
          )}

          {/* 하단 카피라이트 */}
          <p className={styles.copyright}>©2026 SKHUBOX 성공회대학교 사물함 예약 서비스</p>
        </div>
      </div>

      {/* 오른쪽 빈 영역 */}
      <div className={styles.rightPanel} />
    </div>
  );
}
