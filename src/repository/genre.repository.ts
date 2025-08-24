import { BaseRepository } from '@/lib/core/BaseRepository';
import { BookGenreTable } from '@/db/schemas/book';
import { inject, injectable } from 'tsyringe';
import { DatabaseClientToken, IDatabaseClient } from '@/lib/db/IDatabaseClient';

@injectable()
export class GenreRepository extends BaseRepository<typeof BookGenreTable> {
  constructor(@inject(DatabaseClientToken) db: IDatabaseClient) {
    super(db, BookGenreTable);
  }
}
