import { UsersTable } from '@/db/schemas/user';
import { BaseRepository } from '@/lib/core/BaseRepository';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserRepository extends BaseRepository<typeof UsersTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, UsersTable);
  }

  async findByEmail(email: string) {
    return this.db.executeQuery('find-user-by-email', async (client) => {
      const [user] = await client
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.email, email))
        .limit(1);

      return user ?? null;
    });
  }
}
