import { BaseRepository } from '@/lib/core/BaseRepository';
import { PublisherTable } from '@/db/schemas/book';
import { inject, injectable } from 'tsyringe';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';

@injectable()
export class PublisherRepository extends BaseRepository<typeof PublisherTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, PublisherTable);
  }
}
