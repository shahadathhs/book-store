import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { BookTable } from './book';
import { OrdersTable } from './order';

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
