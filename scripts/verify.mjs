import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
const base=process.env.TEST_BASE || 'http://localhost:3001';
const service=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const anon=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{auth:{persistSession:false}});
let cookie='',postId; const users=[];let checks=0;
async function call(path,method='GET',value,expected=200,origin=base){const r=await fetch(base+path,{method,headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},...(value===undefined?{}:{body:JSON.stringify(value)})});const d=await r.json();assert.equal(r.status,expected,JSON.stringify(d));checks++;if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return d;}
async function user(role){const email=`test-${randomBytes(8).toString('hex')}@example.com`,password=randomBytes(24).toString('base64url');const r=await service.auth.admin.createUser({email,password,email_confirm:true,app_metadata:{role,must_change_password:true},user_metadata:{role:'teacher'}});assert.ifError(r.error);users.push(r.data.user.id);return {email,password};}
try{
await call('/api/admin/posts','GET',undefined,401);
await call('/api/auth/login','POST',{},403,'https://invalid.example');
const ordinary=await user('student');await call('/api/auth/login','POST',ordinary,401);
const teacher=await user('teacher');await call('/api/auth/login','POST',teacher);await call('/api/admin/posts','GET',undefined,403);
const replacement=randomBytes(24).toString('base64url');await call('/api/auth/password','POST',{currentPassword:teacher.password,password:replacement});await call('/api/auth/login','POST',{email:teacher.email,password:replacement});
await call('/api/admin/posts','POST',{},400);
let {notice}=await call('/api/admin/posts','POST',{title:'자동 검증용 공지',content:'실제 학급 공지가 아닙니다. 검증 후 즉시 제거됩니다.',author:'시스템 검증',category:'학급소식',status:'draft',pinned:false,notice_date:'2026-10-15',event_date:null},201);postId=notice.id;
assert.equal((await anon.from('posts').select('id').eq('id',postId)).data.length,0);checks++;
const stale=notice.updated_at;
({notice}=await call('/api/admin/posts','PATCH',{...notice,status:'published'}));
assert((await call('/api/board')).notices.some(p=>p.id===postId));
await call('/api/admin/posts','PATCH',{...notice,updated_at:stale},409);
await call('/api/admin/posts','DELETE',{id:postId,updated_at:notice.updated_at});
assert(!(await call('/api/board')).notices.some(p=>p.id===postId));
notice=(await call('/api/admin/posts')).notices.find(p=>p.id===postId);
({notice}=await call('/api/admin/posts','PATCH',{id:postId,updated_at:notice.updated_at,action:'restore'}));assert.equal(notice.status,'draft');
await call('/api/auth/logout','POST');await call('/api/admin/posts','GET',undefined,401);
console.log(`PASS: ${checks} checks; authentication, forced password change, role enforcement, draft/publish/trash/restore, RLS, conflict, logout`);
}finally{if(postId){const r=await service.from('posts').delete().eq('id',postId);assert.ifError(r.error);}for(const id of users){const r=await service.auth.admin.deleteUser(id);assert.ifError(r.error);}}
