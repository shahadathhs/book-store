import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { BookTable } from './book';

export const BookGenreTable = pgTable('books_genre', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type BookGenre = typeof BookGenreTable.$inferSelect;
export type NewBookGenre = typeof BookGenreTable.$inferInsert;
export type UpdateBookGenre = Partial<NewBookGenre>;

export const BookGenreRelations = relations(BookGenreTable, ({ many }) => ({
  books: many(BookTable),
}));
