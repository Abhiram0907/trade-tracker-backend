import { float } from 'drizzle-orm/mysql-core';
import { pgTable, serial, text, numeric, timestamp, customType } from 'drizzle-orm/pg-core';

const vector = customType<{ data: number[] | null }>({
  dataType() {
    return 'vector(1536)';
  },
});

export const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  symbol: text('symbol').notNull(),
  side: text('side'),
  quantity: numeric('quantity'),
  entry_price: numeric('entry_price'),
  exitPrice: numeric('exit_price'),
  exit_price: timestamp('entry_time'),
  exit_time: timestamp('exit_time'),
  pnl: numeric('pnl'),
  return_percent: numeric('return_percent'),
  status: text('status'),
  strategy_tag: text('strategy_tag'),
  notes: text('notes'),
  tag: numeric('tag').array().default([]),
  embedding: vector('embedding')
});
