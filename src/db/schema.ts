import { pgTable, serial, text, numeric, timestamp, customType, uuid } from 'drizzle-orm/pg-core';

const vector = customType<{ data: number[] | null }>({
  dataType() {
    return 'vector(1536)';
  },
});

export const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  user_id: text('user_id'),
  symbol: text('symbol').notNull(),
  side: text('side'),
  quantity: numeric('quantity'),
  entry_price: numeric('entry_price'),
  exit_price: numeric('exit_price'),
  entry_time: timestamp('entry_time'),
  exit_time: timestamp('exit_time'),
  pnl: numeric('pnl'),
  return_percent: numeric('return_percent'),
  status: text('status'),
  embedding: vector('embedding'),
  journal_id: numeric('journal_id').default('1')
});

export const journals = pgTable('journals', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id').notNull(),
  name: text('name').notNull(),
  initial_balance: numeric('initial_balance').notNull().default("0"),
  current_balance: numeric('current_balance').notNull().default("0"),
  created_at: timestamp('created_at', { withTimezone: false }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false }).defaultNow()
});