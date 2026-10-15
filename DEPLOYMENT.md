# 배포 확인 결과

- 서비스: https://class-notice-five.vercel.app
- GitHub: https://github.com/ParkCheolJoo/class-notice
- Vercel 프로젝트: class-notice
- Supabase: class-notice-seoul (Free), ckkkntnamzlluloqpjoy
- Vercel 실제 API 실행 리전: icn1
- Supabase 인프라 리전: ap-northeast-2 (Seoul)
- 게시물 posts: 6건, 랭킹 rankings: 3건
- 양쪽 테이블 RLS 활성화, 공개 읽기 정책 각 1개, 익명 쓰기 정책 없음
- 로컬 npm run build 통과 및 프로덕션 API DB 읽기 확인
- 브라우저에서 테마 전환, 검색, 필터, 개인 할 일 완료 확인
- 환경변수 .env.local 동기화, Git 추적 제외, 파일 권한 600
- 개인 할 일과 공감은 현재 브라우저에만 저장
- 측정된 두 테이블 조회 시간: 67~133ms. 네트워크 RTT 단독 측정이 아니며 5ms 이하를 보장하지 않음.

게시물 필드: id, title, content, author, created_at, likes, category, tag, day, date
랭킹 필드: id, nickname, score, played_at
