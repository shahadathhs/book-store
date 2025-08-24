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
import { BookGenreTable } from './book-genre';
import { PublisherTable } from './book-publisher';
import { UsersTable } from './user';

export const BookStatus = pgEnum('book_status', [
  'draft',
  'published',
  'archived',
]);

export const BookTable = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  publisher: uuid('publisher_id').references(() => PublisherTable.id, {
    onDelete: 'set null',
  }),
  author: uuid('author_id').references(() => UsersTable.id, {
    onDelete: 'cascade',
  }),
  summary: text('summary').notNull(),
  status: BookStatus('status').default('draft'),
  pages: integer('pages').notNull(),
  genre: uuid('genre_id').references(() => BookGenreTable.id, {
    onDelete: 'set null',
  }),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Book = typeof BookTable.$inferSelect;
export type NewBook = typeof BookTable.$inferInsert;
export type UpdateBook = Partial<NewBook>;

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
