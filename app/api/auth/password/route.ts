import { NextRequest } from 'next/server';
import { ApiError, body, clearSession, database, failure, json, sameOrigin, teacher } from '../../../../lib/server';
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request); const user = await teacher(request, true); const value = await body(request);
    if (typeof value?.password !== 'string' || value.password.length < 12 || value.password.length > 128 || !/[a-zA-Z]/.test(value.password) || !/[^a-zA-Z]/.test(value.password) || typeof value?.currentPassword !== 'string') throw new ApiError(400, '영문과 숫자 또는 기호를 섞어 12자 이상으로 입력해 주세요.');
    if (value.password === value.currentPassword) throw new ApiError(400, '현재 비밀번호와 다른 비밀번호를 입력해 주세요.');
    const check = await database().auth.signInWithPassword({ email: user.email!, password: value.currentPassword });
    if (check.error) throw new ApiError(400, '현재 비밀번호가 올바르지 않습니다.');
    const { error } = await database(true).auth.admin.updateUserById(user.id, { password: value.password, app_metadata: { ...user.app_metadata, must_change_password: false } });
    if (error) throw new ApiError(400, '비밀번호를 변경하지 못했습니다. 다른 비밀번호로 시도해 주세요.');
    await database(true).auth.admin.signOut(check.data.session!.access_token, 'global');
    return clearSession(json({ ok: true }));
  } catch (error) { return failure(error); }
}
