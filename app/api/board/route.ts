import { database, failure, json } from '../../../lib/server';
import { postFields } from '../../../lib/types';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const { data, error } = await database().from('posts').select(postFields).eq('status', 'published').eq('is_sample', false).order('pinned', { ascending: false }).order('notice_date', { ascending: false }).order('created_at', { ascending: false });
    if (error) throw error;
    return json({ notices: data, source: 'supabase', region: process.env.VERCEL_REGION || 'local' });
  } catch (error) { return failure(error); }
}
