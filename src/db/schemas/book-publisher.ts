import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { BookTable } from './book';

// * Table
export const PublisherTable = pgTable('publishers', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// * Relations
export const PublisherRelations = relations(PublisherTable, ({ many }) => ({
  books: many(BookTable),
}));

// * Types & Schemas
export type Publisher = typeof PublisherTable.$inferSelect;

export const PublisherBaseSchema = createInsertSchema(PublisherTable);

export const NewPublisherSchema = PublisherBaseSchema.pick({
  name: true,
  description: true,
});

export type NewPublisher = typeof NewPublisherSchema;

export const UpdatePublisherSchema = PublisherBaseSchema.pick({
  name: true,
  description: true,
});

export type UpdatePublisher = typeof UpdatePublisherSchema;
