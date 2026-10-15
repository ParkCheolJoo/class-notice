begin;
alter table public.posts add column if not exists status text not null default 'draft' check (status in ('draft','published','trashed'));
alter table public.posts add column if not exists is_sample boolean not null default false;
alter table public.posts add column if not exists notice_date date not null default (now() at time zone 'Asia/Seoul')::date;
alter table public.posts add column if not exists event_date date;
alter table public.posts add column if not exists pinned boolean not null default false;
alter table public.posts add column if not exists updated_at timestamptz not null default now();
-- Archive only the six original generated examples. Keep a recoverable record.
update public.posts set is_sample=true,status='draft' where (id,title) in (
 (1,'우리의 첫 가을 체육대회'),(2,'통합과학 탐구 보고서 제출'),(3,'2학기 독서 나눔, 함께 읽는 시간'),
 (4,'수학 형성평가 안내'),(5,'교실 속 작은 실천: 분리배출 주간'),(6,'진로 탐색 프로그램 신청')
) and created_at < '2026-10-16T00:00:00+09:00';
drop policy if exists "Public notices are readable" on public.posts;
create policy "Public notices are readable" on public.posts for select to anon, authenticated using (status='published' and not is_sample);
-- The ranking feature was demo-only. Keep its records private.
drop policy if exists "Public rankings are readable" on public.rankings;
create index if not exists posts_public_date_idx on public.posts(notice_date desc) where status='published' and not is_sample;
commit;
