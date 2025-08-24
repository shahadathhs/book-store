import {
  boolean,
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { OrdersTable } from './order';
import { UsersTable } from './user';

export const PaymentStatus = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);

export const PaymentsTable = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => OrdersTable.id, {
    onDelete: 'cascade',
  }),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('usd'),
  status: PaymentStatus('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ================= Admin Logs =================
export const AdminLogsTable = pgTable('admin_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => UsersTable.id, {
    onDelete: 'set null',
  }),
  action: varchar('action', { length: 255 }).notNull(),
  details: text('details'),
  success: boolean('success').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
