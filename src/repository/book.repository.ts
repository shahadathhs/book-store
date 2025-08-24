import { BaseRepository } from '@/lib/core/BaseRepository';
import { BookTable } from '@/db/schemas/book';
import { inject, injectable } from 'tsyringe';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';

@injectable()
export class BookRepository extends BaseRepository<typeof BookTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, BookTable);
  }
}
