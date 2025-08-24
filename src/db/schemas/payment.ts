import { relations } from 'drizzle-orm';
import {
  decimal,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import z from 'zod';
import { OrdersTable } from './order';

// * Enums
export const PaymentStatus = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);
export const PaymentStatusEnum = z.enum(PaymentStatus.enumValues);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

// * Table
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
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// * Relations
export const PaymentsRelations = relations(PaymentsTable, ({ one }) => ({
  order: one(OrdersTable, {
    fields: [PaymentsTable.orderId],
    references: [OrdersTable.id],
  }),
}));
