import { ConfigEnum } from '@/lib/enum/config.enum';
import bcrypt from 'bcryptjs';
import config from 'config';
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

  const superAdminEmail = config.get<string>(ConfigEnum.SUPER_ADMIN_EMAIL);
  const superAdminPassword = config.get<string>(
    ConfigEnum.SUPER_ADMIN_PASSWORD,
  );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

  const superAdmin: NewUser = {
    name: 'Super Admin',
    email: superAdminEmail,
    password: hashedPassword,
    role: 'super_admin',
  };

  const [created] = await db.insert(UsersTable).values(superAdmin).returning();

  return created;
}
