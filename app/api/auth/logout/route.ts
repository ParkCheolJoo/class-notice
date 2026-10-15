import { NextRequest } from 'next/server';
import { clearSession, database, failure, json, sameOrigin } from '../../../../lib/server';
export async function POST(request: NextRequest) {
  try { sameOrigin(request); const token = request.cookies.get('class-note-session')?.value;
    if (token) await database(true).auth.admin.signOut(token, 'local');
    return clearSession(json({ ok: true }));
  } catch (error) { return failure(error); }
}
