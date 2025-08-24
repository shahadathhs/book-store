import { eq } from 'drizzle-orm';
import db from '../connect';
import { NewUser, UsersTable } from '../schemas/user';

export async function seedSuperAdmin() {
  // Check if super admin already exists
  const existing = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.role, 'super_admin'));

  if (existing.length > 0) {
    return existing[0];
  }

  const superAdmin: NewUser = {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'superSecurePassword', // hash this in production!
    role: 'super_admin',
  };

  const [created] = await db.insert(UsersTable).values(superAdmin).returning();

  return created;
}
