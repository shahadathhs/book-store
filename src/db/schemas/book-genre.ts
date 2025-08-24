import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { BookTable } from './book';

// * Table
export const BookGenreTable = pgTable('books_genre', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// * Relations
export const BookGenreRelations = relations(BookGenreTable, ({ many }) => ({
  books: many(BookTable),
}));

// * Types & Schemas
export type BookGenre = typeof BookGenreTable.$inferSelect;

const BookGenreBaseSchema = createInsertSchema(BookGenreTable);

export const NewBookGenreSchema = BookGenreBaseSchema.pick({
  name: true,
  description: true,
});

export type NewBookGenre = typeof NewBookGenreSchema;

export const UpdateBookGenreSchema = BookGenreBaseSchema.pick({
  name: true,
  description: true,
});

export type UpdateBookGenre = typeof UpdateBookGenreSchema;
