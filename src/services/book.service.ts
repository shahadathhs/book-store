import { BookTable } from '@/db/schemas';
import { BookRepository } from '@/repository/book.repository';
import { BaseService } from '@/lib/core/BaseService';
import { injectable } from 'tsyringe';

@injectable()
export class BookService extends BaseService<typeof BookTable, BookRepository> {
  constructor(repository: BookRepository) {
    super(repository);
  }
}
