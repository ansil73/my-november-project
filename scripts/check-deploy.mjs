import {readFileSync} from 'node:fs';
const source=JSON.parse(readFileSync('wrangler.json','utf8'));
const build=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
const database=source.d1_databases?.find(x=>x.binding==='DB');
if(!database||database.database_id==='00000000-0000-4000-8000-000000000000')throw Error('Set your real D1 database_id in wrangler.json, then npm run build.');
if(build.name!==source.name||build.d1_databases?.find(x=>x.binding==='DB')?.database_id!==database.database_id)throw Error('Deployment config is stale. Run npm run build again.');
if(JSON.stringify(build.vars)!==JSON.stringify(source.vars))throw Error('Access settings changed. Run npm run build again.');
if(!build.assets?.run_worker_first)throw Error('Asset authentication requires run_worker_first=true.');
console.log('Deployment config verified. Missing Access configuration will fail closed until configured.');
