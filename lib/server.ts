import 'server-only';
import { createClient, type Session } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export function database(admin = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = admin ? process.env.SUPABASE_SERVICE_ROLE_KEY : (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY);
  if (!url || !key) throw new Error('데이터베이스 연결 설정을 확인해 주세요.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(12000), cache: 'no-store' }) } });
}
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}
export function failure(error: unknown) {
  return json({ error: error instanceof ApiError ? error.message : '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, error instanceof ApiError ? error.status : 503);
}
export function sameOrigin(request: NextRequest) {
  if (request.headers.get('origin') !== new URL(request.url).origin) throw new ApiError(403, '허용되지 않은 요청입니다.');
}
export async function body(request: NextRequest) {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new ApiError(415, 'JSON 요청만 허용됩니다.');
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 64000) throw new ApiError(413, '내용이 너무 깁니다.');
  try { return JSON.parse(raw); } catch { throw new ApiError(400, '입력 내용을 확인해 주세요.'); }
}
export async function teacher(request: NextRequest, allowTemporary = false) {
  const token = request.cookies.get('class-note-session')?.value;
  if (!token) throw new ApiError(401, '선생님 로그인이 필요합니다.');
  const { data, error } = await database().auth.getUser(token);
  if (error || !data.user) throw new ApiError(401, '로그인이 만료되었습니다. 다시 로그인해 주세요.');
  if (data.user.app_metadata.role !== 'teacher' || !data.user.email_confirmed_at) throw new ApiError(403, '공지 관리 권한이 없습니다.');
  if (!allowTemporary && data.user.app_metadata.must_change_password) throw new ApiError(403, '먼저 임시 비밀번호를 변경해 주세요.');
  return data.user;
}
export function setSession(response: NextResponse, session: Session) {
  response.cookies.set('class-note-session', session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: session.expires_in });
  return response;
}
export function clearSession(response: NextResponse) {
  response.cookies.set('class-note-session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
