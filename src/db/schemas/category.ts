import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import z from 'zod';

export const CategoryTable = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 255 }).notNull(),

  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
});

export type Category = z.infer<typeof CategoryTable.$inferSelect>;
export type NewCategory = z.infer<typeof CategoryTable.$inferInsert>;
export type UpdateCategory = Partial<NewCategory>;
