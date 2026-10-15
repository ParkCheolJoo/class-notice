import { NextRequest } from 'next/server';
import { ApiError, body, database, failure, json, sameOrigin, setSession } from '../../../../lib/server';
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request); const value = await body(request);
    if (typeof value?.email !== 'string' || typeof value?.password !== 'string' || value.email.length > 254 || value.password.length > 128) throw new ApiError(400, '이메일과 비밀번호를 확인해 주세요.');
    const { data, error } = await database().auth.signInWithPassword({ email: value.email.trim(), password: value.password });
    if (error || !data.session || data.user.app_metadata.role !== 'teacher' || !data.user.email_confirmed_at) throw new ApiError(error?.status === 429 ? 429 : 401, error?.status === 429 ? '로그인 시도가 많습니다. 잠시 후 다시 시도해 주세요.' : '이메일 또는 비밀번호가 올바르지 않거나 관리 권한이 없습니다.');
    return setSession(json({ email: data.user.email, mustChangePassword: !!data.user.app_metadata.must_change_password }), data.session);
  } catch (error) { return failure(error); }
}
