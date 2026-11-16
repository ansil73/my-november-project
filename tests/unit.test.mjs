import {test} from 'node:test';
import assert from 'node:assert/strict';
import {longCall} from '../lib/market.ts';
import {smallJson,validateMutation} from '../lib/security.ts';
test('long call: max premium loss, breakeven, profitable expiry',()=>{assert.deepEqual(longCall(100,5,10,90),{profit:-50,maxLoss:50,breakeven:105});assert.equal(longCall(100,5,10,105).profit,0);assert.equal(longCall(100,5,10,120).profit,150)});
test('calculator rejects non-finite, negative and fractional unit inputs',()=>{for(const args of [[100,5,0,120],[100,5,1.5,120],[100,-5,10,120],[100,5,10,-1],[Infinity,5,10,120]])assert.throws(()=>longCall(...args))});
test('cross-origin and content-type protections',()=>{assert.equal(validateMutation(new Request('https://site.test/api',{method:'POST',headers:{Origin:'https://evil.test','Content-Type':'application/json'}})).status,403);assert.equal(validateMutation(new Request('https://site.test/api',{method:'POST',headers:{Origin:'https://site.test','Content-Type':'text/plain'}})).status,415);assert.equal(validateMutation(new Request('https://site.test/api',{method:'POST',headers:{Origin:'https://site.test','Content-Type':'application/json'}})),null)});
test('streamed body limit and valid JSON',async()=>{assert.deepEqual(await smallJson(new Request('https://site.test',{method:'POST',body:'{"saved":true}'})),{saved:true});await assert.rejects(smallJson(new Request('https://site.test',{method:'POST',body:'x'.repeat(3000)})));await assert.rejects(smallJson(new Request('https://site.test',{method:'POST',body:'invalid'})))});
