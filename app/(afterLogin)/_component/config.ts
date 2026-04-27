/*
 * ✅ 건물 설정 파일
 *
 * buildings 배열에 건물을 추가/삭제/수정하면 페이지에 자동 반영돼.
 * 각 건물마다 층, 구역 이름, 사물함 그리드(행×열)을 자유롭게 설정 가능.
 */

export interface ZoneConfig {
  name: string; // 구역 이름 (자유 설정)
  rows: number; // 사물함 행 수
  cols: number; // 사물함 열 수
}

export interface FloorConfig {
  number: number; // 층 번호
  label: string; // 표시 이름
  zones: ZoneConfig[];
}

export interface BuildingConfig {
  id: string; // 건물 식별자
  name: string; // 건물 이름
  floors: FloorConfig[];
}

// ===== 건물 설정 — 여기서 수정하면 자동 반영 =====

export const buildings: BuildingConfig[] = [
  {
    id: "saecheonnyeon",
    name: "새천년관",
    floors: [
      {
        number: 4,
        label: "4층",
        zones: [
          { name: "복도 좌측", rows: 4, cols: 8 }, // 32칸
          { name: "복도 우측", rows: 3, cols: 6 }, // 18칸
        ],
      },
      {
        number: 3,
        label: "3층",
        zones: [
          { name: "엘리베이터 앞", rows: 4, cols: 6 }, // 30칸
          { name: "계단 옆", rows: 2, cols: 5 }, // 10칸
        ],
      },
      {
        number: 2,
        label: "2층",
        zones: [
          { name: "로비", rows: 3, cols: 8 }, // 24칸
        ],
      },
      {
        number: 1,
        label: "1층",
        zones: [
          { name: "현관 옆", rows: 2, cols: 6 }, // 12칸
          { name: "매점 앞", rows: 2, cols: 4 }, // 8칸
        ],
      },
    ],
  },
  {
    id: "jungbo",
    name: "정보과학관",
    floors: [
      {
        number: 3,
        label: "3층",
        zones: [
          { name: "실습실 앞", rows: 4, cols: 6 }, // 24칸
        ],
      },
      {
        number: 2,
        label: "2층",
        zones: [
          { name: "강의실 복도", rows: 3, cols: 8 }, // 24칸
          { name: "휴게실 옆", rows: 2, cols: 4 }, // 8칸
        ],
      },
      {
        number: 1,
        label: "1층",
        zones: [
          { name: "로비", rows: 3, cols: 5 }, // 15칸
        ],
      },
    ],
  },
];

/*
 * ✅ 건물 추가 예시:
 *
 * buildings 배열에 새 객체를 추가하면 돼:
 *
 * {
 *   id: "migael",
 *   name: "미가엘관",
 *   floors: [
 *     { number: 2, label: "2층", zones: [{ name: "A구역", rows: 3, cols: 6 }] },
 *     { number: 1, label: "1층", zones: [{ name: "B구역", rows: 2, cols: 5 }] },
 *   ],
 * },
 */
