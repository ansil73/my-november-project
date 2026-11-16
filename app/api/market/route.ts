import {stocks,indices,sectors} from '../../../lib/market';
export async function GET(){return Response.json({mode:'demo',source:'Synthetic interface examples',marketTimestamp:null,providerConnected:false,automaticUpdates:false,stocks,indices,sectors})}
