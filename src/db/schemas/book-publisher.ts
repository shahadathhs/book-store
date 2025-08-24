import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { BookTable } from './book';

export const PublisherTable = pgTable('publishers', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Publisher = typeof PublisherTable.$inferSelect;
export type NewPublisher = typeof PublisherTable.$inferInsert;
export type UpdatePublisher = Partial<NewPublisher>;

export const PublisherRelations = relations(PublisherTable, ({ many }) => ({
  books: many(BookTable),
}));
