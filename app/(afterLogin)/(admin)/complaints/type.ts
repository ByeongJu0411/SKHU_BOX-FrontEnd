export type ComplaintStatus = "대기중" | "확인중" | "처리중" | "완료";

export interface ComplaintItem {
  id: string;
  title: string;
  description: string;
  category: string;
  userName: string;
  userDept: string;
  userStudentId: string;
  lockerId: string;
  building: string;
  location: string;
  createdAt: string;
  timeAgo: string;
  status: ComplaintStatus;
  content: string;
}
