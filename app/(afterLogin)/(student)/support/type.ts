// 백엔드 API 응답 타입 (/api/complaints/my)
export interface ComplaintApiItem {
  id: number;
  studentNumber: string;
  lockerNumber: string;
  content: string;
  answer: string | null;
  status: string; // 백엔드 상태값 (PENDING, IN_PROGRESS, RESOLVED 등)
  createdAt: string; // ISO 날짜 "2026-05-12T05:01:21.619Z"
}

// 프론트에서 사용하는 타입
export type RequestStatus = "접수대기" | "처리중" | "처리완료";

export interface RequestItem {
  id: number;
  lockerNumber: string;
  content: string;
  answer: string | null;
  status: RequestStatus;
  createdAt: string;
}
