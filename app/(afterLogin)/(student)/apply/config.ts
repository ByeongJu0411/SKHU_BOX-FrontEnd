/*
 * ✅ 건물 설정 파일 (레이아웃 전용)
 *
 * 이 파일은 사물함의 "물리적 배치(그리드)"만 담당해.
 * 각 사물함의 실제 상태(사용중/고장 등)는 백엔드 API에서 가져와.
 *
 * 중요: 구역의 name 값이 백엔드 API의 locationDetail과 정확히 일치해야 해.
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
  status: "NORMAL" | "BROKEN" | "IN_USE" | "RESERVED";
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

/*
 * ✅ 백엔드 연동 가이드
 *
 * 백엔드에서 사물함 등록 시 아래 값들을 일치시켜야 함:
 *
 * 정보과학관:
 *   building: "정보과학관"
 *   floor: 1, locationDetail: "로비"              (15개)
 *   floor: 2, locationDetail: "강의실 복도"        (24개)
 *   floor: 2, locationDetail: "휴게실 옆"          (8개)
 *   floor: 3, locationDetail: "실습실 앞"          (24개)
 *
 * 새천년관:
 *   building: "새천년관"
 *   floor: 1, locationDetail: "자판기맞은편"       (15개, 1~15)
 *   floor: 1, locationDetail: "언론매체실 앞"      (45개, 16~60)
 *   floor: 1, locationDetail: "언론매체실 앞2"     (30개, 61~90)
 *
 * 사회융합학부:
 *   building: "사회융합학부"
 *   floor: 1, locationDetail: "사회복지처 방향"    (105개, 1~105)
 *   floor: 1, locationDetail: "학부방 방향"        (30개, 106~135)
 */
