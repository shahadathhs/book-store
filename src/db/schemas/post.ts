import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { UsersTable } from './user';

export const PostStatus = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

export const PostTable = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),

  author: uuid('author').references(() => UsersTable.id, {
    onDelete: 'set null',
  }),

  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),

  status: PostStatus('status').notNull().default('draft'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Post = typeof PostTable.$inferSelect;

const PostStatusEnum = z.enum(PostStatus.enumValues);
export type PostStatus = z.infer<typeof PostStatusEnum>;

export const NewPostSchema = createInsertSchema(PostTable).omit({
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type NewPost = z.infer<typeof NewPostSchema>;

export const UpdatePostSchema = NewPostSchema.partial()
  .omit({
    author: true,
    id: true,
  })
  .extend({
    status: z.enum(PostStatus.enumValues),
  })
  .partial();

export type UpdatePost = z.infer<typeof UpdatePostSchema>;
