import { relations } from 'drizzle-orm';
import { decimal, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import z from 'zod';
import { UsersTable } from './user';

export const OrderStatus = pgEnum('order_status', [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
]);

export const OrdersTable = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id').references(() => UsersTable.id, {
    onDelete: 'set null',
  }),

  status: OrderStatus('status').default('pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const OrdersRelations = relations(OrdersTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [OrdersTable.userId],
    references: [UsersTable.id],
  }),
}));

const OrderStatusEnums = z.enum(OrderStatus.enumValues);
export type OrderStatus = z.infer<typeof OrderStatusEnums>;

export type Order = z.infer<typeof OrdersTable.$inferSelect>;
export type NewOrder = z.infer<typeof OrdersTable.$inferInsert>;
export type UpdateOrder = Partial<NewOrder>;
