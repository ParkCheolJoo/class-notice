-- Sample classroom notices (fictional)
insert into public.posts (id,title,content,author,created_at,likes,category,tag,day,date) values (1,'우리의 첫 가을 체육대회','금요일 9시까지 운동장에 모여 주세요. 체육복, 운동화, 개인 물병을 챙기고 아침은 든든하게 먹고 오세요. 우천 시 실내 프로그램으로 변경됩니다.','담임 선생님','2026-10-15T08:00:00+09:00',24,'학교생활','꼭 확인','금','10.16') on conflict (id) do nothing;
insert into public.posts (id,title,content,author,created_at,likes,category,tag,day,date) values (2,'통합과학 탐구 보고서 제출','우리 주변의 에너지 전환 사례를 찾아 탐구 보고서를 작성해 주세요. 탐구 질문, 관찰 기록, 결론을 포함해 월요일 수업 전까지 제출합니다.','과학 선생님','2026-10-14T08:00:00+09:00',12,'수업·과제','D-4','월','10.19') on conflict (id) do nothing;
insert into public.posts (id,title,content,author,created_at,likes,category,tag,day,date) values (3,'2학기 독서 나눔, 함께 읽는 시간','이번 달에 읽은 책 한 권과 마음에 남은 문장을 준비해 주세요. 수요일 자율 시간에 모둠별로 서로의 생각을 나눕니다.','학급 도서부','2026-10-13T08:00:00+09:00',18,'학급소식','함께해요','수','10.21') on conflict (id) do nothing;
insert into public.posts (id,title,content,author,created_at,likes,category,tag,day,date) values (4,'수학 형성평가 안내','이차함수의 그래프와 활용 단원 형성평가가 있습니다. 교과서 82~95쪽과 수업 활동지를 복습해 주세요.','수학 선생님','2026-10-12T08:00:00+09:00',9,'수업·과제','평가','화','10.20') on conflict (id) do nothing;
insert into public.posts (id,title,content,author,created_at,likes,category,tag,day,date) values (5,'교실 속 작은 실천: 분리배출 주간','음료 용기는 비우고 헹군 뒤 분리배출해 주세요. 이번 주 환경 도우미는 2모둠입니다. 깨끗한 교실을 함께 만들어 봐요.','환경부','2026-10-12T08:00:00+09:00',15,'학교생활','이번 주','목','10.15') on conflict (id) do nothing;
insert into public.posts (id,title,content,author,created_at,likes,category,tag,day,date) values (6,'진로 탐색 프로그램 신청','관심 있는 직업 분야의 선배를 만나는 시간입니다. 디자인, 공학, 보건, 교육 중 희망 분야를 골라 담임 선생님께 신청해 주세요.','진로 선생님','2026-10-11T08:00:00+09:00',21,'학급소식','신청','금','10.16') on conflict (id) do nothing;
insert into public.rankings (id,nickname,score) values (1,'꾸준한 연필',150) on conflict (id) do nothing;
insert into public.rankings (id,nickname,score) values (2,'아침의 책장',130) on conflict (id) do nothing;
insert into public.rankings (id,nickname,score) values (3,'탐구하는 별',120) on conflict (id) do nothing;
select setval(pg_get_serial_sequence('public.posts','id'), greatest((select coalesce(max(id),1) from public.posts),1));
select setval(pg_get_serial_sequence('public.rankings','id'), greatest((select coalesce(max(id),1) from public.rankings),1));
