# 학급알림장

고등학교 1학년을 위한 주간 대시보드. Next.js App Router, TypeScript, Supabase.

## 실행

`npm install` → `npm run dev`

프로덕션 빌드: `npm run build`

## 데이터베이스

Supabase 서울(ap-northeast-2)에 `supabase/schema.sql`을 실행하고 `.env.example`의 두 변수를 설정합니다. 미연결 상태는 예시 학급으로 명확히 표시합니다. 공지는 DB에서 읽으며, 개인 할 일과 공감은 브라우저에 저장됩니다. DB 쓰기는 관리자에게만 허용됩니다.

Vercel 서버리스 함수는 `vercel.json`에서 서울(icn1)로 설정됩니다. 실제 지연시간은 배포 후 별도 측정해야 합니다.
