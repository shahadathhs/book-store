import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { BookTable } from './book';
import { OrdersTable } from './order';

// * Table
export const OrderItemsTable = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),

  orderId: uuid('order_id').references(() => OrdersTable.id, {
    onDelete: 'cascade',
  }),
  bookId: uuid('book_id').references(() => BookTable.id, {
    onDelete: 'set null',
  }),

  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// * Relations
export const OrderItemsRelations = relations(OrderItemsTable, ({ one }) => ({
  order: one(OrdersTable, {
    fields: [OrderItemsTable.orderId],
    references: [OrdersTable.id],
  }),
  book: one(BookTable, {
    fields: [OrderItemsTable.bookId],
    references: [BookTable.id],
  }),
}));

// * Types & Schemas
export type OrderItem = typeof OrderItemsTable.$inferSelect;

const OrderItemsBaseSchema = createInsertSchema(OrderItemsTable);

export const NewOrderItemSchema = OrderItemsBaseSchema.pick({
  orderId: true,
  bookId: true,
  quantity: true,
  price: true,
});

export type NewOrderItem = z.infer<typeof NewOrderItemSchema>;

export const UpdateOrderItemSchema = OrderItemsBaseSchema.pick({
  id: true,
  quantity: true,
  price: true,
});

export type UpdateOrderItem = z.infer<typeof UpdateOrderItemSchema>;
