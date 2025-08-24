import { BaseRepository } from '@/lib/core/BaseRepository';
import { CategoryTable } from '@/db/schemas/category';
import { inject, injectable } from 'tsyringe';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';

@injectable()
export class CategoryRepository extends BaseRepository<typeof CategoryTable> {
	constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
		super(db, CategoryTable);
	}
}
