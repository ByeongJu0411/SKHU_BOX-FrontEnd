"use client";

import { useState } from "react";
import LockerGrid from "./LockerGrid";
import styles from "./HeroSection.module.css";

type LockerStatus = "available" | "occupied" | "mine" | "broken";

const LOCKER_STATUSES: LockerStatus[] = [
  "available",
  "occupied",
  "available",
  "occupied",
  "available",
  "mine",
  "occupied",
  "available",
  "broken",
  "occupied",
  "available",
  "available",
  "available",
  "occupied",
  "occupied",
  "available",
  "occupied",
  "available",
  "occupied",
  "available",
  "available",
  "occupied",
  "available",
  "available",
  "available",
  "occupied",
  "available",
  "available",
  "occupied",
  "occupied",
];

export default function HeroSection() {
  const [selectedLocker, setSelectedLocker] = useState(4);
  const selectedStatus = LOCKER_STATUSES[selectedLocker];

  return (
    <section className={styles.hero}>
      {/* 배경 레이어 */}
      <div className={styles.heroBg} />
      <div className={styles.accentStripe} />
      <div className={styles.accentStripe2} />
      <div className={`${styles.wave} ${styles.wave1}`} />
      <div className={`${styles.wave} ${styles.wave2}`} />
      <div className={`${styles.wave} ${styles.wave3}`} />

      {/* 떠다니는 장식 */}
      <div className={`${styles.floatObj} ${styles.objRing}`} />
      <div className={`${styles.floatObj} ${styles.objDot1}`} />
      <div className={`${styles.floatObj} ${styles.objDot2}`} />
      <div className={`${styles.floatObj} ${styles.objDot3}`} />
      <div className={`${styles.floatObj} ${styles.objPill}`} />

      {/* 콘텐츠 */}
      <div className={styles.content}>
        {/* 왼쪽: 텍스트 */}
        <div className={styles.text}>
          <div className={styles.badge}>성공회대학교 공식 사물함 서비스</div>

          <h1 className={styles.title}>
            <span className={styles.highlight}>내 사물함</span>,<br />
            이제 쉽게 관리하자
          </h1>

          <p className={styles.desc}>
            나에게 맞는 건물에서, 원하는 층에서
            <br />
            클릭 한번으로 사물함 신청부터 관리까지
            <br />
            SKHUBox에서 더 편하게 !
          </p>

          <a href="#" className={styles.cta}>
            사물함 신청하기
            <span className={styles.arrow}>→</span>
          </a>
        </div>

        {/* 오른쪽: 폰 목업 */}
        <div className={styles.mockup}>
          {/* 떠다니는 알림 토스트 */}
          <div className={styles.floatToast}>
            <div className={styles.toastDot} />
            <span className={styles.toastText}>1A-05 사물함 배정 완료!</span>
          </div>

          {/* 떠다니는 잔여 사물함 카드 */}
          <div className={styles.floatCard}>
            <div className={styles.floatCardIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
              </svg>
            </div>
            <div className={styles.floatCardText}>
              <span className={styles.floatCardLabel}>잔여 사물함</span>
              <span className={styles.floatCardValue}>24개 남음</span>
            </div>
          </div>

          {/* 폰 프레임 */}
          <div className={styles.phoneFrame}>
            <div className={styles.phoneScreen}>
              {/* 상단 로고 */}
              <div className={styles.screenHeader}>
                <span className={styles.screenLogo}>SKHUBOX</span>
              </div>

              {/* 인사 영역 */}
              <div className={styles.greetingRow}>
                <div>
                  <div className={styles.screenGreeting}>안녕하세요</div>
                  <div className={styles.screenName}>사용자님</div>
                </div>
              </div>

              {/* 사물함 카드 */}
              <div className={styles.lockerCard}>
                <div className={styles.lockerCardHeader}>
                  <span className={styles.lockerCardTitle}>새천년관 2층 A구역</span>
                  <span className={styles.lockerCardBadge}>신청가능</span>
                </div>

                <LockerGrid statuses={LOCKER_STATUSES} selectedIndex={selectedLocker} onSelect={setSelectedLocker} />

                {/* 하단 신청 버튼 */}
                <div className={styles.lockerBottom}>
                  <button
                    className={`${styles.applyBtn} ${selectedStatus !== "available" ? styles.disabled : ""}`}
                    disabled={selectedStatus !== "available"}
                  >
                    신청하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
