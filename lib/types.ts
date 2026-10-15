export const categories = ['학급소식', '학교생활', '수업·과제'] as const;
export type NoticeStatus = 'draft' | 'published' | 'trashed';
export type Notice = {
  id: number; title: string; content: string; author: string; created_at: string;
  updated_at: string; likes: number; category: string; tag: string | null;
  notice_date: string; event_date: string | null; pinned: boolean; status: NoticeStatus;
};
export const postFields = 'id,title,content,author,created_at,updated_at,likes,category,tag,notice_date,event_date,pinned,status';
export function seoulToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
export function weekRange(today: string, offset = 0) {
  const start = new Date(today + 'T00:00:00Z');
  const day = start.getUTCDay();
  start.setUTCDate(start.getUTCDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  const end = new Date(start); end.setUTCDate(start.getUTCDate() + 6);
  return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)] as const;
}
