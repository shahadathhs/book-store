import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { UsersTable } from './user';

export const AdminLogsTable = pgTable('admin_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => UsersTable.id, {
    onDelete: 'set null',
  }),
  action: varchar('action', { length: 255 }).notNull(),
  details: text('details'),
  success: boolean('success').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
