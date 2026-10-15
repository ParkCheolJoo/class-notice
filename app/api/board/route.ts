import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notices, rankings } from '../../../lib/data';
export const dynamic='force-dynamic';
export async function GET(){
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.SUPABASE_ANON_KEY||process.env.SUPABASE_PUBLISHABLE_KEY;
if(!url||!key)return NextResponse.json({notices,rankings,source:'demo',region:process.env.VERCEL_REGION||'local'});
try{const started=performance.now();const db=createClient(url,key);const [p,r]=await Promise.all([db.from('posts').select('*').order('created_at',{ascending:false}),db.from('rankings').select('*').order('score',{ascending:false}).limit(10)]);if(p.error||r.error)throw new Error('Database unavailable');return NextResponse.json({notices:p.data,rankings:r.data,source:'supabase',region:process.env.VERCEL_REGION||'local',queryMs:Math.round(performance.now()-started)});}catch{return NextResponse.json({notices,rankings,source:'demo',region:process.env.VERCEL_REGION||'local',message:'DB 연결을 확인하는 동안 예시를 표시합니다.'});}}
