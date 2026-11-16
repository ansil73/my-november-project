import {Miniflare} from 'miniflare';
import {generateKeyPair,SignJWT,exportJWK} from 'jose';
const {privateKey,publicKey}=await generateKeyPair('RS256');
const jwk=await exportJWK(publicKey);jwk.kid='integration';
const issuer='https://integration-test.cloudflareaccess.com';
async function jwt(user){return new SignJWT({email:'owner@example.test'}).setProtectedHeader({alg:'RS256',kid:'integration'}).setSubject(user).setIssuer(issuer).setAudience('test-aud').setIssuedAt().setExpirationTime('5m').sign(privateKey)}
import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const files=(await readdir('dist/server',{recursive:true})).filter(p=>p.endsWith('.js')&&p!=='index.js');
const mf=new Miniflare({modules:['index.js',...files].map(p=>({type:'ESModule',path:'dist/server/'+p})),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],bindings:{TEAM_DOMAIN:issuer,POLICY_AUD:'test-aud',OWNER_EMAIL:'owner@example.test'},outboundService:async req=>{if(req.url===issuer+'/cdn-cgi/access/certs')return new Response(JSON.stringify({keys:[jwk]}),{headers:{'Content-Type':'application/json'}});return new Response('Blocked test request',{status:403})}});
try{
 const db=await mf.getD1Database('DB');
 const migration=await readFile('drizzle/0000_chief_newton_destine.sql','utf8');
 for(const statement of migration.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean))await db.prepare(statement).run();
 const base='https://local-test.example';
 async function call(method='GET',body,user,origin=base){const headers={};if(user){headers['cf-access-jwt-assertion']=await jwt(user)}if(method==='POST'){headers.Origin=origin;headers['Content-Type']='application/json'}return mf.dispatchFetch(base+'/api/watchlist',{method,headers,...(body!==undefined?{body:JSON.stringify(body)}:{})})}
 assert.equal((await call()).status,401);
 assert.equal((await call('POST',{symbol:'TCS',saved:true},'alice','https://wrong.example')).status,403);
 assert.equal((await call('POST',{symbol:'UNKNOWN',saved:true},'alice')).status,400);
 assert.equal((await call('POST',{symbol:'TCS',saved:true,userId:'bob'},'alice')).status,400);
 assert.equal((await call('POST',{symbol:'TCS',saved:true},'alice')).status,200);
 assert.deepEqual(await (await call('GET',undefined,'alice')).json(),{symbols:['TCS']});
 assert.deepEqual(await (await call('GET',undefined,'bob')).json(),{symbols:[]});
 assert.equal((await call('POST',{symbol:'TCS',saved:false},'bob')).status,200);
 assert.deepEqual(await (await call('GET',undefined,'alice')).json(),{symbols:['TCS']});
 assert.equal((await call('POST',{symbol:'TCS',saved:true},'alice')).status,200);
 assert.deepEqual(await (await call('GET',undefined,'alice')).json(),{symbols:['TCS']});
 assert.equal((await call('POST',{symbol:'TCS',saved:false},'alice')).status,200);
 assert.deepEqual(await (await call('GET',undefined,'alice')).json(),{symbols:[]});
 for(let i=0;i<30;i++)assert.equal((await call('POST',{symbol:'ITC',saved:false},'rate-test')).status,200);
 const limited=await call('POST',{symbol:'ITC',saved:false},'rate-test');assert.equal(limited.status,429);assert.equal(limited.headers.get('Retry-After'),'60');
 const spoofed=await mf.dispatchFetch(base+'/api/watchlist',{headers:{'x-marketscope-user-id':'alice','x-marketscope-user-email':'owner@example.test','oai-authenticated-user-id':'alice'}});assert.equal(spoofed.status,401);
 const r=await mf.dispatchFetch(base+'/api/market',{headers:{'cf-access-jwt-assertion':await jwt('alice')}});const market=await r.json();assert.equal(market.mode,'demo');assert.equal(market.marketTimestamp,null);assert.equal(market.automaticUpdates,false);assert.equal(r.headers.get('Cache-Control'),'private, no-store');assert.equal(r.headers.get('X-Content-Type-Options'),'nosniff');
 console.log('PASS: production Worker auth, origin validation, record isolation, persistence, idempotency, deletion, rate limiting and demo-data integrity.');
}finally{await mf.dispose()}
