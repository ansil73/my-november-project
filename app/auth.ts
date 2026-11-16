import {headers} from 'next/headers';
export async function getUser(){const h=await headers();const userId=h.get('x-marketscope-user-id'),email=h.get('x-marketscope-user-email');return userId&&email?{userId,email}:null}
