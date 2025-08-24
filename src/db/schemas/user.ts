import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { BookTable } from './book';
import { OtpTable } from './otp';

export const UserRole = pgEnum('user_roles', ['super_admin', 'admin', 'user']);
export const UserStatus = pgEnum('user_status', ['active', 'inactive']);
export const UserLoginStatus = pgEnum('user_login_status', ['login', 'logout']);

export const UsersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  // for authentication
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  role: UserRole('role').default('user'),

  // for delete account (by user) or inactive account (by admin)
  status: UserStatus('status').default('active'),
  lastActiveAt: timestamp('last_active_at', {
    withTimezone: true,
  }).defaultNow(),

  // for login
  loginStatus: UserLoginStatus('login_status').default('logout'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }).defaultNow(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof UsersTable.$inferSelect;

const UserBaseSchema = createInsertSchema(UsersTable);

export const NewUserSchema = UserBaseSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
});

export type NewUser = z.infer<typeof NewUserSchema>;

export const UpdateUserSchemaByUser = UserBaseSchema.pick({
  name: true,
  email: true,
  password: true,
  status: true,
});

export type UpdateUserByUser = z.infer<typeof UpdateUserSchemaByUser>;

export const UpdateUserSchemaByAdmin = UserBaseSchema.omit({
  id: true,
  email: true,
  password: true,
  createdAt: true,
}).partial();

export type UpdateUserByAdmin = z.infer<typeof UpdateUserSchemaByAdmin>;

export const UserRelations = relations(UsersTable, ({ many }) => ({
  books: many(BookTable),
  otps: many(OtpTable),
}));
