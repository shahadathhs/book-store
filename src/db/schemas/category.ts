import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

// * Table
export const CategoryTable = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 255 }).notNull(),

  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
});

// * Types & Schemas
export type Category = typeof CategoryTable.$inferSelect;

const CategoryBaseSchema = createInsertSchema(CategoryTable);

export const NewCategorySchema = CategoryBaseSchema.pick({
  name: true,
});

export type NewCategorySchema = z.infer<typeof NewCategorySchema>;

export const UpdateCategorySchema = CategoryBaseSchema.pick({
  id: true,
  name: true,
});

export type UpdateCategorySchema = z.infer<typeof UpdateCategorySchema>;
