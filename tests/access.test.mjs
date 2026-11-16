import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPair,SignJWT,createLocalJWKSet,exportJWK} from 'jose';
import {accessConfig,verifyAccess} from '../lib/access.ts';
const {privateKey,publicKey}=await generateKeyPair('RS256');
const jwk=await exportJWK(publicKey);jwk.kid='test';
const resolver=createLocalJWKSet({keys:[jwk]});
const config={issuer:'https://unit-test.cloudflareaccess.com',audience:'test-aud',email:'owner@example.test'};
async function token(overrides={}){return new SignJWT({email:'owner@example.test',...overrides}).setProtectedHeader({alg:'RS256',kid:'test'}).setSubject('owner-id').setIssuer(config.issuer).setAudience(config.audience).setIssuedAt().setExpirationTime('5m').sign(privateKey)}
test('configuration fails closed',()=>{assert.equal(accessConfig({}),null);assert.equal(accessConfig({TEAM_DOMAIN:'http://evil.test',POLICY_AUD:'a',OWNER_EMAIL:'x'}),null)});
test('valid signed owner token accepted',async()=>{assert.deepEqual(await verifyAccess(await token(),config,resolver),{userId:'owner-id',email:'owner@example.test'})});
test('wrong owner, wrong audience, unsigned and expired tokens denied',async()=>{await assert.rejects(verifyAccess(await token({email:'other@example.test'}),config,resolver));await assert.rejects(verifyAccess(await token(),{...config,audience:'wrong'},resolver));await assert.rejects(verifyAccess('fake.token.value',config,resolver));const expired=await new SignJWT({email:config.email}).setProtectedHeader({alg:'RS256',kid:'test'}).setSubject('id').setIssuer(config.issuer).setAudience(config.audience).setIssuedAt(1).setExpirationTime(2).sign(privateKey);await assert.rejects(verifyAccess(expired,config,resolver))});
