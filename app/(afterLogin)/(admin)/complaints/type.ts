export interface ComplaintApiItem {
  id: number;
  studentNumber: string;
  lockerNumber: string;
  content: string;
  answer: string | null;
  status: string;
  createdAt: string;
}

export type ComplaintStatus = "대기중" | "확인중" | "처리중" | "완료";

export interface ComplaintItem {
  id: number;
  studentNumber: string;
  lockerNumber: string;
  content: string;
  answer: string | null;
  status: ComplaintStatus;
  createdAt: string;
}
