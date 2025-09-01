import { UsersTable } from '@/db/schemas';
import { BaseService } from '@/lib/core/BaseService';
import { UserRepository } from '@/repository/user.repository';
import { injectable } from 'tsyringe';

@injectable()
export class UserService extends BaseService<
  typeof UsersTable,
  UserRepository
> {
  constructor(readonly repository: UserRepository) {
    super(repository);
  }

  async getUserByIdRaw(id: string) {
    return this.repository.findById(id);
  }
}
