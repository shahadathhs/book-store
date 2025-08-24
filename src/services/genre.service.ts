import { BookGenreTable } from '@/db/schemas';
import { GenreRepository } from '@/repository/genre.repository';
import { BaseService } from '@/lib/core/BaseService';
import { injectable } from 'tsyringe';

@injectable()
export class GenreService extends BaseService<
  typeof BookGenreTable,
  GenreRepository
> {
  constructor(repository: GenreRepository) {
    super(repository);
  }
}
