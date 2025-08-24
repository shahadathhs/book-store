import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { AdminLogsTable } from './admin-log';
import { BookTable } from './book';
import { OtpTable } from './otp';

// * Enums
export const UserRole = pgEnum('user_roles', ['super_admin', 'admin', 'user']);
export const UserRoleEnum = z.enum(UserRole.enumValues);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const UserStatus = pgEnum('user_status', ['active', 'inactive']);
export const UserStatusEnum = z.enum(UserStatus.enumValues);
export type UserStatus = z.infer<typeof UserStatusEnum>;

export const UserLoginStatus = pgEnum('user_login_status', ['login', 'logout']);
export const UserLoginStatusEnum = z.enum(UserLoginStatus.enumValues);
export type UserLoginStatus = z.infer<typeof UserLoginStatusEnum>;

// * Table
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

// * Relations
export const UserRelations = relations(UsersTable, ({ many }) => ({
  books: many(BookTable),
  otps: many(OtpTable),
  adminLogs: many(AdminLogsTable),
}));

// * Types & Schemas
export type User = typeof UsersTable.$inferSelect;

const UserBaseSchema = createInsertSchema(UsersTable);

export const NewUserSchema = UserBaseSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
  status: true,
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
