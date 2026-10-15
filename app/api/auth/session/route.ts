import { NextRequest } from 'next/server';
import { failure, json, teacher } from '../../../../lib/server';
export async function GET(request: NextRequest) {
  try { const user = await teacher(request, true); return json({ email: user.email, mustChangePassword: !!user.app_metadata.must_change_password }); }
  catch (error) { return failure(error); }
}
