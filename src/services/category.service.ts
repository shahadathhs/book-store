import { CategoryTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { CategoryRepository } from '@/repository/category.repository';
import { injectable } from 'tsyringe';

@injectable()
export class CategoryService extends BaseService<
  typeof CategoryTable,
  CategoryRepository
> {
  constructor(repository: CategoryRepository) {
    super(repository);
  }
}
