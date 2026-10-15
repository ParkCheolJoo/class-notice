# 학급알림장 운영 정보

- 서비스: https://class-notice-five.vercel.app
- 선생님 관리: https://class-notice-five.vercel.app/admin
- GitHub: https://github.com/ParkCheolJoo/class-notice
- Vercel: class-notice, 함수 리전 icn1 (서울)
- Supabase: class-notice-seoul (Free), ckkkntnamzlluloqpjoy, ap-northeast-2 (서울)

## 실제 공지 운영

예시 공지 6건은 `is_sample=true`, `status=draft`로 비공개 보관합니다. 예시 랭킹의 공개 읽기 정책도 제거했습니다. 학생에게는 선생님이 게시한 실제 공지만 표시합니다.

교사 로그인, 첫 비밀번호 변경, 작성, 임시 저장, 게시, 수정, 휴지통 및 복원을 제공합니다. 임시 저장과 휴지통은 RLS에서도 비공개입니다. 교사 역할은 서버가 관리하는 Auth app_metadata에서 확인합니다. DB 익명 쓰기는 허용하지 않습니다.

추가 게시물 필드: status, is_sample, notice_date, event_date, pinned, updated_at.

임시 비밀번호 안내는 사용자의 Mac 문서 폴더에만 저장합니다. 비밀 환경변수와 자격증명은 Git에 포함하지 않습니다.

검증: 로컬 프로덕션 빌드, 권한 검사 및 공지 생애주기 API 19개 검증, 브라우저 로그인과 임시 저장 확인.

서울 리전 통일은 지연시간 5ms 이하를 보장하지 않습니다.
