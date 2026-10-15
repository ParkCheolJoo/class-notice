import './globals.css';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'학급알림장 — 우리의 한 주',description:'고등학교 1학년을 위한 주간 공지, 일정, 할 일 대시보드'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
