import { BaseRepository } from '@/lib/core/BaseRepository';
import { UsersTable } from '@/db/schemas/user';
import { inject, injectable } from 'tsyringe';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';

@injectable()
export class UserRepository extends BaseRepository<typeof UsersTable> {
	constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
		super(db, UsersTable);
	}
}
