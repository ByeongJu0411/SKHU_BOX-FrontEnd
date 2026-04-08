export type StudentStatus = "이용중" | "만료임박";

export interface StudentItem {
  id: string;
  name: string;
  email: string;
  studentId: string;
  dept: string;
  grade: number;
  lockerId: string;
  building: string;
  location: string;
  status: StudentStatus;
  startDate: string;
  endDate: string;
  dDay: string;
  complaintCount: number;
}
