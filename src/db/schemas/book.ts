import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { BookGenreTable } from './book-genre';
import { PublisherTable } from './book-publisher';
import { UsersTable } from './user';

// * Enums
export const BookStatus = pgEnum('book_status', [
  'draft',
  'published',
  'archived',
]);
export const BookStatusEnum = z.enum(BookStatus.enumValues);
export type BookStatus = z.infer<typeof BookStatusEnum>;

// * Table
export const BookTable = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),

  publisher: uuid('publisher_id').references(() => PublisherTable.id, {
    onDelete: 'set null',
  }),
  author: uuid('author_id').references(() => UsersTable.id, {
    onDelete: 'cascade',
  }),
  genre: uuid('genre_id').references(() => BookGenreTable.id, {
    onDelete: 'set null',
  }),

  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary').notNull(),
  status: BookStatus('status').default('draft'),
  pages: integer('pages').notNull(),

  publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// * Relations
export const BookRelations = relations(BookTable, ({ one }) => ({
  author: one(UsersTable, {
    fields: [BookTable.author],
    references: [UsersTable.id],
  }),
  publisher: one(PublisherTable, {
    fields: [BookTable.publisher],
    references: [PublisherTable.id],
  }),
  genre: one(BookGenreTable, {
    fields: [BookTable.genre],
    references: [BookGenreTable.id],
  }),
}));

// * Types & Schemas
export type Book = typeof BookTable.$inferSelect;

const BookBaseSchema = createInsertSchema(BookTable);

export const NewBookSchema = BookBaseSchema.pick({
  title: true,
  summary: true,
});

export type NewBook = z.infer<typeof NewBookSchema>;

export const UpdateBookSchema = BookBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateBook = z.infer<typeof UpdateBookSchema>;
