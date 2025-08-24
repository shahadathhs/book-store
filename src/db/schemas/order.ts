import { relations } from 'drizzle-orm';
import { decimal, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { UsersTable } from './user';

// * Enums
export const OrderStatus = pgEnum('order_status', [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
]);
export const OrderStatusEnums = z.enum(OrderStatus.enumValues);
export type OrderStatus = z.infer<typeof OrderStatusEnums>;

// * Table
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

// * Relations
export const OrdersRelations = relations(OrdersTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [OrdersTable.userId],
    references: [UsersTable.id],
  }),
}));

// * Types & Schemas
export type Order = typeof OrdersTable.$inferSelect;

const OrderBaseSchema = createInsertSchema(OrdersTable);

export const NewOrderSchema = OrderBaseSchema.pick({
  userId: true,
  status: true,
  totalAmount: true,
});

export type NewOrder = z.infer<typeof NewOrderSchema>;

export const UpdateOrderSchema = OrderBaseSchema.pick({
  id: true,
  status: true,
  totalAmount: true,
});

export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
