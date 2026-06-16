/*
 * ✅ 건물 설정 파일 (레이아웃 전용)
 *
 * 이 파일은 사물함의 "물리적 배치(그리드)"만 담당해.
 * 각 사물함의 실제 상태(사용중/고장 등)는 백엔드 API에서 가져와.
 *
 * 중요: 구역의 name 값이 백엔드 API의 locationDetail과 정확히 일치해야 해.
 * 관리자 사물함 관리(사물함 추가/필터) 페이지도 이 buildings 배열을 그대로 가져다 써서
 * 건물·층·구역 선택지를 만들기 때문에, 여기 값을 바꾸면 관리자 페이지에도 즉시 반영돼.
 */

export interface ZoneConfig {
  name: string; // 구역 이름 (= 백엔드 locationDetail과 일치)
  rows: number; // 사물함 행 수
  cols: number; // 사물함 열 수
}

export interface FloorConfig {
  number: number; // 층 번호 (= 백엔드 floor와 일치)
  label: string; // 표시 이름
  zones: ZoneConfig[];
}

export interface BuildingConfig {
  id: string; // 건물 식별자
  name: string; // 건물 이름 (= 백엔드 building과 일치)
  floors: FloorConfig[];
}

// 백엔드 API 응답 타입
export interface LockerApiItem {
  id: number;
  building: string;
  floor: number;
  locationDetail: string;
  lockerNumber: string;
  status: "NORMAL" | "BROKEN" | "DISABLED" | "ACTIVE" | "IN_USE" | "RESERVED";
}

// ===== 건물 설정 =====

export const buildings: BuildingConfig[] = [
  {
    id: "jungbo",
    name: "정보과학관",
    floors: [
      {
        number: 4,
        label: "4층",
        zones: [{ name: "4층 강의실 앞", rows: 4, cols: 6 }],
      },
      {
        number: 3,
        label: "3층",
        zones: [{ name: "3층 화장실 옆", rows: 2, cols: 4 }],
      },
      {
        number: 2,
        label: "2층",
        zones: [{ name: "2층 엘리베이터 앞", rows: 4, cols: 6 }],
      },
      {
        number: 1,
        label: "1층",
        zones: [{ name: "1층 로비", rows: 3, cols: 5 }],
      },
    ],
  },
  {
    id: "saecheonnyeon",
    name: "새천년관",
    floors: [
      {
        number: 1,
        label: "1층",
        zones: [
          { name: "자판기맞은편", rows: 3, cols: 5 },
          { name: "언론매체실 앞", rows: 5, cols: 9 },
          { name: "언론매체실 앞2", rows: 5, cols: 6 },
          { name: "사회복지처 방향", rows: 5, cols: 17 },
          { name: "학부방 방향", rows: 5, cols: 6 },
        ],
      },
    ],
  },
];
