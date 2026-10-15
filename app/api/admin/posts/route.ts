import { NextRequest } from 'next/server';
import { ApiError, body, database, failure, json, sameOrigin, teacher } from '../../../../lib/server';
import { categories, postFields } from '../../../../lib/types';
function date(value: unknown, optional = false): string | null {
  if (optional && (value === '' || value === null)) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new ApiError(400, '날짜를 확인해 주세요.');
  return value;
}
function validate(v: Record<string, unknown>) {
  if (!v || typeof v !== 'object' || typeof v.title !== 'string' || !v.title.trim() || v.title.trim().length > 200 || typeof v.content !== 'string' || !v.content.trim() || v.content.length > 10000 || typeof v.author !== 'string' || !v.author.trim() || v.author.length > 60 || !categories.includes(v.category as typeof categories[number]) || !['draft', 'published'].includes(v.status as string) || typeof v.pinned !== 'boolean') throw new ApiError(400, '제목·내용·작성자와 분류를 확인해 주세요.');
  return { title: v.title.trim(), content: v.content.trim(), author: v.author.trim(), category: v.category, pinned: v.pinned, status: v.status, notice_date: date(v.notice_date), event_date: date(v.event_date, true), tag: null, date: null, day: null };
}
function id(value: unknown) { if (!Number.isSafeInteger(value) || Number(value) < 1) throw new ApiError(400, '공지를 선택해 주세요.'); return Number(value); }
export async function GET(request: NextRequest) {
  try { await teacher(request); const { data, error } = await database(true).from('posts').select(postFields).eq('is_sample', false).order('created_at', { ascending: false }); if (error) throw error; return json({ notices: data }); }
  catch (error) { return failure(error); }
}
export async function POST(request: NextRequest) {
  try { sameOrigin(request); await teacher(request); const values = validate(await body(request));
    const { data, error } = await database(true).from('posts').insert({ ...values, is_sample: false, likes: 0 }).select(postFields).single();
    if (error) throw error; return json({ notice: data }, 201);
  } catch (error) { return failure(error); }
}
export async function PATCH(request: NextRequest) {
  try { sameOrigin(request); await teacher(request); const value = await body(request); const postId = id(value?.id);
    // A restored item always returns to drafts, so restoration never publishes accidentally.
    const values = value.action === 'restore' ? { status: 'draft' } : validate(value);
    if (typeof value.updated_at !== 'string') throw new ApiError(400, '공지를 새로 불러온 뒤 수정해 주세요.');
    const { data, error } = await database(true).from('posts').update({ ...values, updated_at: new Date().toISOString() }).eq('id', postId).eq('is_sample', false).eq('updated_at', value.updated_at).select(postFields).maybeSingle();
    if (error) throw error; if (!data) throw new ApiError(409, '다른 곳에서 수정된 공지입니다. 목록을 새로고침해 주세요.'); return json({ notice: data });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: NextRequest) {
  try { sameOrigin(request); await teacher(request); const value = await body(request); const postId = id(value?.id);
    if (typeof value.updated_at !== 'string') throw new ApiError(400, '공지를 새로 불러와 주세요.');
    const { data, error } = await database(true).from('posts').update({ status: 'trashed', updated_at: new Date().toISOString() }).eq('id', postId).eq('is_sample', false).eq('updated_at', value.updated_at).select('id').maybeSingle();
    if (error) throw error; if (!data) throw new ApiError(409, '공지가 변경되었습니다. 목록을 새로고침해 주세요.'); return json({ ok: true });
  } catch (error) { return failure(error); }
}
