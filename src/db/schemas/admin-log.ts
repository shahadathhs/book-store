import { relations } from 'drizzle-orm';
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { UsersTable } from './user';

// * Enums
export const LogAction = pgEnum('log_action', [
  'create',
  'update',
  'delete',
  'login',
  'logout',
]);
export const LogActionEnum = z.enum(LogAction.enumValues);
export type LogActionType = z.infer<typeof LogActionEnum>;

// * Table
export const AdminLogsTable = pgTable('admin_logs', {
  id: uuid('id').primaryKey().defaultRandom(),

  adminId: uuid('admin_id').references(() => UsersTable.id, {
    onDelete: 'set null',
  }),

  action: LogAction('action').notNull(),
  details: text('details'),
  success: boolean('success').default(true),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// * Relations
export const AdminLogsRelations = relations(AdminLogsTable, ({ one }) => ({
  admin: one(UsersTable, {
    fields: [AdminLogsTable.adminId],
    references: [UsersTable.id],
  }),
}));

// * Types & Schemas
export type AdminLog = typeof AdminLogsTable.$inferSelect;

const AdminLogBaseSchema = createInsertSchema(AdminLogsTable);

export const NewAdminLogSchema = AdminLogBaseSchema.pick({
  adminId: true,
  action: true,
  details: true,
  success: true,
});

export type NewAdminLog = z.infer<typeof NewAdminLogSchema>;

export const UpdateAdminLogSchema = AdminLogBaseSchema.omit({
  id: true,
  adminId: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateAdminLog = z.infer<typeof UpdateAdminLogSchema>;
