import {sqliteTable,text,integer,primaryKey} from 'drizzle-orm/sqlite-core';
export const watchlist=sqliteTable('watchlist',{userId:text('user_id').notNull(),symbol:text('symbol').notNull(),createdAt:text('created_at').notNull()},t=>[primaryKey({columns:[t.userId,t.symbol]})]);
export const limits=sqliteTable('request_limits',{userId:text('user_id').primaryKey(),window:integer('window').notNull(),count:integer('count').notNull()});
