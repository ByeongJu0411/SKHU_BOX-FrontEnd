export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
