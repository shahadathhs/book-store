import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { UsersTable } from './user';

// * Table
export const OtpTable = pgTable('otps', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id').references(() => UsersTable.id, {
    onDelete: 'cascade',
  }),

  code: varchar('code', { length: 10 }).notNull(),
  purpose: varchar('purpose', { length: 50 }).notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  used: boolean('used').default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// * Types & Schemas
export type Otp = typeof OtpTable.$inferInsert;

const OtpBaseSchema = createInsertSchema(OtpTable);

export const NewOtpSchema = OtpBaseSchema.pick({
  userId: true,
  code: true,
  purpose: true,
  expiresAt: true,
});

export type NewOtp = z.infer<typeof NewOtpSchema>;

export const UpdateOtpSchema = OtpBaseSchema.pick({
  used: true,
});

export type UpdateOtp = z.infer<typeof UpdateOtpSchema>;

export const OtpRelations = relations(OtpTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [OtpTable.userId],
    references: [UsersTable.id],
  }),
}));
