export type RequestCategory = "수리 요청" | "자리 이동" | "문의";
export type RequestStatus = "접수대기" | "처리중" | "처리완료";

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  lockerId: string;
  building: string;
  location: string;
  createdAt: string;
  status: RequestStatus;
  content: string;
}
